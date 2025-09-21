// seedNursingData.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { v4: uuidv4 } = require('uuid');

// Days of the week
const daysOfWeek = [
  'Monday',
  'Tuesday', 
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

// Common nursing shift patterns
const shiftPatterns = [
  // Day shifts
  { start: '07:00', end: '19:00', name: 'Day Shift (12h)' },
  { start: '08:00', end: '16:00', name: 'Day Shift (8h)' },
  { start: '06:00', end: '14:00', name: 'Morning Shift' },
  
  // Evening shifts
  { start: '15:00', end: '23:00', name: 'Evening Shift' },
  { start: '14:00', end: '22:00', name: 'Afternoon Shift' },
  
  // Night shifts
  { start: '19:00', end: '07:00', name: 'Night Shift (12h)' },
  { start: '22:00', end: '06:00', name: 'Night Shift (8h)' },
  { start: '23:00', end: '07:00', name: 'Overnight Shift' },
  
  // Part-time shifts
  { start: '09:00', end: '13:00', name: 'Morning Part-time' },
  { start: '13:00', end: '17:00', name: 'Afternoon Part-time' },
  { start: '17:00', end: '21:00', name: 'Evening Part-time' }
];

// Utility function to generate random date within range
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Utility function to get random element from array
const getRandomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

// Utility function to get multiple random elements from array
const getRandomElements = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Create a datetime for a specific time on a given date
const createDateTime = (date, timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate;
};

// Create a datetime for the next day if shift crosses midnight
const createEndDateTime = (startDate, startTimeString, endTimeString) => {
  const [startHours] = startTimeString.split(':').map(Number);
  const [endHours] = endTimeString.split(':').map(Number);
  
  const endDate = new Date(startDate);
  const [hours, minutes] = endTimeString.split(':').map(Number);
  
  // If end time is earlier than start time, it's next day
  if (endHours < startHours) {
    endDate.setDate(endDate.getDate() + 1);
  }
  
  endDate.setHours(hours, minutes, 0, 0);
  return endDate;
};

// Check if two time periods overlap
const timesOverlap = (start1, end1, start2, end2) => {
  return start1 < end2 && start2 < end1;
};

// Generate realistic nurse schedule patterns
const generateNurseSchedulePattern = () => {
  const patterns = [
    // Full-time patterns (5 days)
    {
      days: getRandomElements(daysOfWeek.slice(0, 5), 5), // Monday to Friday
      shift: getRandomElement(shiftPatterns.slice(0, 8)) // Avoid part-time shifts
    },
    {
      days: getRandomElements(daysOfWeek.slice(0, 6), 5), // Monday to Saturday
      shift: getRandomElement(shiftPatterns.slice(0, 8))
    },
    
    // Weekend included patterns
    {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Saturday', 'Sunday'],
      shift: getRandomElement(shiftPatterns.slice(0, 8))
    },
    {
      days: ['Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday'],
      shift: getRandomElement(shiftPatterns.slice(0, 8))
    },
    
    // Part-time patterns (3-4 days)
    {
      days: getRandomElements(daysOfWeek, 3),
      shift: getRandomElement(shiftPatterns)
    },
    {
      days: getRandomElements(daysOfWeek, 4),
      shift: getRandomElement(shiftPatterns)
    },
    
    // Night shift patterns
    {
      days: ['Monday', 'Wednesday', 'Friday'],
      shift: shiftPatterns.find(s => s.name.includes('Night'))
    },
    {
      days: ['Tuesday', 'Thursday', 'Saturday'],
      shift: shiftPatterns.find(s => s.name.includes('Night'))
    }
  ];
  
  return getRandomElement(patterns);
};

async function seedNursingData() {
  try {
    console.log('🏥 Starting nursing data seeding...');

    // Get all existing nurses
    const nurses = await prisma.nurse.findMany({
      select: { id: true, firstName: true, lastName: true },
      orderBy: { createdAt: 'asc' }
    });
    
    console.log(`👩‍⚕️ Found ${nurses.length} existing nurses`);

    if (nurses.length === 0) {
      console.log('❌ No nurses found. Please ensure nurses are seeded first.');
      return;
    }

    // Get all existing wards for shifts
    const wards = await prisma.ward.findMany({
      select: { id: true, name: true }
    });
    
    console.log(`🏢 Found ${wards.length} existing wards`);

    if (wards.length === 0) {
      console.log('❌ No wards found. Please ensure wards are seeded first.');
      return;
    }

    // 1. Create Nurse Schedules
    console.log('📅 Creating nurse schedules...');
    const nurseSchedules = [];

    for (const nurse of nurses) {
      // Each nurse gets 1-2 schedule patterns
      const numberOfPatterns = Math.random() > 0.7 ? 2 : 1;
      
      for (let p = 0; p < numberOfPatterns; p++) {
        const pattern = generateNurseSchedulePattern();
        
        for (const day of pattern.days) {
          // Create a base date for time calculation (using Monday as reference)
          const baseDate = new Date('2024-01-01'); // This is a Monday
          const dayIndex = daysOfWeek.indexOf(day);
          baseDate.setDate(baseDate.getDate() + dayIndex);
          
          const startTime = createDateTime(baseDate, pattern.shift.start);
          const endTime = createEndDateTime(baseDate, pattern.shift.start, pattern.shift.end);
          
          const schedule = {
            id: uuidv4(),
            nurseId: nurse.id,
            startTime,
            endTime,
            dayOfWeek: day,
            createdAt: randomDate(new Date('2024-01-01'), new Date('2024-03-01')),
            updatedAt: new Date()
          };
          
          nurseSchedules.push(schedule);
        }
      }
    }

    // Remove duplicate schedules for same nurse/day
    const uniqueSchedules = [];
    const scheduleKeys = new Set();
    
    for (const schedule of nurseSchedules) {
      const key = `${schedule.nurseId}-${schedule.dayOfWeek}`;
      if (!scheduleKeys.has(key)) {
        scheduleKeys.add(key);
        uniqueSchedules.push(schedule);
      }
    }

    await prisma.nurseSchedule.createMany({
      data: uniqueSchedules,
      skipDuplicates: true
    });
    
    console.log(`✅ Seeded ${uniqueSchedules.length} nurse schedules`);

    // 2. Create Shifts (actual work assignments)
    console.log('⏰ Creating shifts...');
    const shifts = [];
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-12-31');

    // Generate shifts for each nurse over the year
    for (const nurse of nurses) {
      // Get this nurse's schedules
      const nurseScheduleData = uniqueSchedules.filter(s => s.nurseId === nurse.id);
      
      if (nurseScheduleData.length === 0) continue;

      // Generate shifts throughout the year based on their schedule
      const currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
        const nurseScheduleForDay = nurseScheduleData.find(s => s.dayOfWeek === dayName);
        
        if (nurseScheduleForDay) {
          // 80% chance they actually work their scheduled day (accounting for sick days, vacation, etc.)
          if (Math.random() > 0.2) {
            // Create shift based on their schedule
            const shiftStartTime = new Date(currentDate);
            const scheduleStart = new Date(nurseScheduleForDay.startTime);
            shiftStartTime.setHours(scheduleStart.getHours(), scheduleStart.getMinutes(), 0, 0);
            
            const shiftEndTime = new Date(currentDate);
            const scheduleEnd = new Date(nurseScheduleForDay.endTime);
            shiftEndTime.setHours(scheduleEnd.getHours(), scheduleEnd.getMinutes(), 0, 0);
            
            // Handle overnight shifts
            if (scheduleEnd.getHours() < scheduleStart.getHours()) {
              shiftEndTime.setDate(shiftEndTime.getDate() + 1);
            }
            
            // Add some variation (±30 minutes start time, ±1 hour end time)
            const startVariation = (Math.random() - 0.5) * 60 * 1000; // ±30 minutes in ms
            const endVariation = (Math.random() - 0.5) * 2 * 60 * 60 * 1000; // ±1 hour in ms
            
            shiftStartTime.setTime(shiftStartTime.getTime() + startVariation);
            shiftEndTime.setTime(shiftEndTime.getTime() + endVariation);
            
            // Assign to a random ward (in real system, this would be more strategic)
            const assignedWard = getRandomElement(wards);
            
            const shift = {
              id: uuidv4(),
              nurseId: nurse.id,
              wardId: assignedWard.id,
              startTime: shiftStartTime,
              endTime: shiftEndTime,
              createdAt: randomDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000), currentDate),
              updatedAt: new Date()
            };
            
            shifts.push(shift);
          }
        }
        
        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    // Add some extra shifts for coverage (overtime, double shifts, etc.)
    const extraShiftCount = Math.floor(shifts.length * 0.1); // 10% extra shifts
    console.log(`📋 Adding ${extraShiftCount} extra shifts for coverage...`);
    
    for (let i = 0; i < extraShiftCount; i++) {
      const randomNurse = getRandomElement(nurses);
      const randomWard = getRandomElement(wards);
      const randomShift = getRandomElement(shiftPatterns);
      
      const shiftDate = randomDate(startDate, endDate);
      const shiftStartTime = createDateTime(shiftDate, randomShift.start);
      const shiftEndTime = createEndDateTime(shiftDate, randomShift.start, randomShift.end);
      
      const shift = {
        id: uuidv4(),
        nurseId: randomNurse.id,
        wardId: randomWard.id,
        startTime: shiftStartTime,
        endTime: shiftEndTime,
        createdAt: randomDate(new Date(shiftDate.getTime() - 7 * 24 * 60 * 60 * 1000), shiftDate),
        updatedAt: new Date()
      };
      
      shifts.push(shift);
    }

    // Remove shifts that would create impossible overlaps for same nurse
    const validShifts = [];
    const nurseShiftMap = new Map();
    
    // Group shifts by nurse
    shifts.forEach(shift => {
      if (!nurseShiftMap.has(shift.nurseId)) {
        nurseShiftMap.set(shift.nurseId, []);
      }
      nurseShiftMap.get(shift.nurseId).push(shift);
    });
    
    // For each nurse, remove overlapping shifts
    nurseShiftMap.forEach((nurseShifts, nurseId) => {
      nurseShifts.sort((a, b) => a.startTime - b.startTime);
      
      for (let i = 0; i < nurseShifts.length; i++) {
        const currentShift = nurseShifts[i];
        let isValid = true;
        
        // Check against already validated shifts for this nurse
        for (const validShift of validShifts.filter(s => s.nurseId === nurseId)) {
          if (timesOverlap(
            currentShift.startTime, 
            currentShift.endTime,
            validShift.startTime,
            validShift.endTime
          )) {
            isValid = false;
            break;
          }
        }
        
        if (isValid) {
          validShifts.push(currentShift);
        }
      }
    });

    await prisma.shift.createMany({
      data: validShifts,
      skipDuplicates: true
    });
    
    console.log(`✅ Seeded ${validShifts.length} shifts`);

    // Print summary statistics
    console.log('\n📊 Seeding Summary:');
    console.log(`👩‍⚕️ Nurses processed: ${nurses.length}`);
    console.log(`📅 Unique schedules created: ${uniqueSchedules.length}`);
    console.log(`⏰ Valid shifts created: ${validShifts.length}`);
    console.log(`🏢 Wards utilized: ${wards.length}`);
    
    // Print some sample data
    console.log('\n🔍 Sample Schedule:');
    const sampleNurse = nurses[0];
    const sampleSchedules = uniqueSchedules.filter(s => s.nurseId === sampleNurse.id);
    const sampleShifts = validShifts.filter(s => s.nurseId === sampleNurse.id).slice(0, 3);
    
    console.log(`Nurse: ${sampleNurse.firstName} ${sampleNurse.lastName}`);
    console.log('Weekly Schedule:');
    sampleSchedules.forEach(schedule => {
      console.log(`  ${schedule.dayOfWeek}: ${schedule.startTime.toLocaleTimeString()} - ${schedule.endTime.toLocaleTimeString()}`);
    });
    
    if (sampleShifts.length > 0) {
      console.log('Recent Shifts:');
      sampleShifts.forEach(shift => {
        console.log(`  ${shift.startTime.toLocaleDateString()}: ${shift.startTime.toLocaleTimeString()} - ${shift.endTime.toLocaleTimeString()}`);
      });
    }

  } catch (error) {
    console.error('❌ Error seeding nursing data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedNursingData()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
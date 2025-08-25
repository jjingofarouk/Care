const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Operation Theatre seed process...');
  
  try {
    // Test database connection first
    console.log('📡 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Fetch existing data with logging
    console.log('🔍 Fetching departments...');
    const departments = await prisma.department.findMany();
    console.log(`Found ${departments.length} departments`);

    console.log('🔍 Fetching patients...');
    const patients = await prisma.patient.findMany();
    console.log(`Found ${patients.length} patients`);

    console.log('🔍 Fetching users...');
    const users = await prisma.userRegistration.findMany();
    console.log(`Found ${users.length} users`);

    if (departments.length === 0 || patients.length === 0 || users.length === 0) {
      console.error('❌ Required data missing:');
      console.error(`- Departments: ${departments.length}`);
      console.error(`- Patients: ${patients.length}`);
      console.error(`- Users: ${users.length}`);
      console.error('Please seed those tables first.');
      return;
    }

    // Seed Theatres
    console.log('🏥 Creating theatres...');
    const theatreNames = ['Main Theatre', 'Cardiac Theatre', 'Neuro Theatre', 'Emergency Theatre', 'General Surgery Theatre'];
    const theatres = [];
    
    for (let i = 0; i < theatreNames.length; i++) {
      const name = theatreNames[i];
      console.log(`Creating theatre: ${name}`);
      
      const theatre = await prisma.theatre.upsert({
        where: { name },
        update: {},
        create: {
          name,
          departmentId: departments[Math.floor(Math.random() * departments.length)].id,
        },
      });
      theatres.push(theatre);
    }
    console.log(`✅ Created ${theatres.length} theatres`);

    // Seed Surgical Teams
    console.log('👥 Creating surgical teams...');
    const teamNames = ['Alpha Team', 'Beta Team', 'Cardiac Team', 'Neuro Team', 'Emergency Team'];
    const surgicalTeams = [];
    
    for (const name of teamNames) {
      console.log(`Creating team: ${name}`);
      
      const team = await prisma.surgicalTeam.upsert({
        where: { name },
        update: {},
        create: { name },
      });
      surgicalTeams.push(team);
    }
    console.log(`✅ Created ${surgicalTeams.length} surgical teams`);

    // Seed Surgical Team Members
    console.log('👨‍⚕️ Creating team members...');
    const roles = ['SURGEON', 'ASSISTANT', 'ANESTHESIOLOGIST', 'SCRUB_NURSE', 'CIRCULATING_NURSE', 'TECHNICIAN'];
    let memberCount = 0;
    
    for (const team of surgicalTeams) {
      const assignedUsers = new Set();
      for (let i = 0; i < 3; i++) {
        let user;
        do {
          user = users[Math.floor(Math.random() * users.length)];
        } while (assignedUsers.has(user.id));
        assignedUsers.add(user.id);

        await prisma.surgicalTeamMember.create({
          data: {
            surgicalTeamId: team.id,
            userId: user.id,
            role: roles[Math.floor(Math.random() * roles.length)],
          },
        });
        memberCount++;
      }
    }
    console.log(`✅ Created ${memberCount} team members`);

    // Seed Pre-Op Assessments
    console.log('📋 Creating pre-op assessments...');
    const preOpAssessments = [];
    for (let i = 0; i < 15; i++) {
      const patient = patients[Math.floor(Math.random() * patients.length)];
      const assessment = await prisma.preOpAssessment.create({
        data: {
          patientId: patient.id,
          assessment: `Vitals stable, cleared for surgery.`,
          assessedAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
        },
      });
      preOpAssessments.push(assessment);
      
      if ((i + 1) % 5 === 0) {
        console.log(`Created ${i + 1}/15 pre-op assessments`);
      }
    }
    console.log(`✅ Created ${preOpAssessments.length} pre-op assessments`);

    // Seed Surgeries
    console.log('🔪 Creating surgeries...');
    const surgeryTypes = ['Appendectomy', 'Cholecystectomy', 'Knee Arthroscopy', 'Hip Replacement', 'Coronary Bypass'];
    const statuses = ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
    const surgeries = [];
    
    for (let i = 0; i < 20; i++) {
      const patient = patients[Math.floor(Math.random() * patients.length)];
      const theatre = theatres[Math.floor(Math.random() * theatres.length)];
      const team = surgicalTeams[Math.floor(Math.random() * surgicalTeams.length)];
      const preOp = Math.random() > 0.5 ? preOpAssessments[Math.floor(Math.random() * preOpAssessments.length)] : null;
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      const surgery = await prisma.surgery.create({
        data: {
          patientId: patient.id,
          theatreId: theatre.id,
          surgicalTeamId: team.id,
          preOpAssessmentId: preOp?.id || null,
          type: surgeryTypes[Math.floor(Math.random() * surgeryTypes.length)],
          estimatedDurationMinutes: Math.floor(Math.random() * 180) + 30,
          actualDurationMinutes: status === 'COMPLETED' ? Math.floor(Math.random() * 180) + 30 : null,
          status,
          notes: `Surgery notes`,
          complications: status === 'COMPLETED' && Math.random() > 0.8 ? `Minor complication` : null,
        },
      });
      surgeries.push(surgery);
      
      if ((i + 1) % 5 === 0) {
        console.log(`Created ${i + 1}/20 surgeries`);
      }
    }
    console.log(`✅ Created ${surgeries.length} surgeries`);

    // Seed Anesthesia Records
    console.log('💉 Creating anesthesia records...');
    const anesthesiaTypes = ['General', 'Local', 'Regional', 'Spinal'];
    for (let i = 0; i < 10; i++) {
      await prisma.anesthesiaRecord.create({
        data: {
          surgeryId: surgeries[i].id,
          type: anesthesiaTypes[Math.floor(Math.random() * anesthesiaTypes.length)],
          notes: `Anesthesia administered`,
          administeredAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
        },
      });
    }
    console.log(`✅ Created 10 anesthesia records`);

    // Seed Post-Op Recoveries
    console.log('🏥 Creating post-op recoveries...');
    for (let i = 10; i < 20; i++) {
      await prisma.postOpRecovery.create({
        data: {
          surgeryId: surgeries[i].id,
          recoveryNotes: `Recovery progressing well`,
          dischargeDate: Math.random() > 0.3 ? new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)) : null,
          complications: Math.random() > 0.8 ? `Minor infection` : null,
        },
      });
    }
    console.log(`✅ Created 10 post-op recoveries`);

    // Seed Surgery Audit Logs
    console.log('📝 Creating audit logs...');
    const fields = ['status', 'notes', 'complications'];
    for (let i = 0; i < 15; i++) {
      const surgery = surgeries[Math.floor(Math.random() * surgeries.length)];
      const user = users[Math.floor(Math.random() * users.length)];
      const fieldChanged = fields[Math.floor(Math.random() * fields.length)];
      
      await prisma.surgeryAuditLog.create({
        data: {
          surgeryId: surgery.id,
          changedById: user.id,
          fieldChanged,
          oldValue: `Old ${fieldChanged}`,
          newValue: `New ${fieldChanged}`,
          changedAt: new Date(Date.now() - Math.floor(Math.random() * 15 * 24 * 60 * 60 * 1000)),
        },
      });
    }
    console.log(`✅ Created 15 audit logs`);

    // Final count
    console.log('📊 Getting final counts...');
    const counts = await Promise.all([
      prisma.theatre.count(),
      prisma.surgicalTeam.count(),
      prisma.surgicalTeamMember.count(),
      prisma.preOpAssessment.count(),
      prisma.anesthesiaRecord.count(),
      prisma.postOpRecovery.count(),
      prisma.surgery.count(),
      prisma.surgeryAuditLog.count()
    ]);

    console.log('🎉 Operation Theatre seed completed successfully!');
    console.log('\n📊 Final Summary:');
    console.log(`- Theatres: ${counts[0]}`);
    console.log(`- Surgical Teams: ${counts[1]}`);
    console.log(`- Team Members: ${counts[2]}`);
    console.log(`- Pre-Op Assessments: ${counts[3]}`);
    console.log(`- Anesthesia Records: ${counts[4]}`);
    console.log(`- Post-Op Recoveries: ${counts[5]}`);
    console.log(`- Surgeries: ${counts[6]}`);
    console.log(`- Audit Logs: ${counts[7]}`);

  } catch (error) {
    console.error('💥 Detailed error information:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    if (error.meta) {
      console.error('Error meta:', error.meta);
    }
    console.error('Full error:', error);
    throw error;
  }
}

main()
  .then(async () => {
    console.log('🔌 Disconnecting from database...');
    await prisma.$disconnect();
    console.log('✅ Disconnected successfully');
  })
  .catch(async (e) => {
    console.error('❌ Fatal error during seed process:', e.message);
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error('❌ Error disconnecting:', disconnectError.message);
    }
    process.exit(1);
  });
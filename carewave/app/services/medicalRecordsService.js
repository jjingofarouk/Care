// medicalRecordsService.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAllMedicalRecords(filters = {}) {
  try {
    const records = await prisma.medicalRecord.findMany({
      where: {
        ...(filters.patientId && { patientId: filters.patientId }),
        ...(filters.dateFrom && filters.dateTo && {
          recordDate: {
            gte: new Date(filters.dateFrom),
            lte: new Date(filters.dateTo),
          },
        }),
      },
      include: {
        patient: { select: { id: true, firstName: true, lastName: true } },
        doctor: { select: { id: true, firstName: true, lastName: true } },
        allergies: true,
        diagnoses: true,
        vitalSigns: true,
        chiefComplaints: true,
        presentIllnesses: true,
        pastConditions: true,
        surgicalHistories: true,
        familyHistories: true,
        medicationHistories: true,
        socialHistories: true,
        reviewOfSystems: true,
        immunizations: true,
        travelHistories: true,
      },
      orderBy: { recordDate: 'asc' },
    });

    return records.map(record => ({
      ...record,
      patient: record.patient ? {
        ...record.patient,
        name: `${record.patient.firstName} ${record.patient.lastName}`
      } : null,
      doctor: record.doctor ? {
        ...record.doctor,
        name: `${record.doctor.firstName} ${record.doctor.lastName}`
      } : null,
    }));
  } catch (error) {
    console.error('Error fetching medical records:', error);
    throw error;
  }
}

export async function getMedicalRecordById(id, resource = '') {
  try {
    const include = resource ? { [resource]: true } : {
      patient: { select: { id: true, firstName: true, lastName: true } },
      doctor: { select: { id: true, firstName: true, lastName: true } },
      allergies: true,
      diagnoses: true,
      vitalSigns: true,
      chiefComplaints: true,
      presentIllnesses: true,
      pastConditions: true,
      surgicalHistories: true,
      familyHistories: true,
      medicationHistories: true,
      socialHistories: true,
      reviewOfSystems: true,
      immunizations: true,
      travelHistories: true,
    };

    const record = await prisma.medicalRecord.findUnique({
      where: { id },
      include,
    });

    if (!record) {
      throw new Error('Medical record not found');
    }

    return {
      ...record,
      patient: record.patient ? {
        ...record.patient,
        name: `${record.patient.firstName} ${record.patient.lastName}`
      } : null,
      doctor: record.doctor ? {
        ...record.doctor,
        name: `${record.doctor.firstName} ${record.doctor.lastName}`
      } : null,
    };
  } catch (error) {
    console.error('Error fetching medical record:', error);
    throw error;
  }
}

export async function createMedicalRecord(data) {
  try {
    const record = await prisma.medicalRecord.create({
      data: {
        patientId: data.patientId,
        doctorId: data.doctorId,
        recordDate: new Date(data.recordDate),
        notes: data.notes,
      },
      include: {
        patient: { select: { id: true, firstName: true, lastName: true } },
        doctor: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    return {
      ...record,
      patient: record.patient ? {
        ...record.patient,
        name: `${record.patient.firstName} ${record.patient.lastName}`
      } : null,
      doctor: record.doctor ? {
        ...record.doctor,
        name: `${record.doctor.firstName} ${record.doctor.lastName}`
      } : null,
    };
  } catch (error) {
    console.error('Error creating medical record:', error);
    throw error;
  }
}

export async function updateMedicalRecord(id, data) {
  try {
    const record = await prisma.medicalRecord.update({
      where: { id },
      data: {
        ...(data.patientId && { patientId: data.patientId }),
        ...(data.doctorId && { doctorId: data.doctorId }),
        ...(data.recordDate && { recordDate: new Date(data.recordDate) }),
        ...(data.notes && { notes: data.notes }),
      },
      include: {
        patient: { select: { id: true, firstName: true, lastName: true } },
        doctor: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    return {
      ...record,
      patient: record.patient ? {
        ...record.patient,
        name: `${record.patient.firstName} ${record.patient.lastName}`
      } : null,
      doctor: record.doctor ? {
        ...record.doctor,
        name: `${record.doctor.firstName} ${record.doctor.lastName}`
      } : null,
    };
  } catch (error) {
    console.error('Error updating medical record:', error);
    throw error;
  }
}

export async function deleteMedicalRecord(id) {
  try {
    return await prisma.medicalRecord.delete({
      where: { id },
    });
  } catch (error) {
    console.error('Error deleting medical record:', error);
    throw error;
  }
}

const resourceTypes = [
  { name: 'allergy', model: 'allergy', fields: ['medicalRecordId', 'name', 'severity'] },
  { name: 'diagnosis', model: 'diagnosis', fields: ['medicalRecordId', 'code', 'description', 'diagnosedAt'] },
  { name: 'vitalSign', model: 'vitalSign', fields: ['medicalRecordId', 'recordedAt'] },
  { name: 'chiefComplaint', model: 'chiefComplaint', fields: ['medicalRecordId', 'description', 'duration'] },
  { name: 'presentIllness', model: 'presentIllness', fields: ['medicalRecordId', 'narrative'] },
  { name: 'pastCondition', model: 'pastCondition', fields: ['medicalRecordId', 'condition', 'diagnosisDate'] },
  { name: 'surgicalHistory', model: 'surgicalHistory', fields: ['medicalRecordId', 'procedure', 'datePerformed'] },
  { name: 'familyHistory', model: 'familyHistory', fields: ['medicalRecordId', 'relative', 'condition', 'ageAtDiagnosis'] },
  { name: 'medicationHistory', model: 'medicationHistory', fields: ['medicalRecordId', 'medicationName', 'startDate', 'endDate'] },
  { name: 'socialHistory', model: 'socialHistory', fields: ['medicalRecordId'] },
  { name: 'reviewOfSystems', model: 'reviewOfSystem', fields: ['medicalRecordId', 'system', 'findings'] },
  { name: 'immunization', model: 'immunization', fields: ['medicalRecordId', 'vaccine', 'dateGiven'] },
  { name: 'travelHistory', model: 'travelHistory', fields: ['medicalRecordId', 'countryVisited', 'dateFrom', 'dateTo'] },
];

resourceTypes.forEach(({ name, model, fields }) => {
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

  exports[`get${capitalizedName}s`] = async (patientId) => {
    try {
      const resources = await prisma[model].findMany({
        where: { 
          patientId,
          medicalRecord: { patientId }
        },
        include: { medicalRecord: true },
      });
      return resources;
    } catch (error) {
      console.error(`Error fetching ${name}s:`, error);
      throw error;
    }
  };

  exports[`get${capitalizedName}ById`] = async (id) => {
    try {
      const resource = await prisma[model].findUnique({
        where: { id },
        include: { medicalRecord: true },
      });
      if (!resource) throw new Error(`${capitalizedName} not found`);
      return resource;
    } catch (error) {
      console.error(`Error fetching ${name}:`, error);
      throw error;
    }
  };

  exports[`create${capitalizedName}`] = async (data) => {
    try {
      const resourceData = {};
      fields.forEach(field => {
        if (data[field]) {
          resourceData[field] = field.includes('Date') || field.includes('At') ? new Date(data[field]) : data[field];
        }
      });

      const resource = await prisma[model].create({
        data: {
          ...resourceData,
          patientId: data.patientId,
          medicalRecord: { connect: { id: data.medicalRecordId } },
        },
        include: { medicalRecord: true },
      });
      return resource;
    } catch (error) {
      console.error(`Error creating ${name}:`, error);
      throw error;
    }
  };

  exports[`update${capitalizedName}`] = async (id, data) => {
    try {
      const resourceData = {};
      fields.forEach(field => {
        if (data[field]) {
          resourceData[field] = field.includes('Date') || field.includes('At') ? new Date(data[field]) : data[field];
        }
      });

      const resource = await prisma[model].update({
        where: { id },
        data: resourceData,
        include: { medicalRecord: true },
      });
      return resource;
    } catch (error) {
      console.error(`Error updating ${name}:`, error);
      throw error;
    }
  };

  exports[`delete${capitalizedName}`] = async (id) => {
    try {
      return await prisma[model].delete({
        where: { id },
      });
    } catch (error) {
      console.error(`Error deleting ${name}:`, error);
      throw error;
    }
  };
});

export async function bulkCreateMedicalRecords(records) {
  try {
    const createdRecords = await prisma.$transaction(
      records.map(record => prisma.medicalRecord.create({
        data: {
          patientId: record.patientId,
          doctorId: record.doctorId,
          recordDate: new Date(record.recordDate),
          notes: record.notes,
        },
        include: {
          patient: { select: { id: true, firstName: true, lastName: true } },
          doctor: { select: { id: true, firstName: true, lastName: true } },
        },
      }))
    );

    return createdRecords.map(record => ({
      ...record,
      patient: record.patient ? {
        ...record.patient,
        name: `${record.patient.firstName} ${record.patient.lastName}`
      } : null,
      doctor: record.doctor ? {
        ...record.doctor,
        name: `@${record.doctor.firstName} ${record.doctor.lastName}`
      } : null,
    }));
  } catch (error) {
    console.error('Error bulk creating medical records:', error);
    throw error;
  }
}

export async function bulkDeleteMedicalRecords(ids) {
  try {
    const deleteResults = await prisma.$transaction(
      ids.map(id => prisma.medicalRecord.delete({ where: { id } }))
    );
    return {
      successful: deleteResults.length,
      failed: 0,
      total: ids.length,
      errors: [],
    };
  } catch (error) {
    console.error('Error in bulk delete medical records:', error);
    throw error;
  }
}

export async function getMedicalRecordStats(filters = {}) {
  try {
    const where = {
      ...(filters.patientId && { patientId: filters.patientId }),
      ...(filters.dateFrom && filters.dateTo && {
        recordDate: {
          gte: new Date(filters.dateFrom),
          lte: new Date(filters.dateTo),
        },
      }),
    };

    const [totalRecords, totalAllergies, totalDiagnoses] = await Promise.all([
      prisma.medicalRecord.count({ where }),
      prisma.allergy.count({ where: { medicalRecord: where } }),
      prisma.diagnosis.count({ where: { medicalRecord: where } }),
    ]);

    return {
      totalRecords,
      totalAllergies,
      totalDiagnoses,
      averageRecordsPerPatient: totalRecords > 0 ? totalRecords / (await prisma.patient.count()) : 0,
    };
  } catch (error) {
    console.error('Error fetching medical record stats:', error);
    throw error;
  }
}

export async function getRecentMedicalRecords(limit = 10) {
  try {
    const records = await prisma.medicalRecord.findMany({
      take: limit,
      orderBy: { recordDate: 'desc' },
      include: {
        patient: { select: { id: true, firstName: true, lastName: true } },
        doctor: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    return records.map(record => ({
      ...record,
      patient: record.patient ? {
        ...record.patient,
        name: `${record.patient.firstName} ${record.patient.lastName}`
      } : null,
      doctor: record.doctor ? {
        ...record.doctor,
        name: `${record.doctor.firstName} ${record.doctor.lastName}`
      } : null,
    }));
  } catch (error) {
    console.error('Error fetching recent medical records:', error);
    throw error;
  }
}

const medicalRecordsService = {
  getAllMedicalRecords,
  getMedicalRecordById,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
  bulkCreateMedicalRecords,
  bulkDeleteMedicalRecords,
  getMedicalRecordStats,
  getRecentMedicalRecords,
  ...resourceTypes.reduce((acc, { name }) => ({
    ...acc,
    [`get${name.charAt(0).toUpperCase() + name.slice(1)}s`]: exports[`get${name.charAt(0).toUpperCase() + name.slice(1)}s`],
    [`get${name.charAt(0).toUpperCase() + name.slice(1)}ById`]: exports[`get${name.charAt(0).toUpperCase() + name.slice(1)}ById`],
    [`create${name.charAt(0).toUpperCase() + name.slice(1)}`]: exports[`create${name.charAt(0).toUpperCase() + name.slice(1)}`],
    [`update${name.charAt(0).toUpperCase() + name.slice(1)}`]: exports[`update${name.charAt(0).toUpperCase() + name.slice(1)}`],
    [`delete${name.charAt(0).toUpperCase() + name.slice(1)}`]: exports[`delete${name.charAt(0).toUpperCase() + name.slice(1)}`],
  }), {}),
};

export default medicalRecordsService;
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Authenticate requests using JWT
const authenticate = (request) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '');
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

// GET handler for fetching pharmacy resources
export async function GET(request) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const resource = searchParams.get('resource');

  try {
    if (resource === 'prescriptions') {
      const prescriptions = await prisma.prescription.findMany({
        include: {
          patient: { include: { user: { select: { id: true, name: true, email: true } } } },
          doctor: { include: { user: { select: { id: true, name: true, email: true } } } },
          items: { include: { medication: { select: { id: true, name: true, price: true } } } },
          dispensingRecords: { include: { medication: true, dispensedBy: { select: { id: true, name: true } } } },
          invoice: true,
        },
      });
      return NextResponse.json({ prescriptions });
    }

    if (resource === 'inventory') {
      const inventory = await prisma.medication.findMany({
        include: {
          supplier: { select: { id: true, name: true } },
          formulary: { select: { id: true, name: true } },
          dispensingRecords: true,
          stockAdjustments: true,
        },
      });
      return NextResponse.json({ inventory });
    }

    if (resource === 'suppliers') {
      const suppliers = await prisma.supplier.findMany({
        include: {
          medications: { select: { id: true, name: true } },
          purchaseOrders: true,
        },
      });
      return NextResponse.json({ suppliers });
    }

    if (resource === 'formularies') {
      const formularies = await prisma.formulary.findMany({
        include: {
          medications: { select: { id: true, name: true } },
        },
      });
      return NextResponse.json({
        formularies: formularies.map(formulary => ({
          ...formulary,
          medications: Array.isArray(formulary.medications) ? formulary.medications : [],
        })),
      });
    }

    if (resource === 'pharmacists') {
      const pharmacists = await prisma.user.findMany({
        where: { role: 'PHARMACIST' },
        include: {
          doctor: { select: { licenseNumber: true, phone: true, specialty: true } },
        },
      });
      return NextResponse.json({
        pharmacists: pharmacists.map(u => ({
          id: u.id,
          user: { name: u.name, email: u.email },
          licenseNumber: u.doctor?.licenseNumber || '',
          phone: u.doctor?.phone || '',
          specialty: u.doctor?.specialty || '',
        })),
      });
    }

    if (resource === 'stockAlerts') {
      const stockAlerts = await prisma.medication.findMany({
        where: { stockQuantity: { lte: prisma.medication.fields.minStockThreshold } },
        include: { supplier: { select: { id: true, name: true } } },
      });
      return NextResponse.json({ stockAlerts });
    }

    if (resource === 'orders') {
      const orders = await prisma.purchaseOrder.findMany({
        include: {
          supplier: { select: { id: true, name: true } },
          items: { include: { medication: { select: { id: true, name: true } } } },
        },
      });
      return NextResponse.json({ orders });
    }

    if (resource === 'drugInteractions') {
      const medicationIds = searchParams.get('medicationIds')?.split(',').map(Number) || [];
      const interactions = await prisma.drugInteraction.findMany({
        where: {
          OR: [
            { medicationId1: { in: medicationIds } },
            { medicationId2: { in: medicationIds } },
          ],
        },
        include: {
          medication1: { select: { id: true, name: true } },
          medication2: { select: { id: true, name: true } },
        },
      });
      return NextResponse.json({ interactions });
    }

    const [allPrescriptions, allInventory, allSuppliers, allFormularies, allPharmacists, allStockAlerts, allOrders] = await Promise.all([
      prisma.prescription.findMany({
        include: {
          patient: { include: { user: { select: { id: true, name: true, email: true } } } },
          doctor: { include: { user: { select: { id: true, name: true, email: true } } } },
          items: { include: { medication: { select: { id: true, name: true, price: true } } } },
          dispensingRecords: { include: { medication: true, dispensedBy: { select: { id: true, name: true } } } },
          invoice: true,
        },
      }),
      prisma.medication.findMany({
        include: {
          supplier: { select: { id: true, name: true } },
          formulary: { select: { id: true, name: true } },
          dispensingRecords: true,
          stockAdjustments: true,
        },
      }),
      prisma.supplier.findMany({
        include: {
          medications: { select: { id: true, name: true } },
          purchaseOrders: true,
        },
      }),
      prisma.formulary.findMany({
        include: { medications: { select: { id: true, name: true } } },
      }),
      prisma.user.findMany({
        where: { role: 'PHARMACIST' },
        include: { doctor: { select: { licenseNumber: true, phone: true, specialty: true } } },
      }),
      prisma.medication.findMany({
        where: { stockQuantity: { lte: prisma.medication.fields.minStockThreshold } },
        include: { supplier: { select: { id: true, name: true } } },
      }),
      prisma.purchaseOrder.findMany({
        include: {
          supplier: { select: { id: true, name: true } },
          items: { include: { medication: { select: { id: true, name: true } } } },
        },
      }),
    ]);
    return NextResponse.json({
      prescriptions: allPrescriptions,
      inventory: allInventory,
      suppliers: allSuppliers,
      formularies: allFormularies.map(formulary => ({
        ...formulary,
        medications: Array.isArray(formulary.medications) ? formulary.medications : [],
      })),
      pharmacists: allPharmacists.map(u => ({
        id: u.id,
        user: { name: u.name, email: u.email },
        licenseNumber: u.doctor?.licenseNumber || '',
        phone: u.doctor?.phone || '',
        specialty: u.doctor?.specialty || '',
      })),
      stockAlerts: allStockAlerts,
      orders: allOrders,
    });
  } catch (error) {
    console.error('GET /api/pharmacy error:', error);
    return NextResponse.json({ error: 'Failed to fetch pharmacy data', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// POST handler for creating pharmacy resources
export async function POST(request) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();
    const { action, payload } = data;

    if (action === 'createPrescription') {
      const { patientId, doctorId, notes, items } = payload;
      if (!patientId || !doctorId || !items || !items.length) {
        return NextResponse.json({ error: 'Missing required fields: patientId, doctorId, or items' }, { status: 400 });
      }
      const prescription = await prisma.prescription.create({
        data: {
          patient: { connect: { id: parseInt(patientId) } },
          doctor: { connect: { id: parseInt(doctorId) } },
          notes,
          status: 'PENDING',
          prescriptionDate: new Date(),
          items: {
            create: items.map(item => ({
              medication: { connect: { id: parseInt(item.medicationId) } },
              quantity: parseInt(item.quantity),
              dosage: item.dosage,
              frequency: item.frequency || 'As needed',
              duration: item.duration || 'Until finished',
            })),
          },
        },
        include: {
          patient: { include: { user: { select: { id: true, name: true, email: true } } } },
          doctor: { include: { user: { select: { id: true, name: true, email: true } } } },
          items: { include: { medication: { select: { id: true, name: true, price: true } } } },
        },
      });
      await prisma.invoice.create({
        data: {
          prescription: { connect: { id: prescription.id } },
          totalAmount: prescription.items.reduce((sum, item) => sum + (item.quantity * item.medication.price), 0),
          status: 'PENDING',
        },
      });
      return NextResponse.json(prescription, { status: 201 });
    }

    if (action === 'dispenseMedication') {
      const { prescriptionId, medicationId, quantity, patientType, dispensedById } = payload;
      if (!prescriptionId || !medicationId || !quantity || !patientType || !dispensedById) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }
      const medication = await prisma.medication.findUnique({
        where: { id: parseInt(medicationId) },
        select: { id: true, stockQuantity: true, price: true },
      });
      if (!medication) {
        return NextResponse.json({ error: 'Medication not found' }, { status: 404 });
      }
      if (medication.stockQuantity < quantity) {
        return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
      }
      const prescription = await prisma.prescription.findUnique({
        where: { id: parseInt(prescriptionId) },
        include: { items: { include: { medication: { select: { id: true, name: true } } } } },
      });
      if (!prescription) {
        return NextResponse.json({ error: 'Prescription not found' }, { status: 404 });
      }
      const item = prescription.items.find(i => i.medicationId === parseInt(medicationId));
      if (!item || item.quantity < quantity) {
        return NextResponse.json({ error: 'Invalid quantity for prescription item' }, { status: 400 });
      }
      const dispensingRecord = await prisma.dispensingRecord.create({
        data: {
          prescription: { connect: { id: parseInt(prescriptionId) } },
          medication: { connect: { id: parseInt(medicationId) } },
          quantity: parseInt(quantity),
          patientType,
          dispensedBy: { connect: { id: parseInt(dispensedById) } },
          dispensedDate: new Date(),
          invoice: { connect: { prescriptionId: parseInt(prescriptionId) } },
        },
        include: {
          medication: { select: { id: true, name: true } },
          dispensedBy: { select: { id: true, name: true } },
          prescription: { include: { patient: { include: { user: { select: { id: true, name: true } } } } } },
        },
      });
      await prisma.medication.update({
        where: { id: parseInt(medicationId) },
        data: { stockQuantity: { decrement: parseInt(quantity) } },
      });
      const totalDispensed = await prisma.dispensingRecord.aggregate({
        _sum: { quantity: true },
        where: { prescriptionId: parseInt(prescriptionId), medicationId: parseInt(medicationId) },
      });
      if (prescription.items.every(i => {
        const dispensed = totalDispensed._sum.quantity || 0;
        return dispensed >= i.quantity;
      })) {
        await prisma.prescription.update({
          where: { id: parseInt(prescriptionId) },
          data: { status: 'DISPENSED' },
        });
      }
      return NextResponse.json(dispensingRecord, { status: 201 });
    }

    if (action === 'addMedication') {
      const { name, genericName, category, batchNumber, barcode, rfid, stockQuantity, minStockThreshold, price, expiryDate, supplierId, formularyId, narcotic } = payload;
      if (!name || !category || !batchNumber || !stockQuantity || !price || !expiryDate) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }
      const medication = await prisma.medication.create({
        data: {
          name,
          genericName,
          category,
          batchNumber,
          barcode,
          rfid,
          stockQuantity: parseInt(stockQuantity),
          minStockThreshold: parseInt(minStockThreshold) || 10,
          price: parseFloat(price),
          expiryDate: new Date(expiryDate),
          supplier: supplierId ? { connect: { id: parseInt(supplierId) } } : undefined,
          formulary: formularyId ? { connect: { id: parseInt(formularyId) } } : undefined,
          narcotic: narcotic || false,
        },
        include: {
          supplier: { select: { id: true, name: true } },
          formulary: { select: { id: true, name: true } },
        },
      });
      return NextResponse.json(medication, { status: 201 });
    }

    if (action === 'addFormulary') {
      const { name, description, medicationIds } = payload;
      if (!name) {
        return NextResponse.json({ error: 'Missing required field: name' }, { status: 400 });
      }
      const formulary = await prisma.formulary.create({
        data: {
          name,
          description,
          medications: medicationIds && medicationIds.length ? {
            connect: medicationIds.map(id => ({ id: parseInt(id) })),
          } : undefined,
        },
        include: { medications: { select: { id: true, name: true } } },
      });
      return NextResponse.json({
        ...formulary,
        medications: Array.isArray(formulary.medications) ? formulary.medications : [],
      }, { status: 201 });
    }

    if (action === 'addSupplier') {
      const { name, contact, email, address } = payload;
      if (!name || !email) {
        return NextResponse.json({ error: 'Missing required fields: name or email' }, { status: 400 });
      }
      const supplier = await prisma.supplier.create({
        data: { name, contact, email, address },
      });
      return NextResponse.json(supplier, { status: 201 });
    }

    if (action === 'addPharmacist') {
      const { name, email, password, licenseNumber, phone, specialty } = payload;
      if (!name || !email || !password || !licenseNumber) {
        return NextResponse.json({ error: 'Missing required fields: name, email, password, or licenseNumber' }, { status: 400 });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const pharmacist = await prisma.user.create({
        data: {
          name,
          email,
          role: 'PHARMACIST',
          password: hashedPassword,
          doctor: {
            create: {
              doctorId: `PHARM-${Date.now()}`,
              licenseNumber,
              phone,
              specialty: specialty || 'Pharmacy',
            },
          },
        },
        include: { doctor: { select: { licenseNumber: true, phone: true, specialty: true } } },
      });
      return NextResponse.json({
        id: pharmacist.id,
        user: { name: pharmacist.name, email: pharmacist.email },
        licenseNumber: pharmacist.doctor?.licenseNumber || '',
        phone: pharmacist.doctor?.phone || '',
        specialty: pharmacist.doctor?.specialty || '',
      }, { status: 201 });
    }

    if (action === 'createInvoice') {
      const { prescriptionId, totalAmount } = payload;
      if (!prescriptionId || !totalAmount) {
        return NextResponse.json({ error: 'Missing required fields: prescriptionId or totalAmount' }, { status: 400 });
      }
      const invoice = await prisma.invoice.create({
        data: {
          prescription: { connect: { id: parseInt(prescriptionId) } },
          totalAmount: parseFloat(totalAmount),
          status: 'PENDING',
        },
        include: { prescription: { select: { id: true, status: true } } },
      });
      return NextResponse.json(invoice, { status: 201 });
    }

    if (action === 'processRefund') {
      const { invoiceId, reason, amount, processedById } = payload;
      if (!invoiceId || !reason || !amount || !processedById) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }
      const invoice = await prisma.invoice.findUnique({
        where: { id: parseInt(invoiceId) },
      });
      if (!invoice) {
        return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
      }
      const refund = await prisma.refund.create({
        data: {
          invoice: { connect: { id: parseInt(invoiceId) } },
          reason,
          amount: parseFloat(amount),
          processedBy: { connect: { id: parseInt(processedById) } },
          refundDate: new Date(),
        },
        include: {
          invoice: { select: { id: true, status: true } },
          processedBy: { select: { id: true, name: true } },
        },
      });
      await prisma.invoice.update({
        where: { id: parseInt(invoiceId) },
        data: { status: 'REFUNDED' },
      });
      return NextResponse.json(refund, { status: 201 });
    }

    if (action === 'createOrder') {
      const { supplierId, items } = payload;
      if (!supplierId || !items || !items.length) {
        return NextResponse.json({ error: 'Missing required fields: supplierId or items' }, { status: 400 });
      }
      const order = await prisma.purchaseOrder.create({
        data: {
          supplier: { connect: { id: parseInt(supplierId) } },
          orderDate: new Date(),
          status: 'PENDING',
          totalAmount: items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0),
          items: {
            create: items.map(item => ({
              medication: { connect: { id: parseInt(item.medicationId) } },
              quantity: parseInt(item.quantity),
              unitPrice: parseFloat(item.unitPrice),
            })),
          },
        },
        include: {
          supplier: { select: { id: true, name: true } },
          items: { include: { medication: { select: { id: true, name: true } } } },
        },
      });
      return NextResponse.json(order, { status: 201 });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('POST /api/pharmacy error:', error);
    return NextResponse.json({ error: 'Failed to process request', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// PUT handler for updating pharmacy resources
export async function PUT(request) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();
    const { action, payload, id } = data;

    if (!id) {
      return NextResponse.json({ error: 'Missing resource ID' }, { status: 400 });
    }

    if (action === 'updateMedication') {
      const { name, genericName, category, batchNumber, barcode, rfid, stockQuantity, minStockThreshold, price, expiryDate, supplierId, formularyId, narcotic } = payload;
      if (!name || !category || !batchNumber || !stockQuantity || !price || !expiryDate) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }
      const medication = await prisma.medication.update({
        where: { id: parseInt(id) },
        data: {
          name,
          genericName,
          category,
          batchNumber,
          barcode,
          rfid,
          stockQuantity: parseInt(stockQuantity),
          minStockThreshold: parseInt(minStockThreshold) || 10,
          price: parseFloat(price),
          expiryDate: new Date(expiryDate),
          supplier: supplierId ? { connect: { id: parseInt(supplierId) } } : { disconnect: true },
          formulary: formularyId ? { connect: { id: parseInt(formularyId) } } : { disconnect: true },
          narcotic: narcotic || false,
        },
        include: {
          supplier: { select: { id: true, name: true } },
          formulary: { select: { id: true, name: true } },
        },
      });
      return NextResponse.json(medication);
    }

    if (action === 'updateStock') {
      const { stockQuantity, reason, adjustedById } = payload;
      if (!stockQuantity || !reason || !adjustedById) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }
      const medication = await prisma.medication.findUnique({
        where: { id: parseInt(id) },
        select: { id: true, stockQuantity: true },
      });
      if (!medication) {
        return NextResponse.json({ error: 'Medication not found' }, { status: 404 });
      }
      await prisma.stockAdjustment.create({
        data: {
          medication: { connect: { id: parseInt(id) } },
          quantity: parseInt(stockQuantity) - medication.stockQuantity,
          reason,
          adjustedBy: { connect: { id: parseInt(adjustedById) } },
          adjustmentDate: new Date(),
        },
      });
      const updatedMedication = await prisma.medication.update({
        where: { id: parseInt(id) },
        data: { stockQuantity: parseInt(stockQuantity) },
        include: {
          supplier: { select: { id: true, name: true } },
          formulary: { select: { id: true, name: true } },
        },
      });
      return NextResponse.json(updatedMedication);
    }

    if (action === 'updateSupplier') {
      const { name, contact, email, address } = payload;
      if (!name || !email) {
        return NextResponse.json({ error: 'Missing required fields: name or email' }, { status: 400 });
      }
      const supplier = await prisma.supplier.update({
        where: { id: parseInt(id) },
        data: { name, contact, email, address },
      });
      return NextResponse.json(supplier);
    }

    if (action === 'updateOrderStatus') {
      const { status } = payload;
      if (!status) {
        return NextResponse.json({ error: 'Missing required field: status' }, { status: 400 });
      }
      const order = await prisma.purchaseOrder.update({
        where: { id: parseInt(id) },
        data: { status },
        include: {
          supplier: { select: { id: true, name: true } },
          items: { include: { medication: { select: { id: true, name: true } } } },
        },
      });
      return NextResponse.json(order);
    }

    if (action === 'updatePrescriptionStatus') {
      const { status } = payload;
      if (!status) {
        return NextResponse.json({ error: 'Missing required field: status' }, { status: 400 });
      }
      const prescription = await prisma.prescription.update({
        where: { id: parseInt(id) },
        data: { status },
        include: {
          patient: { include: { user: { select: { id: true, name: true, email: true } } } },
          doctor: { include: { user: { select: { id: true, name: true, email: true } } } },
          items: { include: { medication: { select: { id: true, name: true, price: true } } } },
          dispensingRecords: { include: { medication: true, dispensedBy: { select: { id: true, name: true } } } },
        },
      });
      return NextResponse.json(prescription);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('PUT /api/pharmacy error:', error);
    return NextResponse.json({ error: 'Failed to process request', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE handler for removing pharmacy resources
export async function DELETE(request) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const resource = searchParams.get('resource');

    if (!id || !resource) {
      return NextResponse.json({ error: 'Missing required fields: id or resource' }, { status: 400 });
    }

    if (resource === 'medication') {
      await prisma.medication.delete({
        where: { id: parseInt(id) },
      });
      return NextResponse.json({ message: 'Medication deleted' }, { status: 200 });
    }

    if (resource === 'supplier') {
      await prisma.supplier.delete({
        where: { id: parseInt(id) },
      });
      return NextResponse.json({ message: 'Supplier deleted' }, { status: 200 });
    }

    return NextResponse.json({ error: 'Invalid resource' }, { status: 400 });
  } catch (error) {
    console.error('DELETE /api/pharmacy error:', error);
    return NextResponse.json({ error: 'Failed to process request', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
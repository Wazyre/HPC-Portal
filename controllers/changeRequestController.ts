import { PrismaClient } from '@prisma/client';
import fs from 'fs'; // Import fs to delete the uploaded file from the uploads folder
import path from 'path'; // FIX: Import path to build the correct file path

const prisma = new PrismaClient();

export const createChangeRequest = async (req: any, res: any) => {
  const { adminName, scopeOfChange, changeDescription, status } = req.body;

  //  Read the uploaded file name if a file was attached (multer puts it in req.file)
  const attachedFile = req.file ? req.file.filename : null;

  try {
    const newRequest = await prisma.changeRequest.create({
      data: {
        adminName,
        scopeOfChange,
        changeDescription,
        status: status?.toUpperCase() || 'PENDING',
        attachedFile //  Save the file name into the database (null if no file was uploaded)
      },
    });
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create change request' });
  }
};

export const getAllChangeRequests = async (req: any, res: any) => {
  try {
    const requests = await prisma.changeRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch change requests' });
  }
};

export const updateChangeRequestStatus = async (req: any, res: any) => {
  const { id } = req.params;
  const { status, changeDescription } = req.body;

  try {
    const isCompleting = status?.toUpperCase() === 'COMPLETED';

    const updated = await prisma.changeRequest.update({
      where: { id: String(id) },
      data: {
        ...(status && { status: status.toUpperCase() }),
        ...(changeDescription && { changeDescription }),
        ...(isCompleting && { completedAt: new Date() })
      },
    });
    res.status(200).json(updated);
  } catch (error) {
    console.error("Prisma Error:", error);
    res.status(500).json({ error: 'Failed to update in the database' });
  }
};

export const deleteChangeRequest = async (req: any, res: any) => {
  const { id } = req.params;
  try {
    // Find the log entry to get the attached file name before deleting
    const existingRequest = await prisma.changeRequest.findUnique({
      where: { id: String(id) },
    });

    // Delete the database record
    await prisma.changeRequest.delete({
      where: { id: String(id) },
    });

    // If the log had an attached file, delete it from the uploads folder too
    if (existingRequest?.attachedFile) {
      const filePath = path.join(process.cwd(), 'uploads', existingRequest.attachedFile);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Delete the physical file from the uploads folder
        console.log(`Deleted file: ${existingRequest.attachedFile}`);
      }
    }

    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: 'Failed to delete the request' });
  }
};
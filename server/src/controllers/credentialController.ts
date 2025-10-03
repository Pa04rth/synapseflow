import { Request, Response } from "express";
import { encrypt } from "../utils/encryption";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const saveCredential = async (req: Request, res: Response) => {
  try {
    const { type, value, userId } = req.body;
    if (!type || !value || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const encryptedValue = encrypt(value);

    const existingCredential = await prisma.credential.findUnique({
      where: {
        userId_type: {
          userId: userId,
          type: type,
        },
      },
    });

    if (existingCredential) {
      await prisma.credential.update({
        where: {
          id: existingCredential.id,
        },
        data: {
          encryptedValue: encryptedValue,
        },
      });
    } else {
      await prisma.credential.create({
        data: {
          userId: userId,
          type: type,
          encryptedValue: encryptedValue,
        },
      });
    }

    res.status(200).json({ message: "Credential saved successfully" });
  } catch (error) {
    console.error("Error saving credential:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

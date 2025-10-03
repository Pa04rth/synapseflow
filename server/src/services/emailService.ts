import { Resend } from "resend";
import { PrismaClient } from "@prisma/client";
import { decrypt } from "../utils/encryption";

const prisma = new PrismaClient();

export async function process(nodeData: any, inputData: any, userId: string) {
  console.log(`[Email Service] Processing started for user: ${userId}`);

  const credential = await prisma.credential.findFirst({
    where: {
      userId: userId,
      type: "RESEND_API_KEY",
    },
  });

  if (!credential) {
    throw new Error("No Resend API key found for this user.");
  }

  const decryptedApiKey = decrypt(credential.encryptedValue);

  if (!decryptedApiKey) {
    throw new Error("Failed to decrypt Resend API key.");
  }

  const resend = new Resend(decryptedApiKey);

  try {
    const emailBody = inputData || "No content provided.";

    console.log(`[Email Service] Sending email to: "${nodeData.to}"`);

    const { data, error } = await resend.emails.send({
      from: "admin@parthsohaney.online",
      to: nodeData.to,
      subject: nodeData.subject,
      html: `<p>${emailBody}</p>`,
    });

    if (error) {
      console.error("[Email Service] Error from Resend API:", error);
      throw new Error(error.message);
    }

    console.log(
      "[Email Service] Successfully sent email. Message ID:",
      data?.id
    );

    return { status: "Email sent successfully", messageId: data?.id };
  } catch (error) {
    console.error("[Email Service] Failed to send email:", error);

    throw error;
  }
}

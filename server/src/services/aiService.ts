import OpenAI from "openai";
import { PrismaClient } from "@prisma/client";
import { decrypt } from "../utils/encryption";

const prisma = new PrismaClient();

export async function process(nodeData: any, inputData: any, userId: string) {
  console.log(`[AI Service] Processing started for user: ${userId}`);

  const credential = await prisma.credential.findFirst({
    where: {
      userId: userId,
      type: "OPENAI_API_KEY",
    },
  });

  if (!credential) {
    throw new Error("No OpenAI API key found for this user.");
  }

  const decryptedApiKey = decrypt(credential.encryptedValue);

  if (!decryptedApiKey) {
    throw new Error("Failed to decrypt API key.");
  }

  const openai = new OpenAI({
    apiKey: decryptedApiKey,
  });

  try {
    console.log(
      `[AI Service] Making API call with prompt: "${nodeData.prompt}"`
    );

    const fullPrompt = inputData
      ? `${inputData}\n\n${nodeData.prompt}`
      : nodeData.prompt;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: fullPrompt },
      ],
    });

    const response = completion.choices[0].message.content;

    if (!response) {
      throw new Error("OpenAI returned an empty response.");
    }

    console.log("[AI Service] Successfully received response from OpenAI.");
    return response;
  } catch (error) {
    console.error("[AI Service] Error calling OpenAI API:", error);

    throw error;
  }
}

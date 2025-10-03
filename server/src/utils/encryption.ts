import crypto from "crypto";

export function encrypt(text: string) {
  const key = crypto.createCipheriv(
    "aes-256-cbc",
    process.env.ENCRYPTION_KEY as string,
    process.env.ENCRYPTION_IV as string
  );
  let encrypted = key.update(text, "utf8", "hex");
  encrypted += key.final("hex");
  return encrypted;
}

export function decrypt(encryptedText: string) {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    process.env.ENCRYPTION_KEY as string,
    process.env.ENCRYPTION_IV as string
  );
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

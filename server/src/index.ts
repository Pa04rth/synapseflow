import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
const PORT = process.env.SERVER_PORT || 3001;
import workflowRoutes from "./routes/workflowRoutes";
import { credentialRoutes } from "./routes/credentialRoutes";
const app = express();
app.use(cors());
app.use(express.json());

const prisma = new PrismaClient();

app.get("/api/health", (req, res) => {
  res.json({ status: "up" });
});
app.use("/api/workflows", workflowRoutes);
app.use("/api/credentials", credentialRoutes);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

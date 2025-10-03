import { Router } from "express";
import { saveCredential } from "../controllers/credentialController";
const router = Router();

router.post("/", saveCredential);
export { router as credentialRoutes };

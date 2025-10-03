import { Router } from "express";
import {
  saveWorkflow,
  getWorkflowById,
  executeWorkflow,
} from "../controllers/workflowController";

const router = Router();
router.post("/", saveWorkflow);
router.get("/:id", getWorkflowById);
router.post("/:id/execute", executeWorkflow);

export default router;

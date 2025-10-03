import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { executeWorkflowLogic } from "../services/executionService";

export const saveWorkflow = async (req: Request, res: Response) => {
  try {
    const { name, nodes, edges, userId } = req.body;

    // Validate required fields
    if (!name || !nodes || !edges || !userId) {
      return res.status(400).json({
        message: "Missing required fields: name, nodes, edges, userId",
      });
    }

    const workflowData = { name, nodes, edges, userId };
    const createdWorkflow = await prisma.workflow.create({
      data: workflowData,
    });
    return res
      .status(201)
      .json({ message: "Workflow saved", data: createdWorkflow });
  } catch (error) {
    return res.status(500).json({ message: "Error saving workflow", error });
  }
};

export const getWorkflowById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const workflow = await prisma.workflow.findUnique({
      where: { id: id },
    });

    if (!workflow) {
      return res.status(404).json({ message: "Workflow not found" });
    }

    return res.status(200).json({ message: "Workflow found", data: workflow });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving workflow", error });
  }
};

export const executeWorkflow = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    //  full workflow from the database
    const workflow = await prisma.workflow.findUnique({
      where: { id: id },
    });

    //  Check if the workflow exists *before* doing anything else
    if (!workflow) {
      return res.status(404).json({ error: "Workflow not found" });
    }
    if (!Array.isArray(workflow.nodes) || !Array.isArray(workflow.edges)) {
      return res.status(400).json({
        error: "Invalid workflow data: nodes or edges are not arrays.",
      });
    }

    const result = await executeWorkflowLogic(
      workflow.nodes,
      workflow.edges,
      workflow.userId
    );

    return res
      .status(200)
      .json({ message: "Workflow executed successfully", result: result });
  } catch (error) {
    console.error("Error executing workflow:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

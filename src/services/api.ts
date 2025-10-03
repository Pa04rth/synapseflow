import axios from "axios";
const API_URL = "http://localhost:3001/api/workflows";
type WorkflowNode = {
  id: string;
  position: { x: number; y: number };
  data: { label: string };
};
type WorkflowEdge = {
  id: string;
  source: string;
  target: string;
};

const workflow_object = {
  name: "",
  nodes: [] as WorkflowNode[],
  edges: [] as WorkflowEdge[],
  userId: "",
};
export async function saveWorkflow(workflowData: typeof workflow_object) {
  try {
    const Response = await axios.post(API_URL, workflowData);
    return Response.data;
  } catch (error) {
    console.error("Error saving workflow:", error);
    throw error;
  }
}

const credentials_object = {
  type: "",
  value: "",
  userId: "",
};
export async function saveCredential(credentials: typeof credentials_object) {
  try {
    const Response = await axios.post("", credentials);
    return Response.data;
  } catch (error) {
    console.log("Error saving the credentials", error);
    throw error;
  }
}
export async function executeWorkflow(workflowId: string) {
  try {
    const { data } = await axios.post(
      `http://localhost:3001/api/workflows/${workflowId}/execute`
    );
    return data;
  } catch (error) {
    console.error("Error executing workflow:", error);
    throw error;
  }
}

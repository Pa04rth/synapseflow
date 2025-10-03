import * as aiService from "./aiService";
import * as emailService from "./emailService";

export const executeWorkflowLogic = async (
  nodes: any[],
  edges: any[],
  userId: string
) => {
  // A node is a trigger node if it's not a target of any edge.
  const targetIds = new Set(edges.map((edge) => edge.target));
  const triggerNode = nodes.find((node) => !targetIds.has(node.id));

  if (!triggerNode) {
    throw new Error("Workflow has no trigger node!");
  }

  //Execution Start
  const executionQueue = [triggerNode]; // A queue of nodes to process
  let previousNodeOutput: any = null; // To store the output of the last node

  const edgeMap = new Map(edges.map((edge) => [edge.source, edge.target]));

  // --- 3. The Execution Loop ---
  while (executionQueue.length > 0) {
    const currentNode = executionQueue.shift(); // Get the next node from the queue

    if (!currentNode) continue;

    console.log(
      `[Execution Engine] Processing node: ${currentNode.id} of type: ${currentNode.type}`
    );

    // --- 4. Process the Node Based on its Type ---
    let currentNodeOutput: any;
    switch (currentNode.type) {
      case "aiNode":
        // Delegate the logic to the specific service for that node type
        currentNodeOutput = await aiService.process(
          currentNode.data,
          previousNodeOutput,
          userId
        );
        break;
      case "emailNode":
        currentNodeOutput = await emailService.process(
          currentNode.data,
          previousNodeOutput,
          userId
        );
        break;

      default:
        console.warn(
          `[Execution Engine] Unknown node type: ${currentNode.type}`
        );
        break;
    }
    previousNodeOutput = currentNodeOutput;

    const nextNodeId = edgeMap.get(currentNode.id);
    if (nextNodeId) {
      const nextNode = nodes.find((node) => node.id === nextNodeId);
      if (nextNode) {
        executionQueue.push(nextNode);
      }
    }
  }

  // The result of the very last node in the workflow
  console.log("[Execution Engine] Workflow finished.");
  return previousNodeOutput;
};

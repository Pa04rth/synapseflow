import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useState, useRef } from "react";
import { saveWorkflow, executeWorkflow } from "../../services/api";
import { Sidebar } from "../../components/layout/Sidebar";
import { AiNode } from "../../components/nodes/aiNode";
import { EmailNode } from "../../components/nodes/emailNode";
import { SettingsPanel } from "../../components/layout/SettingsPanel";
import toast from "react-hot-toast";

const initialNodes = [
  { id: "n1", position: { x: 100, y: 100 }, data: { label: "Start Node" } },
];
const initialEdges: any[] = [];

export default function WorkflowEditor() {
  const [selectedNode, setSelectedNode] = useState(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // State Management Hooks
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [workflowId, setWorkflowId] = useState<string | null>(null);

  // Custom Node Types
  const nodeTypes = {
    aiNode: AiNode,
    emailNode: EmailNode,
  };

  // Function to update node data from the settings panel
  const updateNodeData = useCallback(
    (nodeId: string, newData: any) => {
      setNodes((currentNodes) =>
        currentNodes.map((node) => {
          if (node.id === nodeId) {
            return { ...node, data: { ...node.data, ...newData } };
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  // Handler for connecting nodes
  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      if (!type || !reactFlowBounds) return;

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode = {
        id: `${type}-${+new Date()}`,
        type,
        position,
        data: {
          label: `${type} node`,
          prompt: "",
          to: "",
          subject: "",
          body: "",
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const onSelectionChange = useCallback(({ nodes }: { nodes: any[] }) => {
    setSelectedNode(nodes.length > 0 ? nodes[0] : null);
  }, []);

  const handleSave = async () => {
    const workflowData = {
      name: "My Awesome Workflow",
      nodes: nodes,
      edges: edges,
      userId: "user-123",
    };

    const promise = saveWorkflow(workflowData);

    toast.promise(promise, {
      loading: "Saving workflow...",
      success: (savedWorkflow) => {
        setWorkflowId(savedWorkflow.data.id);
        return "Workflow saved successfully!";
      },
      error: "Failed to save workflow.",
    });
  };

  // Handler for the "Execute" button
  const handleExecute = async () => {
    if (!workflowId) {
      toast.error("You must save the workflow before executing it.");
      return;
    }

    const promise = executeWorkflow(workflowId);

    toast.promise(promise, {
      loading: "Executing workflow...",
      success: (data) =>
        `Execution finished! Result: ${JSON.stringify(data.result)}`,
      error: (err) =>
        `Execution failed: ${err.response?.data?.error || err.message}`,
    });
  };

  return (
    <div
      style={{ width: "100vw", height: "100vh", display: "flex" }}
      ref={reactFlowWrapper}
    >
      <Sidebar />
      <div style={{ flexGrow: 1, position: "relative" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onSelectionChange={onSelectionChange}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 10,
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            onClick={handleSave}
            style={{
              padding: "8px 16px",
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Save Workflow
          </button>
          <button
            onClick={handleExecute}
            disabled={!workflowId}
            style={{
              padding: "8px 16px",
              background: !workflowId ? "#9ca3af" : "#10b981",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: !workflowId ? "not-allowed" : "pointer",
            }}
          >
            Execute
          </button>
        </div>
      </div>
      {selectedNode && (
        <SettingsPanel node={selectedNode} onUpdateNodeData={updateNodeData} />
      )}
    </div>
  );
}

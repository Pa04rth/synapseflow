// Corrected Structure for SettingsPanel.tsx
import { AiNodeForm } from "../forms/AiNodeForm";
import { EmailNodeForm } from "../forms/EmailNodeForm";

export const SettingsPanel = ({
  node,
  onUpdateNodeData,
}: {
  node: any;
  onUpdateNodeData: (nodeId: string, newData: any) => void;
}) => {
  let formContent = null;

  switch (node.type) {
    case "aiNode":
      // 2. Pass the entire node object and the update function
      formContent = <AiNodeForm node={node} onUpdate={onUpdateNodeData} />;
      break;
    case "emailNode":
      formContent = <EmailNodeForm node={node} onUpdate={onUpdateNodeData} />;
      break;
    default:
      formContent = <p>No specific settings available for {node.type}</p>;
      break;
  }

  return (
    <div
      style={{
        position: "fixed",
        right: 0,
        top: 0,
        width: "300px",
        height: "100vh",
        backgroundColor: "#f7fafc",
        borderLeft: "1px solid #e2e8f0",
        boxShadow: "-2px 0 5px rgba(0,0,0,0.1)",
        padding: "20px",
        zIndex: 20,
        overflowY: "auto",
      }}
    >
      <h2>Settings</h2>
      <hr style={{ margin: "10px 0" }} />
      {formContent}
    </div>
  );
};

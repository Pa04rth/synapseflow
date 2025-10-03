import { Handle, Position } from "@xyflow/react";
import React from "react";

export const AiNode = ({ data }: { data: { label: string } }) => {
  return (
    <div
      style={{
        background: "#f0f7ff",
        border: "1px solid #1e88e5",
        borderRadius: "8px",
        width: "180px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#555" }}
      />

      <div
        style={{
          padding: "10px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          borderBottom: "1px solid #ddd",
        }}
      >
        {/* SVG Brain Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1e88e5"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-2.5 2.5h-1A2.5 2.5 0 0 1 6 19.5v-15A2.5 2.5 0 0 1 8.5 2h1Z" />
          <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 2.5 2.5h1A2.5 2.5 0 0 0 18 19.5v-15A2.5 2.5 0 0 0 15.5 2h-1Z" />
        </svg>
        <div style={{ fontWeight: "bold", color: "#1a202c" }}>AI Node</div>
      </div>

      <div style={{ padding: "10px", color: "#4a5568" }}>
        {/* The data label will eventually be replaced by input fields */}
        <p>{data.label}</p>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "#555" }}
      />
    </div>
  );
};

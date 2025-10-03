import { Handle, Position } from "@xyflow/react";
import React from "react";

export const EmailNode = ({ data }: { data: { label: string } }) => {
  return (
    <div
      style={{
        background: "#f0fff4",
        border: "1px solid #38a169",
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
        {/* SVG Email Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#38a169"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
        <div style={{ fontWeight: "bold", color: "#1a202c" }}>Email Node</div>
      </div>

      <div style={{ padding: "10px", color: "#4a5568" }}>
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

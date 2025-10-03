import React from "react";

export const Sidebar = () => {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string
  ) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="flex">
      <div draggable onDragStart={(event) => onDragStart(event, "aiNode")}>
        <p>AI Node</p>
      </div>
      <div draggable onDragStart={(event) => onDragStart(event, "emailNode")}>
        <p>Email Node</p>
      </div>
    </div>
  );
};

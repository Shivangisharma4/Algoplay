import React from "react";

const CodeVisualizer = ({ lines, currentLine }) => {
  return (
    <div className="bg-black text-green-400 font-mono p-4 rounded-xl w-full max-w-md h-64 overflow-auto shadow-lg border border-green-500">
      {lines.map((line, idx) => (
        <div
          key={idx}
          className={`whitespace-pre ${
            idx === currentLine
              ? "bg-green-700 text-white font-bold pl-2"
              : "pl-2"
          }`}
        >
          {line}
        </div>
      ))}
    </div>
  );
};

export default CodeVisualizer;

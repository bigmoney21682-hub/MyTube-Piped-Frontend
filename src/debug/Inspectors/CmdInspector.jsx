/**
 * File: CmdInspector.jsx
 * Path: src/debug/inspectors/CmdInspector.jsx
 * Description: Command input inspector. Allows running JS safely.
 */

import React, { useState } from "react";

export default function CmdInspector() {
  const [output, setOutput] = useState("");

  function runCommand(e) {
    e.preventDefault();
    const cmd = e.target.elements.cmd.value;

    try {
      const result = eval(cmd);
      setOutput(String(result));
    } catch (err) {
      setOutput("Error: " + err.message);
    }
  }

  return (
    <div style={{ padding: 12 }}>
      <h3>Command Console</h3>

      <form onSubmit={runCommand}>
        <input
          name="cmd"
          placeholder="Type JS and press Enter"
          style={{
            width: "100%",
            padding: 8,
            borderRadius: 6,
            border: "1px solid #444",
            background: "#111",
            color: "#fff",
          }}
        />
      </form>

      <pre style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>{output}</pre>
    </div>
  );
}

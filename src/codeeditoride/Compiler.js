import React, { useState } from "react";
import axios from "axios";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-java";

const Compiler = () => {
  const [language, setLanguage] = useState("java");
  const [code, setCode] = useState(`public class Main {
  public static void main(String[] args) {
    System.out.println("Hello, World!");
  }
}`);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const runCode = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/compiler/run", {
        language,
        code,
        input,
      });

      setOutput(res.data.output || "No output");
    } catch (err) {
      setOutput("Error running code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-2xl p-4">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          💻 Online Compiler IDE
        </h2>

        <div className="mb-4 flex justify-between">
          <div>
            <label className="font-semibold mr-2">Language:</label>
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                setCode("");
              }}
              className="border px-2 py-1 rounded"
            >
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="python">Python</option>
            </select>
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            onClick={runCode}
          >
            {loading ? "Running..." : "Compile & Run"}
          </button>
        </div>

        <AceEditor
          mode={
            language === "java"
              ? "java"
              : language === "cpp"
              ? "c_cpp"
              : "python"
          }
          theme="monokai"
          name="editor"
          width="100%"
          height="300px"
          fontSize={14}
          showPrintMargin={false}
          showGutter={true}
          highlightActiveLine={true}
          value={code}
          onChange={(val) => setCode(val)}
        />

        <h3 className="font-semibold mt-4 mb-2">Input:</h3>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full border rounded p-2 h-20"
          placeholder="Enter custom input..."
        />

        <h3 className="font-semibold mt-4 mb-2">Output:</h3>
        <pre className="bg-black text-green-400 p-3 rounded h-40 overflow-auto">
          {output || "Output will appear here..."}
        </pre>
      </div>
    </div>
  );
};

export default Compiler;

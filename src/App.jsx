import React, { useState } from "react";
import axios from "axios";
import AceEditor from "react-ace";
import "bootstrap/dist/css/bootstrap.min.css";

// Ace Editor themes & modes
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
    setOutput("");
    try {
      const res = await axios.post("https://gameappbackend-i8zv.onrender.com/api/compiler/run", {
        language,
        code,
        input,
      });

      setOutput(res.data.output || "No output");
    } catch (err) {
      setOutput("⚠️ Error running code! Check console for details.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid min-vh-100 bg-light d-flex flex-column justify-content-center align-items-center py-5"
      style={{ background: "linear-gradient(135deg, #e9f0ff, #fff)" }}
    >
      <div className="col-lg-10 col-md-11 bg-white shadow-lg rounded-4 p-4 border border-2 border-primary-subtle">
        <h2 className="text-center fw-bold mb-4 text-primary">
          💻 Online Compiler IDE
        </h2>

        {/* Language selector & Run button */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <label className="fw-semibold me-2 text-secondary">Language:</label>
            <select
              className="form-select d-inline-block w-auto border-primary-subtle"
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                setCode("");
              }}
            >
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="python">Python</option>
            </select>
          </div>
          <button
            className="btn btn-primary fw-semibold px-4"
            onClick={runCode}
            disabled={loading}
          >
            {loading ? (
              <span>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Running...
              </span>
            ) : (
              "▶️ Compile & Run"
            )}
          </button>
        </div>

        {/* Code editor */}
        <div className="border rounded-3 mb-4" style={{ overflow: "hidden" }}>
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
            value={code}
            onChange={(val) => setCode(val)}
            showPrintMargin={false}
            showGutter={true}
            highlightActiveLine={true}
          />
        </div>

        {/* Input Section */}
        <div className="mb-4">
          <h5 className="fw-semibold text-secondary mb-2">Input</h5>
          <textarea
            className="form-control border-primary-subtle"
            rows="4"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your input here..."
          ></textarea>
        </div>

        {/* Output Section */}
        <div>
          <h5 className="fw-semibold text-secondary mb-2">Output</h5>
          <pre
            className="bg-dark text-success p-3 rounded-3"
            style={{ minHeight: "120px", maxHeight: "250px", overflowY: "auto" }}
          >
            {output || "⚙️ Output will appear here after compilation..."}
          </pre>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-4 text-muted small">
        Built with ❤️ using React, Bootstrap & Judge0 API
      </footer>
    </div>
  );
};

export default Compiler;

import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

function App() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load notes when page loads
  useEffect(() => {
    axios
      .get(`${API_BASE}/api/notes`)
      .then((res) => {
        setNotes(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load notes. Is backend running?");
        setLoading(false);
      });
  }, []);

  const handleAddNote = () => {
    setError("");

    if (!text.trim()) {
      setError("Note cannot be empty");
      return;
    }

    axios
      .post(`${API_BASE}/api/notes`, { text })
      .then((res) => {
        setNotes(res.data.notes); // backend sends updated list
        setText("");
      })
      .catch(() => {
        setError("Failed to save note");
      });
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem", maxWidth: 500 }}>
      <h1>Notes App 📝</h1>
      <p style={{ color: "#555" }}>Frontend ↔ Backend ↔ MongoDB</p>

      <div style={{ marginBottom: "1rem" }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a note..."
          style={{
            padding: "0.5rem",
            width: "100%",
            boxSizing: "border-box",
            marginBottom: "0.5rem",
          }}
        />
        <button onClick={handleAddNote} style={{ padding: "0.5rem 1rem" }}>
          Add Note
        </button>
      </div>

      {error && (
        <p style={{ color: "red", marginBottom: "0.5rem" }}>{error}</p>
      )}

      {loading ? (
        <p>Loading notes...</p>
      ) : notes.length === 0 ? (
        <p>No notes yet. Add one above 👆</p>
      ) : (
        <ul>
          {notes.map((note) => (
            <li key={note._id}>{note.text}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;

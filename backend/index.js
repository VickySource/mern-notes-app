const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// ---- Middleware ----
app.use(cors());              // OK for demo / learning apps
app.use(express.json());

// ---- MongoDB Connection ----
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not set in environment variables");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => {
    console.error("MongoDB connection error ❌", err);
    process.exit(1);
  });

// ---- Note Schema & Model ----
const noteSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
});

const Note = mongoose.model("Note", noteSchema);

// ---- Routes ----
app.get("/", (req, res) => {
  res.send("Backend running with MongoDB ✅");
});

app.get("/api/notes", async (req, res) => {
  try {
    const notes = await Note.find().sort({ _id: -1 });
    res.json(notes);
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/notes", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Text is required" });
    }

    const note = new Note({ text: text.trim() });
    await note.save();

    const notes = await Note.find().sort({ _id: -1 });
    res.json({ success: true, notes });
  } catch (err) {
    console.error("Error creating note:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---- Port ----
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} ✅`);
});

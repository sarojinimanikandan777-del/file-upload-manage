// backend/server.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.static("uploads"));

// Storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Upload route
app.post("/upload", upload.single("file"), (req, res) => {
  res.json({ message: "File uploaded successfully!", file: req.file });
});

// Get all files
app.get("/files", (req, res) => {
  fs.readdir("./uploads", (err, files) => {
    if (err) return res.status(500).json({ error: "Unable to read files" });
    res.json(files);
  });
});

// Delete file
app.delete("/files/:name", (req, res) => {
  const fileName = req.params.name;
  const filePath = path.join(__dirname, "uploads", fileName);
  fs.unlink(filePath, (err) => {
    if (err) return res.status(500).json({ error: "File not found" });
    res.json({ message: "File deleted successfully!" });
  });
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));

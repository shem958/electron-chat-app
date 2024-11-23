const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const messageRoutes = require("./routes/message");

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/messages", messageRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

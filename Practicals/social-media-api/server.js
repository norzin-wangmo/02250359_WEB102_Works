const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

dotenv.config();

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(helmet());

app.use(require("./middleware/formatResponse"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/api-docs", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "docs.html"));
});

app.use("/api/users", require("./routes/users"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/comments", require("./routes/comments"));
app.use("/api/likes", require("./routes/likes"));
app.use("/api/followers", require("./routes/followers"));

app.get("/", (req, res) => {
  res.send(`
    <h1>Social Media API is Running</h1>
    <p>Open <a href="/api-docs">/api-docs</a> to view the documentation.</p>
  `);
});

app.use(require("./middleware/errorHandler"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
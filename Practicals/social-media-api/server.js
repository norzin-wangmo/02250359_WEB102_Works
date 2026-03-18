const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");

const errorHandler = require("./middleware/errorHandler");
const formatResponse = require("./middleware/formatResponse");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(formatResponse);

// Routes
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

// Docs route
app.use(express.static("public"));

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
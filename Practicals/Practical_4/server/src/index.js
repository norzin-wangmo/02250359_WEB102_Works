const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/api/videos", (req, res) => {
  res.json([
    {
      id: 1,
      caption: "Big Buck Bunny test video",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    },
    {
      id: 2,
      caption: "Elephants Dream test video",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    },
  ]);
});

app.listen(5050, () => {
  console.log("Backend running on http://localhost:5050");
});
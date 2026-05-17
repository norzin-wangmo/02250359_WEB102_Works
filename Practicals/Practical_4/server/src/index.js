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
      caption: "Working flower video",
      url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    },
    {
      id: 2,
      caption: "Working sample video",
      url: "https://filesamples.com/samples/video/mp4/sample_640x360.mp4",
    },
  ]);
});

app.listen(5050, () => {
  console.log("Backend running on http://localhost:5050");
});

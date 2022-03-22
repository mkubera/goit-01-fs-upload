const createError = require("http-errors");
const express = require("express");
const path = require("path");
const fs = require("fs").promises;
const app = express();
const multer = require("multer");
const { route } = require("express/lib/application");
const IMAGES_STORE_PATH = path.join(process.cwd(), "images");

app.set("view engine", "ejs");
app.set("views", "./views");

const say = (name) => `hi ${name}`;

const storage = multer.diskStorage({
  destination: IMAGES_STORE_PATH,
  filename: (req, file, cb) => cb(null, file.originalname),
  limits: { fileSize: 1 * 1000000 },
});

const upload = multer({ storage });

app.get("/", (req, res) => {
  res.render("index", { title: "Upload", showTitle: !true });
});

app.post("/upload", upload.single("picture"), async (req, res, next) => {
  const { description } = req.body;
  res.json({ description, message: say("msg"), status: 200 });
});

// catch 404 and forward to error handler
app.use((req, res, next) => next(createError(404)));

app.use((err, req, res, next) =>
  res
    .status(err.status || 500)
    .json({ message: err.message, status: err.status })
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server running. Use on port:${PORT}`);
});

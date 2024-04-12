import express from "express";
import multer from "multer";
import mysql from "mysql2/promise";
import fs from "fs";
import articleRouter from "./routes/articleRoutes.js";
import * as articleController from "./controllers/articleController.js";
import path from "path";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/css/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ dest: "public/images/" });
const app = express();
const port = 3000;

// Configuration de la connexion à MySQL
const pool = await mysql.createPool({
  host: "localhost",
  user: "root",
  port: 8889,
  password: "root",
  database: "blog",
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0,
});

app.post(
  "/admin/addArticle",
  upload.single("picture"),
  articleController.addArticle
);

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", articleRouter);

// Lance le serveur
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

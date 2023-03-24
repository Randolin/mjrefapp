import express from "express";
import dotenv from "dotenv";
import bodyparser from "body-parser";
import methodOverride from "method-override";
import cors from "cors";
import api from "./routes/api.js";
import { initializeDB } from "./config/db.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

// function requireHTTPS(req: Request, res: Response, next: NextFunction) {
//   if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
//     return res.redirect('https://' + req.get('host') + req.url);
//   }
//   next();
// }

// app.use(requireHTTPS);
app.use(bodyparser.json());
app.use(bodyparser.json({ type: "application/vnd.api+json" }));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(methodOverride("X-HTTP-Method-Override"));
app.use(
  cors({
    origin: "*",
    methods: ["GET"],
  })
);
app.use(express.static("./dist/mjref"));

initializeDB();

// routes ==================================================
app.use("/api", api);

app.get("/*", function (req, res) {
  res.sendFile("index.html", { root: "dist/mjref/" });
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

import express from "express";
import dotenv from "dotenv";

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
app.use(express.static("./dist/mjref"));

app.get("/*", function (req, res) {
  res.sendFile("index.html", { root: "dist/mjref/" });
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

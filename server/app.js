import express from "express";
import cors from "cors";
import router from "./routes/mealMatcher.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  "https://frontend-u99j.onrender.com"
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use(express.json());

app.use("/meals", router);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`server run on port ${PORT}`);
});
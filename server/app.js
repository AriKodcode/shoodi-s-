import express from "express";
import cors from "cors";
import router from "./routes/mealMatcher.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// רשימת origins מורשים
const allowedOrigins = [
  "https://frontend-u99j.onrender.com"
];

// CORS config
app.use(cors({
  origin: function (origin, callback) {
    // לאפשר גם requests בלי origin (למשל Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// חשוב מאוד ל־preflight
app.options("*", cors());

app.use(express.json());

app.use("/meals", router);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`server run on port ${PORT}`);
});
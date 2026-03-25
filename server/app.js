import express from "express";
import cors from "cors";
import router from "./routes/mealMatcher.routes.js";

const app = express();
const PORT = process.env.VITE_BACKEND_PORT;

app.use(express.json());
app.use(cors());

app.use("/meals", router);

app.listen(PORT, () => {
  console.log(`server run on port ${PORT}`);
});

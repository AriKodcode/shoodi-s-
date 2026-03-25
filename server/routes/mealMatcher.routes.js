import express from "express";
import mealMatcher from "../controllers/mealMatcher.controllers.js";

const router = express.Router();

router.post("/", mealMatcher);

export default router;

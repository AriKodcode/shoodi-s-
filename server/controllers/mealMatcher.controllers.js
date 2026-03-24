import axios from "axios";
import {
  checkDataService,
  checkDB,
  checkFrontBody,
} from "../services/checkReqRes.services.js";
import { getMealsByID } from "../dal/mysqlQuery.dal.js";

export default async function mealMatcher(req, res) {
  try {
    const { type, weights } = req.body;
    if (req.body.length !== 2) {
      res.status(404).json({ error: "Body must contain only two fields." });
    }
    checkFrontBody(type, weights);
    const { data: resDataService } = await axios.post("/", req.body);
    if (
      !Array.isArray(resDataService.result) ||
      resDataService.result.length !== 3
    ) {
      return res.status(500).json({ error: "Service did not return 3 meals." });
    }
    resDataService.result.map((meal) => {
      checkDataService(meal.recipy_ids, meal.match, meal.tags);
    });
    const meals = resDataService.result;
    const dataMeal1 = await getMealsByID(
      meals[0].recipe_ids[0],
      meals[0].recipe_ids[1],
      meals[0].recipe_ids[2]
    );
    const dataMeal2 = await getMealsByID(
      meals[1].recipe_ids[0],
      meals[1].recipe_ids[1],
      meals[1].recipe_ids[2]
    );
    const dataMeal3 = await getMealsByID(
      meals[2].recipe_ids[0],
      meals[2].recipe_ids[1],
      meals[2].recipe_ids[2]
    );
    const firstMeal = {
      id: 1,
      meals: JSON.parse(dataMeal1[1]),
      match: meals[0].match,
      tags: meals[0].tags,
    };
    const secondMeal = {
      id: 2,
      meals: JSON.parse(dataMeal2[1]),
      match: meals[1].match,
      tags: meals[1].tags,
    };
    const thirdMeal = {
      id: 3,
      meals: JSON.parse(dataMeal3[1]),
      match: meals[2].match,
      tags: meals[2].tags,
    };
    const allMeals = [firstMeal, secondMeal, thirdMeal];

    res.status(200).json({ meals: allMeals });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

import axios from "axios";
import {
  checkDataService,
  checkFrontBody,
} from "../services/checkReqRes.services.js";
import { getMealsByID } from "../dal/mysqlQuery.dal.js";
import { json } from "express";
const HOST = process.env.ANALYZE_HOST;
const PORT = process.env.ANALYZE_PORT;
const ROUTE = process.env.ANALYZE_ROUTE;
const CACHE_HOST = process.env.CACHE_HOST;
const CACHE_PORT = process.env.CACHE_PORT;
const CACHE_ROUTE_GET = process.env.CACHE_ROUTE_GET;
const CACHE_ROUTE_POST = process.env.CACHE_ROUTE_POST;
export default async function mealMatcher(req, res) {
  try {
    const { type, weights } = req.body;
    if (Object.keys(req.body).length !== 2) {
      return res
        .status(400)
        .json({ error: "Body must contain only two fields." });
    }
    checkFrontBody(type, weights);

    try {
      const checkCache = await axios.post(
        `http://${CACHE_HOST}:${CACHE_PORT}/${CACHE_ROUTE_GET}`,
        req.body
      );
      if (checkCache.data) {
        console.log({ message: "res meals from cahce" });
        return res.status(200).json({ meals: checkCache.data });
      }
    } catch (err) {
      console.log({ error: "cant connect to cache server" });
    }
    let resDataService;
    try {
      const { data } = await axios.post(
        `http://${HOST}:${PORT}/${ROUTE}`,
        req.body
      );
      resDataService = data;
    } catch (err) {
      console.log("cant connect to dataService");
      return res.status(500).json({ error: "dataService is down" });
    }
    if (
      !Array.isArray(resDataService.result) ||
      resDataService.result.length !== 3
    ) {
      return res.status(500).json({ error: "Service did not return 3 meals." });
    }
    resDataService.result.forEach((meal) => {
      checkDataService(meal.recipe_ids, meal.match, meal.tags);
    });
    const meals = resDataService.result;

    const dataMeal1 = await getMealsByID(
      meals[0].recipe_ids.main,
      meals[0].recipe_ids.side,
      meals[0].recipe_ids.salad
    );
    const dataMeal2 = await getMealsByID(
      meals[1].recipe_ids.main,
      meals[1].recipe_ids.side,
      meals[1].recipe_ids.salad
    );
    const dataMeal3 = await getMealsByID(
      meals[2].recipe_ids.main,
      meals[2].recipe_ids.side,
      meals[2].recipe_ids.salad
    );
    const firstMeal = {
      id: 1,
      meals: dataMeal1,
      match: meals[0].match,
      tags: meals[0].tags,
    };
    const secondMeal = {
      id: 2,
      meals: dataMeal2,
      match: meals[1].match,
      tags: meals[1].tags,
    };
    const thirdMeal = {
      id: 3,
      meals: dataMeal3,
      match: meals[2].match,
      tags: meals[2].tags,
    };
    const allMeals = [firstMeal, secondMeal, thirdMeal];
    try {
      await axios.post(
        `http://${CACHE_HOST}:${CACHE_PORT}/${CACHE_ROUTE_POST}`,
        { meals: allMeals, data: req.body }
      );
    } catch (err) {
      console.log("cant post meals to cache");
    }
    res.status(200).json({ meals: allMeals });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
}

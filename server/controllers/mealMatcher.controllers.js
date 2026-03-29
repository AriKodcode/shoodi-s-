import axios from "axios";
import { checkFrontBody } from "../services/checkReqRes.services.js";
import { getMealsByID } from "../dal/mysqlQuery.dal.js";
const HOST = process.env.DAL_HOST;
const PORT = process.env.DAL_PORT;
const ROUTE = process.env.DAL_ROUTE;
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
    console.log("before get cahce");

    try {
      const checkCache = await axios.post(
        `${CACHE_HOST}${CACHE_PORT}/${CACHE_ROUTE_GET}`,
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
    console.log(1);
    console.log(HOST, PORT, ROUTE);

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
    console.log(2);

    const meals = resDataService.meals;
    console.log(meals);
    console.log(meals[0].meal);
    console.log(meals[0].items);

    const dataMeal1 = await getMealsByID(
      meals[0].items.main,
      meals[0].items.side,
      meals[0].items.salad
    );
    const dataMeal2 = await getMealsByID(
      meals[1].items.main,
      meals[1].items.side,
      meals[1].items.salad
    );
    const dataMeal3 = await getMealsByID(
      meals[2].items.main,
      meals[2].items.side,
      meals[2].items.salad
    );
    const dataMeal4 = await getMealsByID(
      meals[3].items.main,
      meals[3].items.side,
      meals[3].items.salad
    );
    const dataMeal5 = await getMealsByID(
      meals[4].items.main,
      meals[4].items.side,
      meals[4].items.salad
    );
    const dataMeal6 = await getMealsByID(
      meals[5].items.main,
      meals[5].items.side,
      meals[5].items.salad
    );
    const firstMeal = {
      id: 1,
      meals: dataMeal1,
      match: meals[0].meal.match,
    };
    const secondMeal = {
      id: 2,
      meals: dataMeal2,
      match: meals[1].meal.match,
    };
    const thirdMeal = {
      id: 3,
      meals: dataMeal3,
      match: meals[2].meal.match,
    };
    const fourthMeal = {
      id: 4,
      meals: dataMeal4,
      match: meals[3].meal.match,
    };
    const fifthMeal = {
      id: 5,
      meals: dataMeal5,
      match: meals[4].meal.match,
    };
    const sixthMeal = {
      id: 6,
      meals: dataMeal6,
      match: meals[5].meal.match,
    };
    const allMeals = [
      firstMeal,
      secondMeal,
      thirdMeal,
      fourthMeal,
      fifthMeal,
      sixthMeal,
    ];

    try {
      await axios.post(`${CACHE_HOST}${CACHE_PORT}/${CACHE_ROUTE_POST}`, {
        meals: allMeals,
        data: req.body,
      });
    } catch (err) {
      console.log("cant post meals to cache");
    }
    res.status(200).json({ meals: allMeals });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
}

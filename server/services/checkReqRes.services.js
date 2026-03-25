export const checkFrontBody = (type, weights) => {
  if (!type) {
    const error = new Error("missing type");
    error.status = 400;
    throw error;
  }
  if (typeof type !== "string") {
    const error = new Error("type must bu string");
    error.status = 400;
    throw error;
  }
  if (!weights) {
    const error = new Error("missing weights");
    error.status = 400;
    throw error;
  }
  const { lightness, health, complexity } = weights;
  if (lightness === null) {
    const error = new Error("missing lightness");
    error.status = 400;
    throw error;
  }
  if (health === null) {
    const error = new Error("missing health");
    error.status = 400;
    throw error;
  }
  if (complexity === null) {
    const error = new Error("missing complexity");
    error.status = 400;
    throw error;
  }
  if (
    typeof lightness !== "number" ||
    typeof health !== "number" ||
    typeof complexity !== "number"
  ) {
    const error = new Error(
      "lightness or health or complexity must by number type"
    );
    error.status = 400;
    throw error;
  }
};
export const checkDataService = (recipe_ids, match, tags) => {
  if (!recipe_ids) {
    const error = new Error("missing recipe ids.");
    error.status = 400;
    throw error;
  }
  if (match === null) {
    const error = new Error("missing match");
    error.status = 400;
    throw error;
  }
  if (typeof match !== "number") {
    const error = new Error("match must be type number");
    error.status = 400;
    throw error;
  }
  if (!tags) {
    const error = new Error("missing tags");
    error.status = 400;
    throw error;
  }
  if (!Array.isArray(tags)) {
    const error = new Error("tags must be array");
    error.status = 400;
    throw error;
  }
};
export const checkDB = (name, recipe) => {
  if (!name) {
    const error = new Error("missing name");
    error.status = 400;
    throw error;
  }
  if (typeof name !== "string") {
    const error = new Error("name must be type string");
    error.status = 400;
    throw error;
  }
  if (!recipe) {
    const error = new Error("msissing recipe");
    error.status = 400;
    throw error;
  }
  if (typeof recipe !== "string") {
    const error = new Error("recipe must be type string");
    error.status = 400;
    throw error;
  }
};

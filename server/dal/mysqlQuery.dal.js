import db from "../config/connectDB.config.js";

export async function getMealsByID(id1, id2, id3) {
  if ([id1, id2, id3].some((id) => id == null)) {
    throw new Error("All three IDs must be provided");
  }
  const [rows] = await db.execute(
    `SELECT * FROM meal_full_view WHERE id IN (?,?,?)`,
    [id1, id2, id3]
  );
  return rows;
}

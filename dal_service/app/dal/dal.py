from app.db.connection import DatabaseConnection
from app.dal.queries import build_query


class MealsDAL:

    @staticmethod
    def get_connection():
        return DatabaseConnection().get_connection()

    @staticmethod
    def fetch_top_by_category(request, category):
        conn = MealsDAL.get_connection()
        cur = conn.cursor()

        query = build_query(request, category)
        cur.execute(query)

        rows = cur.fetchone()

        cur.close()

        return rows
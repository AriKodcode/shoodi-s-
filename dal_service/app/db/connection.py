import mysql.connector
import time
import logging
import os

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)

host = os.getenv("MYSQL_HOST", "localhost")
port = int(os.getenv("MYSQL_PORT", 3306))
user = os.getenv("MYSQL_USER")
password = os.getenv("MYSQL_PASSWORD")
db = os.getenv("MYSQL_DB")


class DatabaseConnection:
    MAX_RETRIES = 5
    RETRY_DELAY = 2

    @staticmethod
    def get_connection():
        attempt = 1

        while attempt <= DatabaseConnection.MAX_RETRIES:
            try:
                logging.info(f"DB connection attempt {attempt}/{DatabaseConnection.MAX_RETRIES}")

                conn = mysql.connector.connect(
                    host=host,
                    port=port,
                    user=user,
                    password=password,
                    database=db,
                    charset="utf8mb4"
                )

                if conn.is_connected():
                    logging.info("Connected to MySQL")
                    return conn

            except Exception as e:
                logging.error(f"Connection failed: {e}")

            attempt += 1
            time.sleep(DatabaseConnection.RETRY_DELAY)

        raise RuntimeError("Failed to connect to MySQL after retries")
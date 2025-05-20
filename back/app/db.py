import psycopg2
from dotenv import load_dotenv
import os

def get_db_connection():
    try:
        conn=psycopg2.connect(host='localhost',
                              dbname='agend_test1',
                              port='5432',
                              user = os.getenv('DB_USER'),
                              password =os.getenv('DB_PASSWORD'),
                              )
        return conn
    except psycopg2.Error as error:
        print(f"Base de datos no encontrada {error}")
        return None

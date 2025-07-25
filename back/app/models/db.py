import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

def get_db_connection():
    try:
        #conn = psycopg2.connect(os.getenv('DB_URL'))
        conn=psycopg2.connect(host=os.getenv('DB_HOST'),
                              dbname=os.getenv('DB_NAME'),
                              port=os.getenv('DB_PORT'),
                              user = os.getenv('DB_USER'),
                              password =os.getenv('DB_PASSWORD'),
                              )
        return conn
    except psycopg2.Error as error:
        print(f"Base de datos no encontrada {error}")
        return None
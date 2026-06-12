import sys
sys.path.append("c:/SmartCare_ASD")
import mysql.connector
from config import DB_CONFIG

try:
    conn = mysql.connector.connect(**DB_CONFIG)
    cur = conn.cursor()
    cur.execute("DESCRIBE screenings")
    for row in cur.fetchall():
        print(row)
    cur.close()
    conn.close()
except Exception as e:
    print("Error:", e)

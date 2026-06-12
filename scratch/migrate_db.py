import sys
sys.path.append("c:/SmartCare_ASD")
import mysql.connector
from config import DB_CONFIG

def generate_tracking_id(name: str, gender: str, year: int = 2026) -> str:
    gender_letter = 'M' if gender.lower() == 'male' else ('F' if gender.lower() == 'female' else 'O')
    char_sum = sum(ord(c) for c in name)
    hash_num = (char_sum % 900) + 100
    return f"SC-{year}-{gender_letter}-{hash_num}"

try:
    conn = mysql.connector.connect(**DB_CONFIG)
    cur = conn.cursor(dictionary=True)
    
    # Check if tracking_id column exists
    cur.execute("DESCRIBE screenings")
    columns = [row['Field'] for row in cur.fetchall()]
    
    if 'tracking_id' not in columns:
        print("Adding tracking_id column to screenings table...")
        cur.execute("ALTER TABLE screenings ADD COLUMN tracking_id VARCHAR(50) NULL")
        conn.commit()
    else:
        print("tracking_id column already exists.")
        
    # Populate tracking_id for existing records
    cur.execute("""
        SELECT s.id, c.full_name, c.gender 
        FROM screenings s 
        JOIN children c ON s.child_id = c.id
        WHERE s.tracking_id IS NULL
    """)
    rows = cur.fetchall()
    
    for row in rows:
        tid = generate_tracking_id(row['full_name'], row['gender'])
        print(f"Updating screening {row['id']} for child '{row['full_name']}' -> {tid}")
        cur.execute("UPDATE screenings SET tracking_id = %s WHERE id = %s", (tid, row['id']))
        
    conn.commit()
    cur.close()
    conn.close()
    print("Migration complete!")
except Exception as e:
    print("Error during migration:", e)

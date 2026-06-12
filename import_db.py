import mysql.connector

conn = mysql.connector.connect(host='epsilonsystems.org', user='u545480412_autism', password='SmartCareASD123!', database='u545480412_smart_care')
cur = conn.cursor()

cur.execute("SET FOREIGN_KEY_CHECKS = 0;")
cur.execute("DROP TABLE IF EXISTS children, results, screenings, users, doctor_reviews, audit_log;")
cur.execute("SET FOREIGN_KEY_CHECKS = 1;")

users_sql = """
CREATE TABLE users (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name       VARCHAR(120)        NOT NULL,
    email           VARCHAR(191)        NOT NULL UNIQUE,
    password_hash   VARCHAR(256)        NOT NULL,
    role            ENUM('parent','doctor','admin') NOT NULL DEFAULT 'parent',
    license_no      VARCHAR(60)         NULL,
    hospital_affiliate VARCHAR(160)     NULL,
    is_verified     BOOLEAN             NOT NULL DEFAULT FALSE,
    is_active       BOOLEAN             NOT NULL DEFAULT TRUE,
    created_at      DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role  (role)
) ENGINE=InnoDB;
"""

children_sql = """
CREATE TABLE children (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    parent_id       INT UNSIGNED        NOT NULL,
    full_name       VARCHAR(120)        NOT NULL,
    date_of_birth   DATE                NOT NULL,
    gender          ENUM('male','female','other') NOT NULL,
    created_at      DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_parent (parent_id)
) ENGINE=InnoDB;
"""

screenings_sql = """
CREATE TABLE screenings (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    child_id        INT UNSIGNED        NOT NULL,
    parent_id       INT UNSIGNED        NOT NULL,
    q1              TINYINT UNSIGNED    NULL,
    q2              TINYINT UNSIGNED    NULL,
    q3              TINYINT UNSIGNED    NULL,
    q4              TINYINT UNSIGNED    NULL,
    q5              TINYINT UNSIGNED    NULL,
    q6              TINYINT UNSIGNED    NULL,
    q7              TINYINT UNSIGNED    NULL,
    q8              TINYINT UNSIGNED    NULL,
    q9              TINYINT UNSIGNED    NULL,
    q10             TINYINT UNSIGNED    NULL,
    behavior_raw_score  FLOAT           NULL,
    image_consent   BOOLEAN             NOT NULL DEFAULT FALSE,
    image_path      VARCHAR(512)        NULL,
    vision_raw_score    FLOAT           NULL,
    fusion_score    FLOAT               NULL,
    risk_label      ENUM('Low','Moderate','High') NULL,
    gemini_summary  TEXT                NULL,
    pdf_path        VARCHAR(512)        NULL,
    status          ENUM('pending','partial','complete') NOT NULL DEFAULT 'pending',
    screened_at     DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (child_id)  REFERENCES children(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES users(id)    ON DELETE CASCADE,
    INDEX idx_child    (child_id),
    INDEX idx_parent   (parent_id),
    INDEX idx_risk     (risk_label),
    INDEX idx_screened (screened_at)
) ENGINE=InnoDB;
"""

doctor_reviews_sql = """
CREATE TABLE doctor_reviews (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    screening_id    INT UNSIGNED        NOT NULL,
    doctor_id       INT UNSIGNED        NOT NULL,
    notes           TEXT                NULL,
    reviewed_at     DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (screening_id) REFERENCES screenings(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id)    REFERENCES users(id)      ON DELETE CASCADE,
    UNIQUE KEY uq_review (screening_id, doctor_id)
) ENGINE=InnoDB;
"""

audit_log_sql = """
CREATE TABLE audit_log (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    actor_id        INT UNSIGNED        NULL,
    actor_role      VARCHAR(20)         NULL,
    action          VARCHAR(80)         NOT NULL,
    target_table    VARCHAR(60)         NULL,
    target_id       INT UNSIGNED        NULL,
    ip_address      VARCHAR(45)         NULL,
    user_agent      VARCHAR(255)        NULL,
    logged_at       DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_actor  (actor_id),
    INDEX idx_action (action),
    INDEX idx_logged (logged_at)
) ENGINE=InnoDB;
"""

admin_sql = """
INSERT IGNORE INTO users (full_name, email, password_hash, role, is_verified)
VALUES (
    'System Admin',
    'admin@smartcare.ai',
    'scrypt:32768:8:1$jHnJ4OGLDHE5Y819$ca44ae3a140cc6f44ac856b416f7a378d2f75f53300d9ab261a7b9e55d8c081dab26d0372b732383e00938f4c5686b99a6769143a7f06ec7ed9a97f590be6474',
    'admin',
    TRUE
);
"""

cur.execute(users_sql)
cur.execute(children_sql)
cur.execute(screenings_sql)
cur.execute(doctor_reviews_sql)
cur.execute(audit_log_sql)
cur.execute(admin_sql)

conn.commit()
print("Schema successfully created on Hostinger!")
conn.close()

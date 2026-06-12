-- =============================================================================
-- SmartCare ASD — MySQL Migration Script
-- RBAC Schema v1.0
-- Run as: mysql -u root -p < schema.sql
-- =============================================================================

CREATE DATABASE IF NOT EXISTS smart_care
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE smart_care;

-- ---------------------------------------------------------------------------
-- 1. USERS (Multi-role: parent | doctor | admin)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name       VARCHAR(120)        NOT NULL,
    email           VARCHAR(191)        NOT NULL UNIQUE,
    password_hash   VARCHAR(256)        NOT NULL,
    role            ENUM('parent','doctor','admin') NOT NULL DEFAULT 'parent',
    -- Doctor-only fields (NULL for parents)
    license_no      VARCHAR(60)         NULL,
    hospital_affiliate VARCHAR(160)     NULL,
    is_verified     BOOLEAN             NOT NULL DEFAULT FALSE,
    is_active       BOOLEAN             NOT NULL DEFAULT TRUE,
    created_at      DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role  (role)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- 2. CHILDREN (owned by a parent user)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS children (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    parent_id       INT UNSIGNED        NOT NULL,
    full_name       VARCHAR(120)        NOT NULL,
    date_of_birth   DATE                NOT NULL,
    gender          ENUM('male','female','other') NOT NULL,
    created_at      DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_parent (parent_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- 3. SCREENINGS  (one screening session per child visit)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS screenings (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    child_id        INT UNSIGNED        NOT NULL,
    parent_id       INT UNSIGNED        NOT NULL,
    tracking_id     VARCHAR(50)         NULL,
    -- Step 2 — Behavioral (Q-CHAT-10 raw scores, 1–5 Likert)
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
    behavior_raw_score  FLOAT           NULL,   -- SVM probability [0,1]
    -- Step 3 — Vision
    image_consent   BOOLEAN             NOT NULL DEFAULT FALSE,
    -- image_path is only populated when parent consents; otherwise NULL (ephemeral)
    image_path      VARCHAR(512)        NULL,
    vision_raw_score    FLOAT           NULL,   -- CNN probability [0,1]
    -- Step 4 — Fusion result
    fusion_score    FLOAT               NULL,   -- 0.6*vision + 0.4*behavior
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

-- ---------------------------------------------------------------------------
-- 4. DOCTOR–PATIENT ASSIGNMENTS (optional: doctor reviews high-risk cases)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS doctor_reviews (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    screening_id    INT UNSIGNED        NOT NULL,
    doctor_id       INT UNSIGNED        NOT NULL,
    notes           TEXT                NULL,
    reviewed_at     DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (screening_id) REFERENCES screenings(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id)    REFERENCES users(id)      ON DELETE CASCADE,
    UNIQUE KEY uq_review (screening_id, doctor_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- 5. AUDIT LOG  (HIPAA-style immutable event trail)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_log (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    actor_id        INT UNSIGNED        NULL,   -- NULL = unauthenticated
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

-- ---------------------------------------------------------------------------
-- 5.5 DOCTOR VERIFICATIONS (CARS2-ST Clinical Verification)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS doctor_verifications (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    screening_id    INT UNSIGNED        NOT NULL,
    doctor_id       INT UNSIGNED        NOT NULL,
    q1              FLOAT               NOT NULL,
    q2              FLOAT               NOT NULL,
    q3              FLOAT               NOT NULL,
    q4              FLOAT               NOT NULL,
    q5              FLOAT               NOT NULL,
    q6              FLOAT               NOT NULL,
    q7              FLOAT               NOT NULL,
    q8              FLOAT               NOT NULL,
    q9              FLOAT               NOT NULL,
    q10             FLOAT               NOT NULL,
    q11             FLOAT               NOT NULL,
    q12             FLOAT               NOT NULL,
    q13             FLOAT               NOT NULL,
    q14             FLOAT               NOT NULL,
    q15             FLOAT               NOT NULL,
    total_raw_score FLOAT               NOT NULL,
    severity_group  ENUM('Minimal','Mild-Moderate','Severe') NOT NULL,
    clinical_notes  TEXT                NULL,
    created_at      DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (screening_id) REFERENCES screenings(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id)    REFERENCES users(id)      ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- 6. Seed: default admin account  (password: Admin@SmartCare2025)
--    Hash generated with Werkzeug pbkdf2:sha256
-- ---------------------------------------------------------------------------
INSERT IGNORE INTO users (full_name, email, password_hash, role, is_verified)
VALUES (
    'System Admin',
    'admin@smartcare.ai',
    'scrypt:32768:8:1$jHnJ4OGLDHE5Y819$ca44ae3a140cc6f44ac856b416f7a378d2f75f53300d9ab261a7b9e55d8c081dab26d0372b732383e00938f4c5686b99a6769143a7f06ec7ed9a97f590be6474',
    'admin',
    TRUE
);

SELECT 'Migration complete. smart_care schema v1.0 installed.' AS STATUS;

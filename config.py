"""
SmartCare ASD — Centralised Configuration
All sensitive values should be overridden via environment variables in production.
"""
import os
from dotenv import load_dotenv

load_dotenv(override=True)

# ---------------------------------------------------------------------------
# Database
# ---------------------------------------------------------------------------
DB_CONFIG = {
    'host':     os.getenv('DB_HOST', 'localhost'),
    'user':     os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', 'Ribqah^0922'),
    'database': os.getenv('DB_NAME',     'smart_care'),
    'charset':  'utf8mb4',
    'collation': 'utf8mb4_unicode_ci',
    'autocommit': False,
}

# ---------------------------------------------------------------------------
# JWT
# ---------------------------------------------------------------------------
JWT_SECRET_KEY      = os.getenv('JWT_SECRET', 'sc-super-secret-jwt-key-change-in-prod!')
JWT_ACCESS_MINUTES  = int(os.getenv('JWT_ACCESS_MINUTES',  '60'))
JWT_REFRESH_DAYS    = int(os.getenv('JWT_REFRESH_DAYS',    '30'))

# ---------------------------------------------------------------------------
# Google Gemini
# ---------------------------------------------------------------------------
GEMINI_API_KEY      = os.getenv('GEMINI_API_KEY', '')   # loaded from .env via load_dotenv()
GEMINI_MODEL        = 'gemini-2.0-flash'   # updated from 1.5-flash which is deprecated

# ---------------------------------------------------------------------------
# CNN model path  (VGG16 fine-tuned weights)
# ---------------------------------------------------------------------------
CNN_MODEL_PATH      = os.getenv('CNN_MODEL_PATH', 'models/vgg16_asd.h5')
CNN_IMG_SIZE        = (224, 224)

# ---------------------------------------------------------------------------
# Fusion weights  (thesis-specified)
# ---------------------------------------------------------------------------
FUSION_VISION_WEIGHT   = 0.6
FUSION_BEHAVIOR_WEIGHT = 0.4

# ---------------------------------------------------------------------------
# Risk thresholds
# ---------------------------------------------------------------------------
RISK_HIGH_THRESHOLD     = 0.65
RISK_MODERATE_THRESHOLD = 0.40

# ---------------------------------------------------------------------------
# PDF output dir
# ---------------------------------------------------------------------------
REPORTS_DIR = os.getenv('REPORTS_DIR', 'reports')
os.makedirs(REPORTS_DIR, exist_ok=True)

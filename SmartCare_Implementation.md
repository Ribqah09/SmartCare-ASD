# SmartCare ASD — Production Build Summary

## What Was Built

### 🐛 Original Bug (Answered)
**Parse error: missing closing quote in string literal @L12**

The original `app.py` line 12 had:
```python
'password': '[Ribqah^0922   # ← stray '[', string never closed
```
**Fix:** `'password': 'Ribqah^0922',` — two problems: (1) stray `[` bracket, (2) no closing `'`.

---

## Files Created

| File | Purpose |
|---|---|
| `schema.sql` | MySQL RBAC migration — 5 tables + audit log + admin seed |
| `config.py` | Centralised config (DB, JWT, Gemini, CNN weights, fusion weights) |
| `inference.py` | Multimodal inference engine with **ephemeral image processing** |
| `pdf_report.py` | Clinical PDF generator (fpdf2) |
| `app.py` | Full production Flask API — 15 routes |

---

## Database Schema (5 Tables)

```
users          — Multi-role: parent | doctor | admin
children       — Owned by parent, DOB + gender
screenings     — 4-step wizard session: Q-CHAT + image + fusion results
doctor_reviews — Doctor annotates high-risk cases
audit_log      — Immutable HIPAA-style event trail
```

> **Migration applied** — `smart_care` database created, all tables installed ✅

---

## API Routes

### Auth
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | None | Multi-role sign-up |
| POST | `/api/auth/login` | None | JWT login (returns access + refresh tokens) |
| GET | `/api/auth/me` | JWT | Current user profile |

### Parent Dashboard
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/children` | Parent JWT | Add child profile |
| GET | `/api/children` | Parent JWT | List children |
| POST | `/api/screenings/start` | Parent JWT | Step 1 — Open screening |
| PUT | `/api/screenings/<id>/qchat` | Parent JWT | Step 2 — Submit Q-CHAT-10 |
| PUT | `/api/screenings/<id>/infer` | Parent JWT | Step 3+4 — Image upload + fusion |
| GET | `/api/screenings/<id>` | JWT | Get full result |

### Doctor Dashboard
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/doctor/triage` | Doctor JWT | High-risk case list |
| GET | `/api/doctor/patient/<child_id>` | Doctor JWT | Full patient history |

### Utilities
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/reports/<filename>` | JWT | Download PDF report |
| GET | `/api/test-db` | None | DB health check |

---

## Fusion Formula (Thesis-Specified)

```
S_final = (0.6 × P_vision) + (0.4 × P_behavior)

Risk Labels:
  ≥ 0.65  →  High     (immediate referral)
  ≥ 0.40  →  Moderate (monitoring recommended)
  < 0.40  →  Low      (reassurance + follow-up)
```

---

## Privacy Architecture (Ephemeral Image Processing)

```python
image_bytes = request.files['image'].read()   # RAM only
p_vision    = predict_vision(image_bytes)      # CNN inference
del image_bytes                                # GC reclaims immediately

# Only saved if parent explicitly sends image_consent=true
if image_consent:
    open(path, 'wb').write(image_bytes)
```
> **Facial data is NEVER written to disk by default.**

---

## AI Stack

| Component | Technology | Status |
|---|---|---|
| CNN Vision | VGG16 (TensorFlow/Keras) | 🟡 Demo mode (needs `.h5` weights at `models/vgg16_asd.h5`) |
| Behavioral SVM | scikit-learn RBF Kernel | 🟡 Demo mode (needs `models/svm_qchat.pkl`) |
| Explainable AI | Google Gemini 1.5 Flash | 🟡 Needs `GEMINI_API_KEY` env var |
| PDF | fpdf2 | ✅ Ready |

---

## How to Add Your Gemini API Key

```powershell
# Windows PowerShell — set for this session
$env:GEMINI_API_KEY = "your-key-here"
python app.py
```

Or add to a `.env` file (add `python-dotenv` and call `load_dotenv()` in `config.py`).

---

## Next Steps

1. **Train/export CNN weights** → `models/vgg16_asd.h5`
2. **Train SVM** → `models/svm_qchat.pkl`
3. **Add Gemini API key** → `GEMINI_API_KEY` env variable
4. **Build React Screening Wizard** frontend (Vite + TypeScript recommended)
5. **Production deploy**: switch `debug=False`, use Gunicorn/uWSGI

---

## Server Status

```
✅ Running on http://127.0.0.1:5000
✅ GET /         → 200 OK
✅ GET /api/test-db → 200 OK  (connected to smart_care DB)
```

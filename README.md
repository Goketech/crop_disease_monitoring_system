## Crop Disease Early Warning System

Backend: Flask (Python)  
Frontend: React (JavaScript)

This project implements the architecture and database design described in the technical presentation:

- Flask REST API with JWT auth, image upload, ML diagnosis hook, SMS + email notifications
- MySQL database with 7 core tables (`users`, `crop_reports`, `ml_diagnoses`, `agronomist_feedback`, `reports`, `sms_notifications`, `sessions`)
- React frontend with Farmer portal and Agronomist dashboard shells

### Development quick start

#### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # then fill in values
flask run --app app
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

See `backend/app/config.py` and `frontend/README.md` for more details.


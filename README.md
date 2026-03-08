=======
## Crop Disease Early Warning System

Backend: Flask (Python)  
Frontend: React (JavaScript)

This project is a Crop Disease Monitoring System that helps farmers detect crop diseases using a web application. Users can upload images of their crops, and the system identifies potential diseases and provides recommendations.

This project implements the architecture and database design described in the technical presentation:

- Flask REST API with JWT auth, image upload, ML diagnosis hook, SMS + email notifications
- MySQL database with 7 core tables (`users`, `crop_reports`, `ml_diagnoses`, `agronomist_feedback`, `reports`, `sms_notifications`, `sessions`)
- React frontend with Farmer portal and Agronomist dashboard shells

Features

Upload crop images for disease detection

Automatic disease diagnosis

Farmer registration and login

REST API for backend communication

Automated API testing using pytest

Testing: pytest, requests

Version Control: Git & GitHub

Project Structure
crop_disease_monitoring_system
│
├── app.py
├── requirements.txt
├── models.py
│
├── tests
│   ├── test_api.py
│   ├── test_edge_cases.py
│   └── test_upload.py
│
└── README.md
Installation

Clone the repository:

git clone https://github.com/Goketech/crop_disease_monitoring_system.git

Navigate into the project folder:

cd crop_disease_monitoring_system

Install dependencies:

pip install -r requirements.txt
Running the Application

Start the backend server:

python app.py

The server will run at:

http://localhost:5000
Running Tests

Install test dependencies (if separate):

pip install pytest requests

Run tests:

python -m pytest
Test Cases Implemented

API endpoint testing

Image upload testing

Edge case testing

Automated testing using pytest

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

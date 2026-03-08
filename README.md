Crop Disease Monitoring System
Overview

This project is a Crop Disease Monitoring System that helps farmers detect crop diseases using a web application. Users can upload images of their crops, and the system identifies potential diseases and provides recommendations.

Features

Upload crop images for disease detection

Automatic disease diagnosis

Farmer registration and login

REST API for backend communication

Automated API testing using pytest

Tech Stack

Backend: Python, Flask

Machine Learning / Image Processing: OpenCV / TensorFlow (if used)

Database: SQLite / MySQL

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

Contributors

Abatoni Mugabo Lea – Testing & deploying



License

This project is for educational purposes.

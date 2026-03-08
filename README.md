# Face Recognition Attendance System

## Overview

This project is a **Face Recognition Attendance System** that automatically marks student attendance using facial recognition technology.

The system detects and recognizes faces from images or a camera feed and records attendance in the database.

## Features

* Face detection and recognition
* Automatic attendance marking
* Student registration
* Image upload for recognition
* REST API for backend communication
* Automated API testing using pytest

## Tech Stack

* **Backend:** Python, Flask
* **Face Recognition:** OpenCV
* **Database:** SQLite / MySQL
* **Testing:** pytest, requests
* **Version Control:** Git & GitHub

## Project Structure

```
project-folder
│
├── app.py
├── requirements.txt
│
├── tests
│   ├── test_api.py
│   ├── test_edge_cases.py
│   └── test_upload.py
│
└── README.md
```

## Installation

1. Clone the repository

```
git clone
https://github.com/Goketech/crop_disease_monitoring_system.git
```

2. Navigate into the project folder

```
cd your-repository crop_disease_monitoring_system
```

3. Install dependencies

```
pip install -r requirements.txt
```

## Running the Application

Start the backend server:

```
python app.py
```

The server will run at:

```
http://localhost:5000
```

## Running Tests

Install test dependencies:

```
pip install -r requirements-test.txt
```

Run tests:

```
python -m pytest
```

## Test Cases Implemented

* API endpoint testing
* File upload testing
* Edge case testing
* Automated testing using pytest

## Contributors

* Abatoni Mugabo Lea – Backend Development & Testing

## License

This project is for educational purposes.

import requests

BASE_URL = "http://localhost:5000"

def test_register():

    data = {
        "username": "test_farmer",
        "password": "123456"
    }

    try:
        response = requests.post(f"{BASE_URL}/register", json=data)
        assert response.status_code == 200
    except requests.exceptions.ConnectionError:
        print("Backend server is not running")
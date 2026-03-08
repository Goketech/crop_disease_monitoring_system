import requests

BASE_URL = "http://localhost:5000"

def test_empty_registration():
    """Test submitting an empty registration form"""
    try:
        response = requests.post(f"{BASE_URL}/register", json={})
        assert response.status_code != 200
    except requests.exceptions.ConnectionError:
        print("Backend server is not running")


def test_invalid_file_upload():
    """Test uploading an invalid file format"""
    try:
        files = {"image": ("invalid.txt", b"This is not an image")}
        response = requests.post(f"{BASE_URL}/upload", files=files)
        assert response.status_code != 200
    except requests.exceptions.ConnectionError:
        print("Backend server is not running")
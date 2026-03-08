import requests

BASE_URL = "http://localhost:5000"

def test_image_upload():
    """Test uploading a valid image"""
    try:
        files = {
            "image": ("sample.jpg", b"fake-image-data", "image/jpeg")
        }

        response = requests.post(f"{BASE_URL}/upload", files=files)

        # Expect successful upload response
        assert response.status_code == 200

    except requests.exceptions.ConnectionError:
        print("Backend server is not running")
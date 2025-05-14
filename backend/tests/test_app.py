
import pytest
import json
import sys
import os

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_register_missing_fields(client):
    response = client.post('/api/register', 
                          data=json.dumps({'email': 'test@example.com'}),
                          content_type='application/json')
    assert response.status_code == 400
    assert b'Missing required fields' in response.data

def test_login_missing_fields(client):
    response = client.post('/api/login', 
                          data=json.dumps({'email': 'test@example.com'}),
                          content_type='application/json')
    assert response.status_code == 400
    assert b'Missing required fields' in response.data

def test_save_stats_missing_fields(client):
    response = client.post('/api/stats', 
                          data=json.dumps({'user_id': '1'}),
                          content_type='application/json')
    assert response.status_code == 400
    assert b'Missing required fields' in response.data

# Integration tests would be added here, but they would require a test database
# For simplicity, we're only including basic unit tests

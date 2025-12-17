from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import psycopg2
from psycopg2.extras import RealDictCursor
import json
import hashlib
import uuid
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Database connection
def get_db_connection():
    conn = psycopg2.connect(
        host=os.environ.get('DB_HOST', 'db'),
        database=os.environ.get('DB_NAME', 'gamerzo'),
        user=os.environ.get('DB_USER', 'postgres'),
        password=os.environ.get('DB_PASSWORD', 'postgres'),
        port=os.environ.get('DB_PORT', 5432)
    )
    conn.autocommit = True
    return conn

# Health check endpoint for Kubernetes probes
@app.route('/health', methods=['GET'])
def health_check():
    try:
        # Test database connection
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT 1')
        cursor.close()
        conn.close()
        return jsonify({'status': 'healthy', 'database': 'connected'}), 200
    except Exception as e:
        return jsonify({'status': 'unhealthy', 'error': str(e)}), 503

# Root endpoint
@app.route('/', methods=['GET'])
def root():
    return jsonify({'message': 'Gamerzo Backend API', 'status': 'running'}), 200

# User authentication endpoints
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()

    if not all(k in data for k in ('email', 'password', 'username')):
        return jsonify({'error': 'Missing required fields'}), 400

    email = data['email']
    password = data['password']
    username = data['username']

    # Hash the password
    hashed_password = hashlib.sha256(password.encode()).hexdigest()

    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        # Check if user already exists
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({'error': 'User already exists'}), 409

        # Insert new user
        cursor.execute(
            "INSERT INTO users (email, password, username) VALUES (%s, %s, %s) RETURNING id, email, username",
            (email, hashed_password, username)
        )

        new_user = cursor.fetchone()
        cursor.close()
        conn.close()

        # Return user data without password
        return jsonify({'user': new_user}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()

    if not all(k in data for k in ('email', 'password')):
        return jsonify({'error': 'Missing required fields'}), 400

    email = data['email']
    password = data['password']

    # Hash the password
    hashed_password = hashlib.sha256(password.encode()).hexdigest()

    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        # Check user credentials
        cursor.execute(
            "SELECT id, email, username FROM users WHERE email = %s AND password = %s",
            (email, hashed_password)
        )

        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if user:
            return jsonify({'user': user}), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Game statistics endpoints
@app.route('/api/stats', methods=['POST'])
def save_stats():
    data = request.get_json()

    if not all(k in data for k in ('user_id', 'winner')):
        return jsonify({'error': 'Missing required fields'}), 400

    user_id = data['user_id']
    winner = data['winner']

    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        # Insert game result
        cursor.execute(
            "INSERT INTO games (user_id, winner) VALUES (%s, %s) RETURNING id",
            (user_id, winner)
        )

        game_id = cursor.fetchone()['id']

        # Update user statistics
        if winner == 'X':
            cursor.execute(
                "UPDATE user_stats SET total_games = total_games + 1, x_wins = x_wins + 1 WHERE user_id = %s",
                (user_id,)
            )
        elif winner == 'O':
            cursor.execute(
                "UPDATE user_stats SET total_games = total_games + 1, o_wins = o_wins + 1 WHERE user_id = %s",
                (user_id,)
            )
        else:  # Draw
            cursor.execute(
                "UPDATE user_stats SET total_games = total_games + 1, draws = draws + 1 WHERE user_id = %s",
                (user_id,)
            )

        # If no rows were updated, create a new stats record
        if cursor.rowcount == 0:
            x_wins = 1 if winner == 'X' else 0
            o_wins = 1 if winner == 'O' else 0
            draws = 1 if winner == 'draw' else 0

            cursor.execute(
                "INSERT INTO user_stats (user_id, total_games, x_wins, o_wins, draws) VALUES (%s, 1, %s, %s, %s)",
                (user_id, x_wins, o_wins, draws)
            )

        # Get updated stats
        cursor.execute("SELECT * FROM user_stats WHERE user_id = %s", (user_id,))
        stats = cursor.fetchone()

        cursor.close()
        conn.close()

        return jsonify({'game_id': game_id, 'stats': stats}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/stats/<user_id>', methods=['GET'])
def get_stats(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("SELECT * FROM user_stats WHERE user_id = %s", (user_id,))
        stats = cursor.fetchone()

        cursor.close()
        conn.close()

        if stats:
            return jsonify({'stats': stats}), 200
        else:
            return jsonify({'stats': {'total_games': 0, 'x_wins': 0, 'o_wins': 0, 'draws': 0}}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

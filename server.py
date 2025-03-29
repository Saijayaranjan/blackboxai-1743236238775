from flask import Flask, render_template, jsonify
import firebase_admin
from firebase_admin import credentials, db
import threading
import time

app = Flask(__name__, static_folder='.', static_url_path='')

# Initialize Firebase
try:
    import json
    with open('firebase-config.json') as f:
        config = json.load(f)
    
    # Initialize with minimal configuration
    firebase_admin.initialize_app(options={
        'databaseURL': config['databaseURL'],
        'credential': credentials.ApplicationDefault()
    })
    print("Firebase initialized successfully using application default credentials")
except Exception as e:
    print(f"Error initializing Firebase: {e}")
    print("Running in offline mode with simulated data")

# Global variable to store sensor data
sensor_data = {
    'moisture': 0,
    'temperature': 0,
    'humidity': 0
}

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/sensor-data')
def get_sensor_data():
    try:
        # Get latest data from Firebase
        ref = db.reference('/sensor_data')
        data = ref.get()
        if data:
            global sensor_data
            sensor_data = data
        else:
            # Simulate data if none available
            sensor_data = {
                'moisture': round(30 + 50 * (time.time() % 1), 1),
                'temperature': round(20 + 10 * (time.time() % 1), 1),
                'humidity': round(40 + 30 * (time.time() % 1), 1)
            }
        return jsonify(sensor_data)
    except Exception as e:
        print(f"Error fetching from Firebase: {e}")
        # Return simulated data
        return jsonify({
            'moisture': round(30 + 50 * (time.time() % 1), 1),
            'temperature': round(20 + 10 * (time.time() % 1), 1),
            'humidity': round(40 + 30 * (time.time() % 1), 1)
        })

def run_server():
    app.run(host='0.0.0.0', port=8001, threaded=True)

if __name__ == '__main__':
    run_server()
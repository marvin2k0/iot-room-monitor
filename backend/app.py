from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import sqlite3
import time
import logging
import requests
import os

load_dotenv()

haKey = os.getenv("HA_TOKEN")
app = Flask(__name__)
CORS(app, origins=["http://web.lan", "htp://10.0.0.2", "http://192.168.0.36", "http://web.home", "http://localhost:4200"])

gunicorn_logger = logging.getLogger('gunicorn.error')
app.logger.handlers = gunicorn_logger.handlers
app.logger.setLevel(gunicorn_logger.level)

def init_db():
    conn = sqlite3.connect("sensordata.db")
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS sensor_data (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              temperature REAL,
              humidity REAL,
              timestamp INTEGER
        );
    """)
    conn.commit()
    conn.close()

init_db()

@app.route("/yesterday", methods=["GET"])
def get_yesterday_data():
    now = int(time.time() * 1000)  # current time in ms
    yesterday_time = now - (24 * 60 * 60 * 1000)  # this time yesterday in ms

    conn = sqlite3.connect("sensordata.db")
    c = conn.cursor()

    # Get the row closest to 'yesterday_time'
    c.execute("""
        SELECT humidity, temperature, ABS(timestamp - ?) as diff
        FROM sensor_data
        ORDER BY diff ASC
        LIMIT 1;
    """, (yesterday_time,))

    row = c.fetchone()
    conn.close()

    if row:
        humidity, temperature, _ = row
        return jsonify({"humidity": humidity, "temperature": temperature, "timestamp": yesterday_time}), 200
    else:
        return jsonify({"message": "No data available for this time yesterday"}), 404

def get_lamp_status(lamp_name):
    headers = {
        "Authorization": f"Bearer {haKey}"
    }
    response = requests.get(f"http://pi.home:8123/api/states/light.{lamp_name}", headers=headers)

    if response.status_code == 200:
        return jsonify(response.json()), 200
    else:
        return jsonify({"message": "An error occured"}), 400

@app.route("/lamps/<lamp_name>", methods=["GET"])
def get_lamps(lamp_name):
    lamp_status = get_lamp_status(lamp_name)
    return lamp_status

@app.route("/temp", methods=["POST"])
def receive_temp():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data received"}), 400

    temperature = data.get("temperature")
    humidity = data.get("humidity")

    if temperature is None or humidity is None:
        return jsonify({"error": "Temperature or humidity s missing"}), 400

    conn = sqlite3.connect("sensordata.db")
    c = conn.cursor()
    c.execute("INSERT INTO sensor_data (temperature, humidity, timestamp) VALUES (?, ?, ?);", (temperature, humidity, int(time.time() * 1000)))
    conn.commit()
    conn.close()

    app.logger.info(f"Room conditions: {temperature}°C and {humidity}% humidity")
    return jsonify({"message": "Data received"}), 200

@app.route("/temp", methods=["GET"])
def get_temp():
    conn = sqlite3.connect('sensordata.db')
    ten_hours_ago = time.time() * 1000 - 1000 * 60 * 60 * 5
    c = conn.cursor()
    c.execute('SELECT temperature, humidity, timestamp FROM sensor_data WHERE timestamp >= ?', (0,))
    rows = c.fetchall()
    conn.close()

    data = [
        {"temperature": temp, "humidity": hum, "timestamp": timestamp}
        for temp, hum, timestamp in rows
    ]

    return jsonify(data), 200

@app.route("/current", methods=["GET"])
def get_current_temp():
    conn = sqlite3.connect("sensordata.db")
    c = conn.cursor()
    c.execute("SELECT temperature, humidity FROM sensor_data ORDER BY timestamp DESC LIMIT 1")
    rows = c.fetchone()
    conn.close()

    if rows:
        temperature, humidity = rows
        return jsonify({"temperature": temperature, "humidity": humidity}), 200
    else:
        return jsonify({"message": "No data recorded yet!"}), 404



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
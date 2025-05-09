from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:4200"])

@app.route("/", methods=["POST"])
def receive_sensor_data():
    data = request.get_json()
    
    temperature = data.get("temperature")
    humidity = data.get("humidity")

    if temperature == None or humidity == None:
        return jsonify({"error": "Incomplete request body"}), 400
    
    print(temperature, humidity)
    
    return jsonify({"message": "Received data"}), 200

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8080)

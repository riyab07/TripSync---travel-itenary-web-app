from flask import Flask, request, jsonify
app = Flask(__name__)

@app.route('/detect-food', methods=['POST'])
def detect_food():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    # Placeholder for food detection logic
    return jsonify({
        "message": "Detected: Apple",
        "item": {"id": "123", "name": "Apple", "qty": 1, "storage": "Fridge", "expiry": "2025-06-15"}
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
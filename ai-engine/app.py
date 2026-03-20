from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route("/", methods=["GET"])
def health_check():
    return jsonify({"status": "FutureSight AI Engine is running 🚀"})

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No JSON received"}), 400

        expense = data.get("expense") or data.get("amount") or 0
        expense = float(expense)

        yearly_loss = expense * 365

        return jsonify({
            "future_loss": yearly_loss,
            "future_loss_10_years": yearly_loss * 10,
            "yearly_spend": yearly_loss,
            "suggestions": ["Reduce unnecessary spending"],
            "message": "Reduce unnecessary spending"
        })

    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
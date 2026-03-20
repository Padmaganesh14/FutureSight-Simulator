from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route("/", methods=["GET"])
def health_check():
    return jsonify({"status": "FutureSight AI Engine is absolutely running perfectly!"})

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    # Get expense from 'expense' key (as requested) or 'amount' (for frontend compatibility)
    expense = data.get("expense") or data.get("amount") or 0
    expense = float(expense)

    # simple logic (as requested)
    yearly_loss = expense * 365

    return jsonify({
        "future_loss": yearly_loss,
        "future_loss_10_years": yearly_loss * 10, # Compatibility for frontend
        "yearly_spend": yearly_loss,              # Compatibility for frontend
        "suggestions": ["Reduce unnecessary spending"], # Compatibility for frontend
        "message": "Reduce unnecessary spending"
    })

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)

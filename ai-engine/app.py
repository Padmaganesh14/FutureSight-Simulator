from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    amount = float(data.get('amount', 0))
    frequency = data.get('frequency', 'monthly').lower()
    category = data.get('category', 'general').lower()

    multiplier = 1
    if frequency == 'monthly':
        multiplier = 12
    elif frequency == 'weekly':
        multiplier = 52
    elif frequency == 'daily':
        multiplier = 365
    
    yearly_spend = amount * multiplier
    
    # 8% index fund return over 10 years
    rate = 0.08
    years = 10
    
    # Future Value (Loss of potential savings)
    future_loss = yearly_spend * (((1 + rate)**years - 1) / rate)

    suggestions = []
    
    if yearly_spend > 5000 and category in ['dining', 'entertainment', 'shopping']:
        savings_invested = (yearly_spend * 0.2) * (((1 + rate)**years - 1) / rate)
        suggestions.append(f"Your {category} expenses are quite high. Reducing them by 20% saves you ₹{yearly_spend * 0.2:,.2f} a year.")
        suggestions.append(f"If you invest that 20% savings, you'll have an extra ₹{savings_invested:,.2f} in 10 years.")
    else:
        suggestions.append(f"Investing this ₹{yearly_spend:,.2f} every year could yield ₹{future_loss:,.2f} over 10 years!")

    if category == 'subscriptions':
        suggestions.append("Consider auditing your subscriptions. Unused ones drain wealth silently.")

    return jsonify({
        "yearly_spend": round(yearly_spend, 2),
        "future_loss_10_years": round(future_loss, 2),
        "suggestions": suggestions
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)

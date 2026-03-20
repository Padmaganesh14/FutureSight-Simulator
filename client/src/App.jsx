import React, { useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    amount: '',
    frequency: 'monthly',
    category: 'general'
  });
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Connects to Node API
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await axios.post(`${API_URL}/api/simulate`, formData);
      setResults(res.data.data.ai_insights);
    } catch (err) {
      console.error(err);
      alert('Error fetching data. Ensure Node backend (port 3000) and Python AI engine (port 5000) are running.');
    } finally {
      setLoading(false);
    }
  };

  const chartData = results ? [
    { name: 'Yearly Spend', value: results.yearly_spend, fill: 'url(#colorSpend)' },
    { name: '10y Potential Cost', value: results.future_loss_10_years, fill: 'url(#colorLoss)' }
  ] : [];

  return (
    <div className="app-container">
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>
      <header className="header">
        <h1>FutureSight Simulator</h1>
        <p>Visualize the future impact of your spending habits.</p>
      </header>
      
      <main className="main-content">
        <section className="input-panel glass-panel">
          <h2>Input Expense</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Amount (₹)</label>
              <input 
                type="number" 
                required 
                value={formData.amount} 
                onChange={e => setFormData({...formData, amount: e.target.value})}
                placeholder="e.g. 50"
              />
            </div>
            
            <div className="form-group">
              <label>Frequency</label>
              <select 
                value={formData.frequency} 
                onChange={e => setFormData({...formData, frequency: e.target.value})}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Category</label>
              <select 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option value="general">General</option>
                <option value="dining">Dining & Food</option>
                <option value="entertainment">Entertainment</option>
                <option value="shopping">Shopping</option>
                <option value="subscriptions">Subscriptions</option>
              </select>
            </div>
            
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Simulating...' : 'Run Simulation'}
            </button>
          </form>
        </section>

        <section className="dashboard glass-panel">
          <h2>Insights Dashboard</h2>
          {results ? (
            <div className="results">
              <div className="metrics">
                <div className="metric-card red">
                  <h3>Yearly Spend</h3>
                  <p>₹{results.yearly_spend.toLocaleString()}</p>
                </div>
                <div className="metric-card green">
                  <h3>10-Year Opportunity Cost</h3>
                  <p>₹{results.future_loss_10_years.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <defs>
                      <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={1} />
                        <stop offset="95%" stopColor="#e11d48" stopOpacity={0.6} />
                      </linearGradient>
                      <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={1} />
                        <stop offset="95%" stopColor="#059669" stopOpacity={0.6} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#94a3b8" 
                      tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }} 
                      axisLine={false} 
                      tickLine={false} 
                      dy={10} 
                    />
                    <YAxis 
                      stroke="#94a3b8" 
                      tick={{ fill: '#94a3b8', fontSize: 13 }} 
                      axisLine={false} 
                      tickLine={false} 
                      tickFormatter={(value) => `₹${value.toLocaleString()}`} 
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.85)', 
                        backdropFilter: 'blur(12px)', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        borderRadius: '12px', 
                        color: '#f8fafc', 
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' 
                      }} 
                      itemStyle={{ fontWeight: 600 }}
                      formatter={(value) => `₹${value.toLocaleString()}`}
                    />
                    <Bar dataKey="value" barSize={60} radius={[8, 8, 8, 8]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="ai-tips">
                <h3>💡 AI Smart Suggestions</h3>
                <ul>
                  {results.suggestions.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="icon">📊</div>
              <p>Enter an expense on the left to see your future projections.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;

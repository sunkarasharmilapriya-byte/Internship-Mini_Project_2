import React, { useState, useEffect } from 'react';
import './App.css';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_TYPES = ['breakfast', 'lunch', 'dinner'];

function App() {
  const [meals, setMeals] = useState({});
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('All changes saved');

  useEffect(() => {
    fetch('http://localhost:5000/api/meals')
      .then((res) => res.json())
      .then((data) => {
        setMeals(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching meal plan:", err);
        setLoading(false);
      });
  }, []);

  const handleInputChange = (day, mealType, value) => {
    setMeals((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: value,
      },
    }));
  };

  const handleSaveToServer = (day, mealType, value) => {
    setSaveStatus('Saving changes...');
    fetch('http://localhost:5000/api/meals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ day, mealType, value }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSaveStatus('Changes saved automatically');
        }
      })
      .catch((err) => {
        console.error("Failed to persist data:", err);
        setSaveStatus('Error saving to server');
      });
  };

  if (loading) {
    return <div className="loading-screen">Loading your culinary dashboard...</div>;
  }

  return (
    <div className="dashboard-wrapper">
      <header className="main-header">
        <h1>Meal Planner Hub</h1>
        <p className="subtitle">Your weekly culinary roadmap at a glance</p>
        <div className={`status-badge ${saveStatus.includes('Error') ? 'error' : ''}`}>
          {saveStatus}
        </div>
      </header>

      {/* Main timeline wrapper for horizontal layout */}
      <main className="timeline-container">
        {DAYS_OF_WEEK.map((day) => (
          <section key={day} className="day-card">
            <h2 className="day-title">{day}</h2>
            <div className="meal-inputs">
              {MEAL_TYPES.map((type) => (
                <div key={type} className="input-group">
                  <label className="meal-label">{type}</label>
                  <input
                    type="text"
                    className="meal-field"
                    value={meals[day]?.[type] || ''}
                    placeholder={`What's for ${type}?`}
                    onChange={(e) => handleInputChange(day, type, e.target.value)}
                    onBlur={(e) => handleSaveToServer(day, type, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.target.blur();
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}

export default App;
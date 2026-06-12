const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let mealPlan = {
    Monday: { breakfast: "Berry Acai Bowl", lunch: "Zesty Avocado Salad", dinner: "Glazed Salmon & Asparagus" },
    Tuesday: { breakfast: "Mango Chia Pudding", lunch: "Spicy Chickpea Wrap", dinner: "Sweet Potato Buddha Bowl" },
    Wednesday: { breakfast: "Spinach Omelet", lunch: "Rainbow Quinoa Salad", dinner: "Thai Green Curry" },
    Thursday: { breakfast: "Peanut Butter Toast", lunch: "Mediterranean Mezze Platter", dinner: "Lemon Herb Grilled Chicken" },
    Friday: { breakfast: "Tropical Smoothie", lunch: "Tomato Basil Soup", dinner: "Fiesta Tacos" },
    Saturday: { breakfast: "Fluffy Pancakes", lunch: "Pesto Pasta Salad", dinner: "Homemade Margherita Pizza" },
    Sunday: { breakfast: "Avocado Benedict", lunch: "Harvest Grain Bowl", dinner: "Roasted Vegetable Lasagna" }
};

app.get('/api/meals', (req, res) => {
    res.json(mealPlan);
});

app.post('/api/meals', (req, res) => {
    const { day, mealType, value } = req.body;
    if (mealPlan[day] && mealType in mealPlan[day]) {
        mealPlan[day][mealType] = value;
        return res.json({ success: true, message: `Updated ${day}'s ${mealType}`, data: mealPlan });
    }
    res.status(400).json({ success: false, message: "Invalid Day or Meal Type" });
});

app.listen(PORT, () => {
    console.log(`Meal Planner backend running on http://localhost:${PORT}`);
});
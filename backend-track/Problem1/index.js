const express = require('express');
const app = express();

const PORT = 3000;

app.use(express.json());

const vehicleTasks = [
  { id: "VMS-001", model: "Tesla Model 3", type: "Battery Audit", cost: 12000, priorityValue: 90 },
  { id: "VMS-002", model: "BMW X5", type: "Oil Renewal", cost: 4000, priorityValue: 40 },
  { id: "VMS-003", model: "Ford Mustang", type: "Brake Replacement", cost: 8000, priorityValue: 70 },
  { id: "VMS-004", model: "Hyundai i20", type: "Wheel Alignment", cost: 2000, priorityValue: 30 },
  { id: "VMS-005", model: "Honda Civic", type: "Filter Cleaning", cost: 1500, priorityValue: 20 },
  { id: "VMS-006", model: "Audi A6", type: "Full Diagnostics", cost: 10000, priorityValue: 85 },
  { id: "VMS-007", model: "Tata Nexon", type: "General Service", cost: 5000, priorityValue: 50 }
];

app.post('/vehicles/maintenance/optimize', (req, res) => {
  const { budget } = req.body;

  if (!budget || typeof budget !== 'number') {
    return res.status(400).json({ error: "Please provide a valid budget in the request body" });
  }

  const n = vehicleTasks.length;
  const dp = Array(n + 1).fill().map(() => Array(budget + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= budget; w++) {
      if (vehicleTasks[i - 1].cost <= w) {
        dp[i][w] = Math.max(
          vehicleTasks[i - 1].priorityValue + dp[i - 1][w - vehicleTasks[i - 1].cost],
          dp[i - 1][w]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  let selectedTasks = [];
  let w = budget;
  for (let i = n; i > 0 && w > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selectedTasks.push(vehicleTasks[i - 1]);
      w -= vehicleTasks[i - 1].cost;
    }
  }

  const totalCost = selectedTasks.reduce((sum, item) => sum + item.cost, 0);
  const totalPriorityScore = dp[n][budget];

  res.json({
    maxBudgetProvided: budget,
    totalEstimatedCost: totalCost,
    totalPriorityScore: totalPriorityScore,
    optimizedTasksToSchedule: selectedTasks.reverse()
  });
});

app.listen(PORT, () => {
  console.log(`Vehicle Maintenance Optimizer running on port ${PORT}`);
});
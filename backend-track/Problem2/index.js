const express = require('express');
const app = express();

const PORT = 4000;

app.use(express.json());

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} request made to: ${req.url}`);
  next();
});

app.get('/vehicles', (req, res) => {
  res.json({ message: "Logging middleware verified successfully for GET vehicles" });
});

app.post('/vehicles/logs-test', (req, res) => {
  res.json({ message: "Logging middleware verified successfully for POST vehicles" });
});

app.listen(PORT, () => {
  console.log(`Logging Middleware Service running on port ${PORT}`);
});
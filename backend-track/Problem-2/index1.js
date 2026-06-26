const express = require('express');
const app = express();

const PORT = 4000;

app.use(express.json());

app.use((req, res, next) => {
  const currentTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  console.log(`[${currentTimestamp}] ${req.method} request to ${req.url}`);
  next();
});

app.get('/logs', (req, res) => {
  res.json({ status: "success", message: "Middleware logs captured" });
});

app.listen(PORT, () => {
  console.log(`Logging server running on port ${PORT}`);
});
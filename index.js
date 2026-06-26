const express = require('express');
const axios = require('axios');
const app = express();

const PORT = 3000;
const TOKEN = "YOUR_ACCESS_TOKEN_HERE"; 

app.use(express.json());

async function Log(stack, level, pkg, message) {
  const url = "http://4.224.186.213/evaluation-service/logs";
  
  const body = {
    stack: stack,      
    level: level,       
    package: pkg,       
    message: message    
  };

  try {
    await axios.post(url, body, {
      headers: {
        'Authorization': `Bearer ${TOKEN}` 
      }
    });
    console.log(`[Logged to Server] ${level}: ${message}`);
  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message);
  }
}

const loggingMiddleware = (req, res, next) => {

    Log("backend", "info", "route", `User visited route: ${req.path}`);
  next(); 
};

app.use(loggingMiddleware);


app.get('/', (req, res) => {
  res.send("Home Page! Running Log.");
});

app.get('/db-error', (req, res) => {
  Log("backend", "fatal", "db", "Critical database connection failure.");
  res.status(500).send("Database crash simulated!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
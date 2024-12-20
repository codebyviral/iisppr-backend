// chatbot-backend/index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Dummy chatbot responses
const responses = {
  hello: "Hi! How can I assist you?",
  goodbye: "Goodbye! Have a nice day.",
  default: "Sorry, I didn't understand that."
};

// Endpoint to handle chat messages
app.post('/chat', (req, res) => {
  const userMessage = req.body.message.toLowerCase();
  let botResponse = responses[userMessage] || responses.default;
  res.json({ message: botResponse });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

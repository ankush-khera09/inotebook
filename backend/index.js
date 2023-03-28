const express = require('express');
const app = express();

/* --------------------------------cors:
acc to cors policy, you can't access data from other origin
backend is running on other port & frontend on other place
npm install cors
cors act as a middle ware b/w request & response
req aati h toh ye check krta hai if it is valid & response bhejta h
*/
var cors = require('cors');
app.use(cors());

const connectToMongo = require('./db')
connectToMongo();

// middleware
// req.body me kuch bhejna hia toh ye chahiye
app.use(express.json());

// Available routes

app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(4000, ()=>{
    console.log("Backend server started on Port No 4000");
});
const express = require('express');
const app = express();

const connectToMongo = require('./db')
connectToMongo();

// middleware
// req.body me kuch bhejna hia toh ye chahiye
app.use(express.json());

// Available routes

app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(4000, ()=>{
    console.log("Server started on Port No 4000");
});
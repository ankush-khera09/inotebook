const mongoose = require('mongoose');

const connectToMongo = ()=>{
    mongoose.connect("mongodb://127.0.0.1:27017/notemate");
    mongoose.connection.on("connected", ()=>{
        console.log("DB Connected");              // if connected, pass this arrow fn & print "DB Connected"
    });

    mongoose.connection.on("error", ()=>{
        console.log("DB Connection Error!");              // if not connected
    });
}

module.exports = connectToMongo;
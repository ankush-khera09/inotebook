const express = require("express");
const User = require("../models/User");

const { body, validationResult } = require("express-validator");

const router = express.Router()

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

// JWT secret for signing token
const JWT_SECRET = "HemloAnkush";

const fetchUser = require("../middleware/fetchUser");

// ROUTE 1: Create a user using POST request "/api/auth/createuser"
// no login required

router.post('/createuser', [
    // express-validator
    body('name', "Enter a valid name!").isLength({min: 3}),
    body('email', "Enter a valid email!").isEmail(),
    body('password', "Password must contain at least 5 characters!").isLength({min: 5}),
] , async (req, res)=>{
    
    // If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    try{
    // check whether the user with this email already exists
    let user = await User.findOne({email: req.body.email});
    if(user){
        return res.status(400).json({error: "Sorry, this email is already associated with another user!"});
    }

    // const user  = User(req.body);
    // user.save();

    // hashing passwords
    const salt = await bcrypt.genSalt(10);    // for generating salt
    const securePass = await bcrypt.hash(req.body.password, salt);

    // create a new user
    user = await User.create({
        name: req.body.name,
        password: securePass,
        email: req.body.email,
    })
    // .then(user => res.json(user))
    // .catch(err => {console.log(err)
    // res.json({error: "Please enter a unique email id!"})});

    const data = {
        user:{
            id: user.id
        }
    }

    const authToken = jwt.sign(data, JWT_SECRET);

    res.json(authToken);

    // res.send(req.body);

    } catch(error){
        console.log(error.message);
        res.status(500).send("Internal Server Error!");
    }
})

// ROUTE 2: Authenticate a user using POST "/api/auth/login"
// no login required

router.post('/login', [
    body('email', "Please enter a valid email!").isEmail(),
    body('password', "Password can't be left blank!").exists(),
], async(req, res)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {email, password} = req.body;
    try{
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error: "Username or Password may not be correct, Please try again with correct credentials!"});
        }

        // bcrypt.compare(password string, hash)
        // bcrypt.compare(data to compare, data to be compared to (hash value))
        const passCompare = await bcrypt.compare(password, user.password);
        if(!passCompare){
            return res.status(400).json({error: "Username or Password may not be correct, Please try again with correct credentials!"});
        }

        const data = {
            user:{
                id:user.id
            }
        }
        // token me id bhej rhe hai
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({authToken});

    }catch(error){
        console.log(error.message);
        res.status(500).send("Internal Server Error!");
    }
})

// ROUTE 3: Get logged in user details using POST "/api/auth/getUser"
// Login required

router.post('/getUser', fetchUser, async(req,res)=>{
    try{
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        // "-password" means all details except password
        res.send(user);
    }catch(error){
        console.log(error.message);
        res.status(500).send("Internal Server Error!");
    }
})

module.exports = router;
const express = require("express");
const router = express.Router();

const Note = require("../models/Note");

const fetchUser = require("../middleware/fetchUser")

const { body, validationResult } = require('express-validator');

// ROUTE 1: Get all the notes of a user using GET "/api/notes"
router.get("/fetchallnotes", fetchUser, async(req, res)=>{
    try {
        const notes = await Note.find({user: req.user.id});
        res.json(notes);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error!");
    }
});

// ROUTE 2: Add a new note using POST "/api/notes/addnote"
// Login required
router.post('/addnote', fetchUser, [
    body('title', "Title must contain at least 3 characters!").isLength({min: 3}),
    body('description', "Description must contain at least 5 characters!").isLength({min: 5})
], async(req, res)=>{
    
    try {
        // if there are error, return Bad Request & the errors
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        const {title, description, tag} = req.body;

        // creating a new note
        const note = new Note({
            title,
            description,
            tag,
            user: req.user.id
        });
        const savedNote = await note.save();

        res.json(savedNote);

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error!");       
    }
});

// ROUTE 2: Update an existing note using PUT "/api/notes/updatenote"
// Login required
router.put("/updatenote/:id", fetchUser, async(req, res)=>{
    try {
        const {title, description, tag} = req.body;

        // create a newNote object
        const newNote = {};
        if(title){newNote.title = title};
        if(description){newNote.description = description};
        if(tag){newNote.tag = tag};

        // find the note to be updated and update it

        let note = await Note.findById(req.params.id)
        // if this note doesn't exist
        if(!note){
            res.status(404).send("Note Not Found");
        }

        // checking if the user who is updating note is the real user of that note
        if(note.user.toString() != req.user.id){
            return res.status(401).send("You are not allowed to update this note!");
        }

        note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true});
        res.json({note});
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error!"); 
    }
})

// ROUTE 3: Delete an existing note using DELETE "/api/notes/deletenote"
// Login Required
router.delete('/deletenote/:id', fetchUser, async(req,res)=>{
    try {
        let note = await Note.findById(req.params.id);
        if(!note){
            return res.status().send("Note Not Found");
        }

        // allow deletion only if this user owns this note
        if(note.user.toString() != req.user.id){
            return res.status(401).send("You are not allowed to delete this note!");
        }

        note = await Note.findByIdAndDelete(req.params.id);
        res.json({"Success": "Note has been deleted!", note: note});
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error!"); 
    }
})

module.exports = router;
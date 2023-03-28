import { useState } from "react";
import NoteContext from "./NoteContext";

const NoteState = (props)=>{
    
    const host = "http://localhost:4000"
    const notesInitial = [];
    
    const [notes, setNotes] = useState(notesInitial);
    // 641fd750d640e35f720604e7

    // Get all notes
    const getNotes = async()=>{

        // API call
        let url = `${host}/api/notes/fetchallnotes`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQxZjA0NDBkMWFlZjRjOWE2N2U2MThiIn0sImlhdCI6MTY3OTc2ODc3M30.KigG8qbDz01KTwmD9vH6SpLvKhkkjNNOiITGFHDCof4'
            }
        });

        const json = await response.json();
        console.log(json);
        setNotes(json);
    }

    // Add a note
    const addNote = async (title, description, tag)=>{
        
        // API call
        let url = `${host}/api/notes/addnote`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQxZjA0NDBkMWFlZjRjOWE2N2U2MThiIn0sImlhdCI6MTY3OTc2ODc3M30.KigG8qbDz01KTwmD9vH6SpLvKhkkjNNOiITGFHDCof4'
            },
            body: JSON.stringify({title, description, tag})
        })
        
        let note = {
            "_id": "641fe83e6cd397g65cfb8f846",
            "user": "641f0440d1aef4c9a67e618b",
            "title": title,
            "description": description,
            "tag": tag,
            "date": "2023-03-26T06:37:50.702Z",
            "__v": 0
          };
        setNotes(notes.concat(note));
    }

    // Edit a note 
    const editNote = async (id, title, description, tag)=>{
        
        // API call
        let url = `${host}/api/notes/updatenote/${id}`
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQxZjA0NDBkMWFlZjRjOWE2N2U2MThiIn0sImlhdCI6MTY3OTc2ODc3M30.KigG8qbDz01KTwmD9vH6SpLvKhkkjNNOiITGFHDCof4'
            },
            body: JSON.stringify({title, description, tag})
        });

        // logic to edit note
        for(let i=0; i<notes.length; i++){
            const element = notes[i];
            if(element._id === id){
                element.title = title;
                element.description = description;
                element.tag = tag;
            }
        }
    }

    // Delete a note
    const deleteNote = async (id)=>{
        
        // API Call
        let url = `${host}/api/notes/deletenote/${id}`
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQxZjA0NDBkMWFlZjRjOWE2N2U2MThiIn0sImlhdCI6MTY3OTc2ODc3M30.KigG8qbDz01KTwmD9vH6SpLvKhkkjNNOiITGFHDCof4'
            }
        });

        const json = await response.json();
        console.log(json);

        console.log("Deleting note with id " + id);
        
        const newNotes = notes.filter((note)=>{return note._id !== id})
        setNotes(newNotes);
    }

    return(
        <NoteContext.Provider value={{notes, addNote, editNote, deleteNote, getNotes}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;
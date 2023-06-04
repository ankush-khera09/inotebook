import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

const Signup = (props)=>{
    
    const [credentials, setCredentials] = useState({name: "", email:"", password:"", cpassword:""});

    const navigate = useNavigate();

    const handleSubmit = async(e)=>{
        e.preventDefault();    // so that the page may not get reload on submit
        const {name, email, password} = credentials;
        const response = await fetch("http://localhost:4000/api/auth/createuser",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name, email, password})
        });
        const json = await response.json();
        console.log(json);

        if(json.success){
            // save the token and redirect
            localStorage.setItem('token', json.authToken);
            // pushes this page into the history stack
            navigate("/");
            props.showAlert("Account Created Successfully!", "success")
        }else{
            props.showAlert("Invalid Details!", "danger");
        }
    }

    const onChange = (e)=>{
        setCredentials({...credentials, [e.target.name]: e.target.value});
    }
    
    return(
        <div className="container mt-2">
            <h2>Create an Account to use NoteMate:</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group my-2">
                    <label htmlFor="name">Name</label>
                    <input type="text" className="form-control" id="name" name="name" placeholder="Enter your full name" onChange={onChange} />
                </div>
                <div className="form-group my-2">
                    <label htmlFor="email">Email</label>
                    <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" placeholder="Enter your email" onChange={onChange} />
                </div>
                <div className="form-group my-2">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" name="password" placeholder="Enter a strong password" onChange={onChange} minLength={5} required />
                </div>
                <div className="form-group my-2">
                    <label htmlFor="cpassword">Confirm Password</label>
                    <input type="password" className="form-control" id="cpassword" name="cpassword" placeholder="Confirm your password" onChange={onChange} minLength={5} required />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Signup
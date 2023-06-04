import React, {useState} from "react";
import {useNavigate} from 'react-router-dom';
// useHistory() hook has been replaced to useNavigate()

const Login = (props) => {
    
    const [credentials, setCredentials] = useState({email:"", password:""});

    // history instance that stores all the entries user has visited
    const navigate = useNavigate();

    const handleSubmit = async(e)=>{
        e.preventDefault();    // so that the page may not get reload on submit
        const response = await fetch("http://localhost:4000/api/auth/login",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: credentials.email, password: credentials.password})
        });
        const json = await response.json();
        console.log(json);

        if(json.success){
            // save the token and redirect
            localStorage.setItem('token', json.authToken);
            props.showAlert("Logged In Successfully!", "success")
            // pushes this page into the history stack
            navigate("/");
        }else{
            props.showAlert("Invalid Credentials!", "danger");
        }
    }

    const onChange = (e)=>{
        setCredentials({...credentials, [e.target.name]: e.target.value});
    }
    
    return (
        <div className="container mt-2"> 
            <h2>Login your Account:</h2>
            <form onSubmit={handleSubmit} className="my-5">
                <div className="form-group my-3">
                    <label htmlFor="email">Email address</label>
                    <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" name="email" value={credentials.email} onChange={onChange} required />
                </div>
                <div className="form-group my-3">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" placeholder="Password" name="password" value={credentials.password} onChange={onChange} required />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Login
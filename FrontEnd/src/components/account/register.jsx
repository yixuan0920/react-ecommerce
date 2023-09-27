import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Footer from "../footer";

export default function Register(){
    
    const [email, setEmail] = React.useState("");
    const [name, setName] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [confirmPass, setConfirmPass] = React.useState("");
    const [address, setAddress] = React.useState("");
    const [gender, setGender] = React.useState("");

    const[users, setUsers] = React.useState([]);
    
    // For checking existing email
    const isExistingEmail = users.some(user => user.email === email)

    React.useEffect(() =>{
        const getUsers = async ()=>{
            const res = await fetch("http://localhost:7000/users");
            const getData = await res.json();
            setUsers(getData);
        }    
        getUsers();
    },[])

    function handleSubmit(event){
        event.preventDefault();
        if(password === confirmPass && password !== undefined){

            if(!isExistingEmail){
                
                axios.post("http://localhost:7000/register", {name, email, phone, password, address, gender})
                .then(res =>{
                    console.log(res);
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Register Successful',
                        showConfirmButton: true
                      }).then((result) =>{
                        if(result.isConfirmed){
                            window.location.assign('/login');
                        } else{
                            window.location.assign('/login');
                        }
                      })
                })
                .catch(err => console.log(err))

            } else{
                console.log("Existing account, please try another email");
            }

        } else{
            console.log("Your password didn't match with confirm password")
        }
    }
   
    return(
        <>
        <div className="login-section">
            <form
                onSubmit={handleSubmit}
                className="login-container">
                <h2 style={{height: "100px",
                            paddingTop: "inherit",
                            display: "block"}}>Register</h2>

                <h1 className="logo"
                    style={{height: "50px"}}>LOGO</h1>

                <div>
                    <input 
                        name="email"
                        className="login-input"
                        type="email" 
                        pattern=".+[a-z]+.com"
                        placeholder="example@email.com"
                        style={{width: "100%",
                                border: "none",
                                borderBottom: "1px solid grey",
                                marginTop:"20px"}}
                        onChange={(e) => setEmail(e.target.value)}
                        required/>
                </div>

                <div>
                    <input 
                        name="name"
                        className="login-input"
                        type="text" 
                        placeholder="Full Name"
                        style={{width: "100%",
                                border: "none",
                                borderBottom: "1px solid grey"}}
                        onChange={(e) => setName(e.target.value)}
                        required/>
                </div>

                <div>
                    <input 
                        name="phone"
                        className="login-input"
                        type="tel" 
                        placeholder="012-12345678"
                        style={{width: "100%",
                                border: "none",
                                borderBottom: "1px solid grey"}}
                        onChange={(e) => setPhone(e.target.value)}
                        pattern="[0-9]{3}-[0-9]{7,8}"
                        required/>
                </div>

                <div>
                    <input 
                        name="password"
                        className="login-input"
                        type="password" 
                        placeholder="Password"
                        style={{width: "100%",
                                border: "none",
                                borderBottom: "1px solid grey"}}
                        onChange={(e) => setPassword(e.target.value)}
                        required/>
                </div>

                <div>
                    <input 
                        name="confirmPassword"
                        className="login-input"
                        type="password" 
                        placeholder="Confirm Password"
                        style={{width: "100%",
                                border: "none",
                                borderBottom: "1px solid grey"}}
                        onChange={(e) => setConfirmPass(e.target.value)}
                        required/>
                </div>

                <div>
                    <input 
                        name="address"
                        className="login-input"
                        type="text" 
                        placeholder="Address"
                        style={{width: "100%",
                                border: "none",
                                borderBottom: "1px solid grey"}}
                        onChange={(e) => setAddress(e.target.value)}
                        required/>
                </div>

                <div>
                    <label htmlFor="gender">Gender : </label>
                    <select name="gender" id="gender" onChange={(e) => setGender(e.target.value)}>
                        <option value="no-selected">--- Please Select ---</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>

                <button type="submit" className="button-login">Sign Up</button>
                
                <div style={{marginTop:"50px"}}>
                    <p>Have an account?
                                                <span>
                                                    <Link to="/login">Log In </Link>
                                                </span> now
                    </p>
                </div>
                
            </form>
        </div>
        <Footer/>
        </>
        
    )
}
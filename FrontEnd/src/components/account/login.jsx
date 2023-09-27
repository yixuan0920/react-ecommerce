import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import Account from "./account";
import Footer from "../footer";

export default function Login(){

    const [userValues, setUserValues] = React.useState({
        email:"",
        password:""
    })

    const [users, setUsers] = React.useState([]);
    const [auth, setAuth] = useState(false);
    const foundUser = users.find(user => user.email === userValues.email);
    const navigate = useNavigate();    

    axios.defaults.withCredentials = true;

    React.useEffect(() =>{
        axios.get("http://localhost:7000/users")
        .then(res =>{
            const getData = res.data;
            setUsers(getData)
        })
    },[])
    
    useEffect(() =>{
        axios.get("http://localhost:7000/")
        .then(res =>{
            if(res.data.Status === "Success"){
                setAuth(true);
            } else{
                setAuth(false);
            }
        })
    },[])

    const handleSubmit = (event) =>{
        event.preventDefault();
        axios.post('http://localhost:7000/login', userValues)
        .then(res =>{
            if(foundUser){
                console.log(res.data.Status)
                if(res.data.Status === "Success"){

                    let timerInterval

                    Swal.fire({
                    title: 'Loading ...',
                    html:"Checking existing users",
                    timer: 2500,
                    timerProgressBar: true,
                    allowOutsideClick: false,
                    showCloseButton: false,  
                        didOpen: () => {
                            Swal.showLoading()
                        },
                        willClose: () => {
                            clearInterval(timerInterval)
                        }
                    }).then((result) => {
                        if (result.dismiss === Swal.DismissReason.timer) {
                            navigate("/");
                            location.reload(true);
                        } else{
                            console.log('something went wrong')
                        }
                    })
                } else{
                    console.log("Cant Login")
                }
            } else{
                let timerInterval

                Swal.fire({
                title: 'Loading ...',
                html:"Checking existing users",
                timer: 2500,
                timerProgressBar: true,
                allowOutsideClick: false,
                showCloseButton: false,  
                    didOpen: () => {
                        Swal.showLoading()
                    },
                    willClose: () => {
                        clearInterval(timerInterval)
                    }
                }).then((result) => {
                    if (result.dismiss === Swal.DismissReason.timer) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'User is not existed! Please try again',
                        })
                    }
                })
            }
        }).catch(err => console.log(err))
    }
    
    return(

        <>
        {
            !auth ?
        <>
        <div className="login-section">
            <form className="login-container" onSubmit={handleSubmit}>
                <h2 style={{height: "100px",
                            paddingTop: "inherit",
                            display: "block"}}>Login</h2>

                <h1 className="logo"
                    style={{height: "50px"}}>LOGO</h1>

                <div>
                    <input 
                        id="email"
                        name="email"
                        onChange={(event) => setUserValues({...userValues, email: event.target.value})}
                        className="login-input"
                        type="email" 
                        pattern=".+[a-z]+.com"
                        placeholder="example@email.com"
                        style={{width: "100%",
                                border: "none",
                                borderBottom: "1px solid grey",
                                marginTop:"20px"}}
                        required/>
                </div>

                <div>
                    <input 
                        id="password"
                        name="password"
                        onChange={(event) => setUserValues({...userValues, password: event.target.value})}
                        className="login-input"
                        type="password" 
                        placeholder="Password"
                        style={{width: "100%",
                                border: "none",
                                borderBottom: "1px solid grey"}}
                        required/>
                </div>

                <button className="button-login">Login</button>
                
                <div style={{marginTop:"50px"}}>
                    <p>Dont't have an account? 
                                                <span>
                                                    <Link to="/register">Sign Up</Link>
                                                </span>
                    </p>
                </div>
                
            </form>
            
        </div>
        <Footer/>
        </>
        :
        <Account/>
    }
    </>
    )
}
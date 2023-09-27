import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"
import axios from "axios";
import Swal from "sweetalert2";

export default function Edit(){

    const navigate = useNavigate();

    const [auth, setAuth] = useState(false);
    const {id} = useParams();
    const [confirmPassword, setConfirmPass] = useState("")
    const [user, setUser] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        address: "",
        gender: ""
    })

    axios.defaults.withCredentials = true;

    useEffect(() =>{
        axios.get("http://localhost:7000/")
            .then(res =>{
                if(res.data.Status === "Success"){
                    setAuth(true);
                    setUser({
                        name : res.data.name,
                        email : res.data.email,
                        phone : res.data.phone,
                        address : res.data.address,
                        gender : res.data.gender
                    })
                } else{
                    setAuth(false);
                    setUser({
                        ...user
                    })
                }
            }).catch(err => console.log(err))
        },[id])

    const handleChange = (event) =>{
        const { name, value } = event.target
            setUser((prevUser) =>{
                return {
                    ...prevUser,
                    [name] : value 
                }
            })
    }

    const handleEdit = (event) =>{
        event.preventDefault();
        if(user.password === confirmPassword){

            axios.put("http://localhost:7000/edit/"+id, {
                name : user.name,
                email : user.email,
                phone : user.phone,
                password : user.password,
                address : user.address,
                gender : user.gender
            })
            .then(res => {
            console.log(res);
            navigate("/account");

            }).catch(err => console.log(err))
        } else{
            Swal.fire({
                position: 'center',
                icon: 'info',
                title: 'Correct your passowrd',
                text: `Your password is not match.`,
                showConfirmButton: false,
                timer: 3000
            })
            // console.log("Your password is not matching.")
        }
    }

    const handleCancel = () =>{
        navigate('/account');
    }
    console.log(auth)
    return(
        <>
    {
        auth ?
        
        <div className="container padding">
            <section>
                <Link className="disable-cart">Edit Profile</Link>
            </section>


            <form
                onSubmit={handleEdit}
                className="login-container"
                style={{ margin:"50px auto"}}>
                <h2 style={{height: "100px",
                            paddingTop: "inherit",
                            display: "block"}}>Edit</h2>

                <div>
                    <input 
                        name="email"
                        value={user.email}
                        className="login-input"
                        type="email" 
                        pattern=".+[a-z]+.com"
                        placeholder="example@email.com"
                        style={{width: "100%",
                                border: "none",
                                borderBottom: "1px solid grey",
                                marginTop:"20px"}}
                        onChange={handleChange}
                        required/>
                </div>

                <div>
                    <input 
                        name="name"
                        value={user.name}
                        className="login-input"
                        type="text" 
                        placeholder="Full Name"
                        style={{width: "100%",
                                border: "none",
                                borderBottom: "1px solid grey"}}
                        onChange={handleChange}
                        required/>
                </div>

                <div>
                    <input 
                        name="phone"
                        value={user.phone}
                        className="login-input"
                        type="tel" 
                        placeholder="012-1234567"
                        style={{width: "100%",
                                border: "none",
                                borderBottom: "1px solid grey"}}
                        onChange={handleChange}
                        pattern="[0-9]{3}-[0-9]{7}"
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
                        onChange={handleChange}
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
                        value={user.address}
                        className="login-input"
                        type="text" 
                        placeholder="Address"
                        style={{width: "100%",
                                border: "none",
                                borderBottom: "1px solid grey"}}
                        onChange={handleChange}
                        required/>
                </div>

                <div>
                    <label htmlFor="gender">Gender : </label>
                    <select 
                        name="gender" 
                    value={user.gender} 
                        id="gender" onChange={handleChange}>

                        <option value="no-selected">--- Please Select ---</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>

                    </select>
                </div>

                <section className="profile-button" style={{margin:"20px auto"}}>
                    <button
                        className="button-learn" 
                        style={{marginRight:"10px"}}> Save </button>
                </section>
            </form>
            <button onClick={handleCancel} className="button-delete" style={{display:"block",margin:"0 auto"}}> Cancel </button>

        </div>
        :
        <div style={{textAlign:"center",margin:"276px 0"}}>
            <h1>You are not logged in yet. Please press<Link to="/login"> Login Here</Link></h1>
        </div>
    }
        </>
    )
}
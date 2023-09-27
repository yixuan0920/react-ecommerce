import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"
import axios from "axios";
import Swal from "sweetalert2";

export default function Account(){

    const navigate = useNavigate();

    
    const [auth, setAuth] = useState(false);
    const [fetchData, setFetchData] = useState(true);
    const [user, setUser] = useState({
        id: "",
        name: "",
        email: "",
        phone: "",
        address: "",
        gender: ""
    });

    axios.defaults.withCredentials = true;

    useEffect(() =>{
        if(fetchData){
            axios.get("http://localhost:7000/")
            .then(res =>{
                if(res.data.Status === "Success"){
                    setAuth(true);
                    setUser({
                        id: res.data.id,
                        name: res.data.name,
                        email: res.data.email,
                        phone: res.data.phone,
                        address: res.data.address,
                        gender: res.data.gender
                    })
                }
                return setFetchData(false);
            }).catch(err => console.log(err))
        }
    },[fetchData])

    const handleLogout = () =>{
        axios.get("http://localhost:7000/logout")
        .then(res =>{
            if(res.data.Status === "Success"){
                navigate("/login");
                location.reload(true);
            } else{
                alert("Error");
            }
        }).catch(err => console.log(err));
    }



    return(
        <>
    {
        auth ?
        
        <div className="container padding" style={{height: "594px"}}>
            <section>
                <Link className="disable-cart">My Profile</Link>
            </section>

            <table className="profile-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Gender</th>
                    </tr>   
                </thead>

                <tbody>
                    <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>{user.address}</td>
                        <td>{user.gender}</td>
                    </tr>
                </tbody>
            </table>

            <section className="profile-button">
                <Link
                    to={`/edit/${user.id}`} 
                    className="button-learn" 
                    style={{marginRight:"10px"}}> Edit Profile</Link>
                <button onClick={handleLogout}  className="button-delete"> Log Out </button>
            </section>

        </div>
        :
        <div style={{textAlign:"center",margin:"276px 0"}}>
            <h1>You are not logged in yet. Please press<Link to="/login"> Login Here</Link></h1>
        </div>
    }
        </>
    )
}
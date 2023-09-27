import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Footer from "./footer";
import Swal from "sweetalert2";

export default function FAQ(){

    const [auth, setAuth] = useState(false)
    const [isOpen, setIsOpen] = useState(null);

    const data = [
        {
            question: "Question 1",
            answer: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam aperiam voluptatum doloribus totam, voluptate unde nulla dolores modi ratione voluptas culpa veritatis delectus sit, impedit fugiat cumque assumenda vero velit?"
        },
        {
            question: "Question 2",
            answer: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam aperiam voluptatum doloribus totam, voluptate unde nulla dolores modi ratione voluptas culpa veritatis delectus sit, impedit fugiat cumque assumenda vero velit?"
        },
        {
            question: "Question 3",
            answer: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam aperiam voluptatum doloribus totam, voluptate unde nulla dolores modi ratione voluptas culpa veritatis delectus sit, impedit fugiat cumque assumenda vero velit?"
        },
        {
            question: "Question 4",
            answer: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam aperiam voluptatum doloribus totam, voluptate unde nulla dolores modi ratione voluptas culpa veritatis delectus sit, impedit fugiat cumque assumenda vero velit?"
        },
    ]
    axios.defaults.withCredentials = true;
    
    useEffect(() =>{
        axios.get("http://localhost:7000")
        .then(res =>{
            if(res.data.Status === "Success"){
                setAuth(true);
            } else{
                setAuth(false);
            }
        }).catch(err => console.log(err))
    },[])

    const toggleCollapsible = (index) =>{
        if(isOpen === index){
            setIsOpen(null)
        } else{
            setIsOpen(index)
        }
    }

    const messageSent = (event) =>{
        event.preventDefault();

        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Your message has been sent!',
            showConfirmButton: false,
            timer: 2000
          }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer) {
                location.reload(true);
            } else{
                console.log('something went wrong')
            }
          })
    }

    return(
        <>
 {
            auth ?
        <div className="container padding">
       
            <section>
                <Link className="disable-cart">FAQ</Link>
            </section>

            <section className="wrapper">
                <div className="accordion">
                    <h1 style={{textAlign:"center"}}>Any Question here?</h1>
                    {
                        data.map((item, index)  =>{
                            return(
                                <div key={index} className="item">
                                    <div onClick={() => toggleCollapsible(index)} className="title">
                                        <h2>{item.question}</h2>
                                        <span>{isOpen === index ? "-":"+"}</span>
                                    </div>
                                    <div className={isOpen === index ? "show" : "content"}>
                                        {item.answer}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </section>
            
            <section className="contact-style" style={{display:"flex",justifyContent:"space-around",width:"100%"}}>                
                <div>
                    <h3>Company Email </h3>
                    <p> Example@gmial.com</p>
                </div>

                <div>
                    <h3>Comapany Phone</h3>
                    <p>012-3456789</p>
                </div>

                <div>
                    <h3>Company Address</h3>
                    <p> Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempore, dolor.</p>
                </div>
            </section>

            <form className="form-style" onSubmit={messageSent}>
            <p style={{textAlign:"center",width:"100%",paddingBottom:"20px",color:"grey",fontSize:"20px"}}>Leave your comment to us, Thank you!</p>


                <div style={{width:"40%"}}>
                    <label>First Name</label>
                    <input 
                        type="text"
                        id="firstName"
                        name="firstName"
                        placeholder="Enter here..."
                        required
                        />
                </div>


                <div style={{width:"40%"}}>
                    <label htmlFor="lastName">Last Name</label>
                    <input 
                        type="text"
                        id="lastName"
                        name="lastName"
                        placeholder="Enter here..."
                        required
                        />
                </div>

                <div style={{width:"40%"}}>
                    <label htmlFor="emial">Email</label>
                    <input 
                        className="input-style"
                        type="email"
                        id="emial"
                        name="emial"
                        placeholder="Enter here..."
                        pattern=".+@+[a-z]+.com"
                        size="30" 
                        required
                        />
                </div>

                <div style={{width:"40%"}}>
                    <label htmlFor="phone">Phone</label>
                    <input 
                        className="input-style"
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="012-1234567"
                        pattern="[0-9]{3}-[0-9]{7}"
                        required
                        />
                </div>

                <div style={{width:"70%"}}>
                    <label>Comment</label>
                    <textarea
                    style={{width:"100%",height:"100px"}}
                    required
                    placeholder="Leave your comment here..."/>
                </div>
               
               <button style={{width:"35%"}} className="button-learn"> Submit </button>

            </form>
        </div>

        :
        <div style={{textAlign:"center",margin:"276px 0"}}>
            <h1>You are not logged in yet. Please press<Link to="/login"> Login Here</Link></h1>
        </div>
    }
    <Footer/>
    </>
    )
}
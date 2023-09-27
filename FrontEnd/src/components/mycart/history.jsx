import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function History(){

    const [auth, setAuth] = useState(false);
    const [cartHistory, setCartHistory] = useState([]);
    const [dataProducts, setDataProducts] = useState([]);
    const [isDisabled, setIsDisabled] = useState(false);
    const [user, setUser] = useState({ userId : "" });

    axios.defaults.withCredentials = true;

    //Get User Token.
    useEffect(() =>{
        axios.get("http://localhost:7000")
        .then(res =>{
            if(res.data.Status === "Success"){
                setAuth(true);
                setUser({ userId : res.data.id });
            } else{
                setAuth(false);
            }
        }).catch(err => console.log(err))
    },[])

    //Get Products.
    useEffect(() =>{
        axios.get("http://localhost:7000/products")
        .then(res =>{
            setDataProducts(res.data);
        }).catch(err => console.log(err));
    },[])


    //Get user cart history.
    useEffect(() =>{
        axios.get(`http://localhost:7000/cart-history`)
        .then(res =>{
            const data = res.data.data;
            const historyItems = data.map(item =>({
                cart_id : item.cart_history_id,
                user_id : item.user_id,
                product_id : item.product_id,
                product_name : item.product_name,
                product_image : item.product_image,
                product_price : item.product_price,
                product_quantity : item.product_quantity,
                bought_date_time : item.created_at
            }))

            const currentUserId = user.userId;
            const updateHistory = [];
            
            for(let i = 0; i < historyItems.length; i++){
                const existedHistory = historyItems[i];

                const dateTimeData = existedHistory.bought_date_time;
                const dateTime = new Date(dateTimeData);

                const datePart = dateTime.toLocaleDateString("en-MY");
                const timePart = dateTime.toLocaleTimeString("en-MY", { hour12 : true });
                const formattedDateTime = `${datePart} ${timePart}`;

                if(existedHistory.user_id === currentUserId){
                    updateHistory.push({
                        cart_id : existedHistory.cart_id,
                        user_id : existedHistory.user_id,
                        product_id : existedHistory.product_id,
                        product_name : existedHistory.product_name,
                        product_image : existedHistory.product_image,
                        product_price : existedHistory.product_price,
                        product_quantity : existedHistory.product_quantity,
                        bought_date_time : formattedDateTime
                    })
                }
            }
            setCartHistory(updateHistory);
        }).catch(error => console.log("History get error :", error))
    },[user])


    //Delete specific history 
    const cartDeleteHistory = (cartId) =>{
        for(let i = 0; i < cartHistory.length; i++){
            const existedCartHistory = cartHistory[i];
            const currentCartId = parseInt(cartId);
            const existedCartId = parseInt(existedCartHistory.cart_id);

            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
              })
            .then((result) => {
                if (result.isConfirmed) {
                  Swal.fire(
                    'Deleted!',
                    'Your history has been deleted.',
                    'success'
                  )
                    // if(existedCartId === ){
                        axios.delete(`http://localhost:7000/delete-cart-history/${currentCartId}`)
                        .then(res =>{
                            console.log(res)
                            setTimeout(function() {
                                location.reload(true);
                            }, 2000);
                        })
                        .catch(err => console.log("Error ocurred while making Delete request:", err));
                    // } else{
                    //     console.log("Cart Id is not matched.")
                    // }
                } else{
                    console.log("Cancel Delete Item.")
                }
                
            })
            .catch(err => console.log("Could not be delete message:", err ))
        }
    }

    //Delete all of the history data.
    const clearAllHistory = (cUserId) =>{
        const currentUserId = parseInt(cUserId);
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
          })
        .then((result) => {
            if (result.isConfirmed) {
              Swal.fire(
                'Cleaned!',
                'Your history has been cleaned.',
                'success'
              )
                axios.delete(`http://localhost:7000/clear-all-history/${currentUserId}`)
                .then(res =>{
                    console.log(res)
                    setTimeout(function() {
                        location.reload(true);
                    }, 2000);
                })
                .catch(err => console.log("request DELETE get error :", err))
            } else{
                console.log("Cancel clear all items.")
            }
        })
        .catch(err => console.log("request error :", err))
    }

    return(
        <>
    {
        auth ?
        (
        <div className="container padding">
                <section>
                    <Link className="cart" to="/cart">My Cart</Link>
                    <Link className="disable-cart">History</Link>
                </section>

                {
                    cartHistory.length === 0?(
                        <section className="cart-empty">
                        <h3 style={{padding:"10px 0"}}> History Is Empty </h3>
                        <hr/>
                        <p style={{padding:" 20px 0"}}> You have not bought any product yet...</p>
                        </section> 
                    ) : (

                <table style={{width:"100%",padding:"0"}}>
                    <thead>
                        <tr>
                            <th style={{textAlign:"center"}}>Image</th>
                            <th style={{textAlign:"center"}}>Product</th>
                            <th style={{textAlign:"center"}}>Price</th>
                            <th style={{textAlign:"center"}}>Quantity</th>
                            <th style={{textAlign:"center"}}>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            cartHistory.map(item =>{
                                return(
                                    <tr key={item.cart_id} className="table-border-bottom">
                                        <td style={{width:"10%"}}>
                                            <img src={`../../../../${item.product_image}`} alt="maggie" style={{width:"100%"}}/>
                                        </td>
        
                                        <td className="capital-text" style={{textAlign:"center"}}> {item.product_name} </td>
        
                                        <td style={{textAlign:"center"}}> {`RM ${item.product_price}`}</td>
        
                                        <td style={{textAlign:"center"}}> {item.product_quantity} </td>
        
                                        <td style={{textAlign:"center",width:"35%"}}>

                                            <div style={{display:"flex", justifyContent:"center"}}>
                                            
                                                {dataProducts.some(product => product.product_id === item.product_id) ? 
                                                (
                                                    <Link className="button-checkout" to={`/single-item/${item.product_id}`} style={{ margin: "auto 0" }}>Find Item</Link>
                                                ) 
                                                    : 
                                                ( 
                                                    <Link className="disable-cart" style={{minWidth:"0",alignItems:"center",padding:"0",margin:"auto 5px"}} disabled={isDisabled}>Disabled</Link>
                                                )}
                                                <button id={item.cart_id} className="button-delete" onClick={(event) => cartDeleteHistory(event.target.id)} style={{margin:"10px 20px"}}>Delete</button>
                                            </div>
                            
                                            <span> {item.bought_date_time} </span>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>

                    <tfoot>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td style={{textAlign:"center",padding:"20px 30px 200px 30px"}}>
                                <div className="button-column">
                                    <button id={user.userId} className="button-delete" style={{ margin:"10px 20px" }} onClick={(event) => clearAllHistory(event.target.id)}>Clear All</button>
                                </div>
                            </td>
                        </tr>
                    </tfoot>

                </table>
                    )
                }
        </div>
        ) : (
        <div style={{textAlign:"center",margin:"276px 0"}}>
            <h1>You are not logged in yet. Please press<Link to="/login"> Login Here</Link></h1>
        </div>
        )
    }
    </>
    )
}
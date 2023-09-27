import React, { useEffect, useState } from "react";
import "../index.css";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Nav(){

    const [auth, setAuth] = useState(false);
    const [existedCart, setExistedCart] = useState({ product_quantity : 0 });
    const [user, setUser] = useState({ userId : "", isAdmin : ""});

    // const detecedUserId = filter()

    axios.defaults.withCredentials = true;

    //Get user Id
    useEffect(() =>{
        axios.get("http://localhost:7000")
        .then(res =>{
            if(res.data.Status === "Success"){
                setAuth(true);
                setUser({ userId : res.data.id, isAdmin : res.data.isAdmin })
            } else{
                setAuth(false);
            }
        }).catch(err => console.log(err));
    },[])
    
    //Get Cart and update nav cart amount when increase data.
    useEffect(() =>{
        axios.get("http://localhost:7000/cart")
        .then(res =>{
            const data = res.data.data;
            const cartItem = data.map(item =>({
                userId : item.user_id,
                productId : item.product_id,
                productQuantity : item.product_quantity
            }))
        
            const currentUserId = user.userId      
            for(let i = 0; i < cartItem.length; i++){
                if(cartItem[i].userId === currentUserId){
                    setExistedCart((prevQuantity) =>{
                        return{
                            ...prevQuantity,
                            product_quantity : prevQuantity.product_quantity + cartItem[i].productQuantity
                        }
                    })
                }
            }
            
        })
    },[user])

    return(
        
        <div>
        {auth ? (
            <nav>
                {
                    user.isAdmin === 0?(
                // user site
                <>
                <Link to="/categories">Categories</Link>
                <Link to="/cart">Cart <span className="cart-count">
                    {

                        existedCart.product_quantity < 1000 ? 
                            (<>{existedCart.product_quantity}</>) 
                        : 
                            (<>999+</>)

                    }
                    </span>
                </Link>
                <Link to="/" className="logo">Logo</Link>
                <Link to="/faq">FAQ</Link>
                </>

                ) : (

                // admin site
                <>
                <Link to="/post-item">Post Product</Link>
                <Link to="/" className="logo">Logo</Link>
                </>
                    )
                }
                <Link to="/Account">Account</Link>
            </nav>
        ) : (
            <nav>
                <Link to="/" className="logo">Logo</Link>
                <Link to="/login" style={{marginLeft:"auto"}}>Login</Link>
                <Link to="/register" style={{marginLeft:"20px"}}>Register</Link>
            </nav>
        )}
        </div>
        
    )
}
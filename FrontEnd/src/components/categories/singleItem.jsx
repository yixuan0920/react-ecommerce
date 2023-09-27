import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function SingleItem(){

    const {id} = useParams();
    const [auth, setAuth] = useState(false);
    const [productId, setProductId] = useState({ product_id : parseInt(id) });
    const [userId, setUserId] = useState({ user_id : "" });
    const [checkExistingCart, setCheckExistingCart] = useState(false);
    const [existedCart, setExistedCart] = useState({ user_id : "", product_id : "", cart_quantity : "" })
    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        image: "",
        quantity: ""
    });

    axios.defaults.withCredentials = true;

    //Get user
    useEffect(() =>{
        axios.get("http://localhost:7000/")
        .then(res =>{
            setUserId({
                user_id : res.data.id
            })
            if(res.data.Status === "Success"){
                setAuth(true);
            } else{
                setAuth(false);
            }
        }).catch(err => console.log("Request GET user error: ",err))
    },[])

    //Get individual product
    useEffect(() =>{
            axios.get("http://localhost:7000/single-item/"+id)
            .then(res =>{
                const { product_name,
                        product_description,
                        product_price,
                        product_image } = res.data

               setProduct({
                    name: product_name,
                    description: product_description,
                    price: product_price,
                    image: product_image
                }); 

            }).catch(err => console.log(err));
    },[id])

    //Get cartId
    useEffect(() =>{
        axios.get("http://localhost:7000/cart")
        .then(res =>{
            const data = res.data.data;
            const cartItem = data.map(item =>({
                userId : item.user_id,
                productId : item.product_id,
                productQuantity : item.product_quantity
            }))
            
            //Check each cart got the same product or not.
            if (cartItem.length > 0) {
                for (let i = 0; i < cartItem.length; i++) {
                    const existingCart = cartItem[i];
                    if (existingCart.productId === productId.product_id && existingCart.userId === userId.user_id){
                        setCheckExistingCart(true);
                        setExistedCart({ user_id : cartItem[i].userId, product_id : cartItem[i].productId, cart_quantity : cartItem[i].productQuantity });
                        break;
                    } else{
                        setCheckExistingCart(false);
                    }
                }
            }
        })
        .catch(err => console.log(err));
    },[productId,userId])


    //Add to cart
    const handleAddToCart = () =>{
        if(product.quantity != null && product.quantity != "" && product.quantity != undefined && product.quantity != 0){

        axios.post("http://localhost:7000/add-to-cart",{
                user_id : userId.user_id,
                product_id : productId.product_id,
                product_name : product.name,
                product_description : product.description,
                product_image : product.image,
                product_price : product.price,
                product_quantity : product.quantity
            })
            .then(res =>{
                console.log(res.data.message);
                
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Item Added Success',
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    timer: 1000,
                    
                  })
                    .then((result) => {
                        if (result.dismiss === Swal.DismissReason.timer) {
                            location.reload(true);
                        } else{
                            console.log('something went wrong')
                        }
                    })
            })
            .catch(err => console.log(err));
        } else{
            Swal.fire({
                position: 'center',
                icon: 'info',
                title: 'Please select item amount',
                showConfirmButton: false,
                timer: 1000
              })
        }
    }

    //Update quantity when product existing in cart.
    const handleCartUpdate = () =>{
        if(product.quantity != null && product.quantity != "" && product.quantity != undefined && product.quantity > 0){
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1; 
            const day = currentDate.getDate();
            const hours = currentDate.getHours();
            const minutes = currentDate.getMinutes();
            const seconds = currentDate.getSeconds();
            
            //Setting date time.
            const dateString = `${String(year)}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

            //Update current quantity to cart.
            function updateTotalQuantity(productQuantity, cartProductQuantity){ return productQuantity + cartProductQuantity; };
            const totalQuantity = updateTotalQuantity(parseInt(product.quantity), parseInt(existedCart.cart_quantity));

            const currentUserId = parseInt(userId.user_id);
            const cartUserId = parseInt(existedCart.user_id);
            const currentProductId = parseInt(productId.product_id);
            const cartProductId = parseInt(existedCart.product_id);

            if(currentUserId === cartUserId &&  currentProductId === cartProductId){
                axios.put(`http://localhost:7000/cart-update/${currentProductId}/${currentUserId}`,{
                    product_quantity : totalQuantity,
                    updated_at : dateString,
                    product_id : currentProductId,
                    user_id : currentUserId
                    })
                    .then(res =>{
                        console.log(res.data.Status);
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Item Added Success',
                            showConfirmButton: false,
                            allowOutsideClick: false,
                            timer: 1000
                        })
                        .then((result) => {
                            if (result.dismiss === Swal.DismissReason.timer) {
                                location.reload(true);
                            } else{
                                console.log('something went wrong')
                            }
                        })
                        .catch(err => console.log(err));
                    })
                    .catch(err => {
                        console.error("Error occurred while making the PUT request:", err);
                    });
            } else{
                console.log("Product is not match, please try again.")
            }
        } else{
            Swal.fire({
                position: 'center',
                icon: 'info',
                title: 'Please select item amount',
                showConfirmButton: false,
                timer: 1000
                })
        }
    }


    return(
        <>
        {
            auth ?
        <div className="container padding">
            <section>
                <Link className="disable-cart">Single Item</Link>
            </section>
        
            <section key={id} className="single-item-container">
                <img src={`/${product.image}`} alt="maggie"/>
         
                        <div className="flex-column">
                            <div className="display-flex">
                                <h3 className="capital-text">{product.name}</h3>
                                <p className="display-none">{`RM ${product.price}`}</p>
                            </div>

                            <div className="single-margin">
                                <h3>Desciption</h3>
                                <p>{product.description}</p>
                            </div>
                            
                            <div>
                                <p className="display-block">{`RM ${product.price}`}</p>
                            </div>
                        </div>
            </section>

            <section className="single-margin" style={{display:"flex",justifyContent:"center"}}>
                {
                    checkExistingCart ?
                    (
                        <button onClick={handleCartUpdate} className="button-checkout" style={{margin:"0"}}>Add To Cart</button>
                    )
                    :
                    (
                        <button onClick={handleAddToCart} className="button-checkout" style={{margin:"0"}}>Add To Cart</button>
                    )
                }

                <div style={{display:"flex",flexDirection:"column",width:"10%",justifyContent:"center",textAlign:"center"}}>
                    <label htmlFor="quantity">Quantity</label>
                    <input 
                        name="quantity"
                        style={{margin:"0 10px 0 10px"}} 
                        type="number" 
                        min="1" 
                        max="99"
                        onChange={(event) => setProduct(prevProduct =>({
                            ...prevProduct,
                            quantity: event.target.value}))}/>
                </div>

            </section>
        </div>
        :
        (<div style={{textAlign:"center",margin:"276px 0"}}>
            <h1>You are not logged in yet. Please press<Link to="/login"> Login Here</Link></h1>
        </div>)
    }
    </>
    )
}
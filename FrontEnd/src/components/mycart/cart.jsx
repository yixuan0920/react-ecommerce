import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function Cart(){
    const [auth, setAuth] = useState(false);
    const [userId, setUserId] = useState({ user_id : "" });
    const currentUser = parseInt(userId.user_id);
    const [cartItem, setCartItem] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [currentProduct, setCurrentProduct] = useState({ currentProductId : 0, quantity : 0 });
    const [currentUserCart, setCurrentUserCart] = useState([])
    const [categoryProducts, setCategoryProducts] = useState([])

    axios.defaults.withCredentials = true;

    //To set if it is empty then show the empty page.
    useEffect(() => {
        const updated = [];
        for (let i = 0; i < cartItem.length; i++) {

          const currentItem = cartItem[i];
          const cartUserId = parseInt(currentItem.user_id);

          if (cartUserId === currentUser) {

            updated.push({
              user_id: currentItem.user_id,
              product_id: currentItem.product_id,
              product_name: currentItem.product_name,
              product_description: currentItem.product_description,
              product_image: currentItem.product_image,
              product_price: currentItem.product_price,
              product_quantity: currentItem.product_quantity
            });

          } else{
            console.log("User Id is not matched.")
          }
        }
        setCurrentUserCart(updated);
      }, [cartItem, currentUser]);


    //Get User Token.
    useEffect(() =>{
        axios.get("http://localhost:7000")
        .then(res =>{
            if(res.data.Status === "Success"){
                setAuth(true);
                setUserId({ user_id : res.data.id})
            } else{
                setAuth(false);
            }
        }).catch(err => console.log(err))
    },[])


    //Get product boughtAmount.
    useEffect(() =>{
        axios.get("http://localhost:7000/products")
        .then(res =>{
            const data = res.data;
            const existedProducts = data.map(item =>({
                productId : item.product_id,
                boughtAmount : item.bought_amount
            }))
            const updateProduct = [];

            for(let i = 0; i < existedProducts.length; i++){
                const currentProducts = existedProducts[i];

                updateProduct.push({
                    product_id : currentProducts.productId,
                    bought_amount : currentProducts.boughtAmount
                })
            }
            setCategoryProducts(updateProduct)
        }).catch(err => console.log("request error get data :",err))
    },[cartItem])


    //Get the cart about user themselves.
    useEffect(() =>{
        axios.get("http://localhost:7000/my-cart")
        .then(res =>{
            const data = res.data.data;
            const existedItem = data.map(item =>({
                userId : item.user_id,
                productId : item.product_id,
                productName : item.product_name,
                productDescription : item.product_description,
                productImage : item.product_image,
                productPrice : item.product_price,
                productQuantity : item.product_quantity
            }))
            
            for(let i = 0; i < existedItem.length; i++){
                const cartDatas = existedItem[i];
                const currentUserId = userId.user_id;
                if(currentUserId === cartDatas.userId){
                    setCartItem((prevCart) =>{
                        const updatedCart = [
                            ...prevCart,
                            {
                                user_id : cartDatas.userId,
                                product_id : cartDatas.productId,
                                product_name : cartDatas.productName,
                                product_description : cartDatas.productDescription,
                                product_image : cartDatas.productImage,
                                product_price : cartDatas.productPrice,
                                product_quantity : cartDatas.productQuantity
                            }
                        ];
                        return updatedCart
                    })
                };
            };
        }).catch(err => console.log(err))
    },[userId])

    //Calculate the total price.
    useEffect(() =>{
        let total = 0;

        for(let i = 0; i < cartItem.length; i++){
            const item = cartItem[i];
    
            if(cartItem !== undefined){
                if(item.product_id === item.product_id){
                    total += item.product_quantity * item.product_price
                    setTotalPrice(total);
                }
            }
        }
    },[cartItem,userId])    


    function handleCartUpdate(){
        if(currentProduct.quantity != null && currentProduct.quantity != "" && currentProduct.quantity != undefined){
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1; 
            const day = currentDate.getDate();
            const hours = currentDate.getHours();
            const minutes = currentDate.getMinutes();
            const seconds = currentDate.getSeconds();

            const dateString = `${String(year)}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            
            //Detect specific ID
            const updatedProductQuantity = parseInt(currentProduct.quantity);
            const currentPageProductId = parseInt(currentProduct.currentProductId);
            const currentUserId = parseInt(userId.user_id);

            for(let i = 0; i < cartItem.length; i++){
                const currentCart = cartItem[i];
                const existedProductId = parseInt(currentCart.product_id);
                const existedProductQuantity = parseInt(cartItem[i].product_quantity);

                if(existedProductId === currentPageProductId){
                    //Update current quantity to cart.

                    // function updateTotalQuantity(productQuantity, cartProductQuantity){ 
                    //     return productQuantity + cartProductQuantity; 
                    // };
                    // const totalQuantity = updateTotalQuantity(updatedProductQuantity, parseInt(currentCart.product_quantity));

                    if(updatedProductQuantity !== undefined && updatedProductQuantity != ""){
                        if(updatedProductQuantity > 0){
                            axios.put(`http://localhost:7000/cart-update/${existedProductId}/${currentUserId}`,{
                                product_quantity : updatedProductQuantity,
                                updated_at : dateString,
                                product_id : existedProductId,
                                user_id : currentUserId
                            })
                            .then(res =>{
                                console.log(res.data.Status);
                                Swal.fire({
                                    position: 'center',
                                    icon: 'success',
                                    title: 'Item Updated Success',
                                    showConfirmButton: false,
                                    allowOutsideClick: false,
                                    timer: 1000
                                })
                                setTimeout(function() {
                                    location.reload(true);
                                }, 1000);
                            })
                            .catch(err => {
                                console.error("Error occurred while making the PUT request:", err);
                            });
                    
                        } else{
                            Swal.fire({
                                position: 'center',
                                icon: 'info',
                                title: 'Correct Item Amount',
                                text: `Item amount can not less then one.`,
                                showConfirmButton: false,
                                timer: 3000
                            })
                        }
                    } else{
                        console.log("Your item is empty, cannot be updated.");
                    }
                    break;
                } else{
                    console.log("Product Id is not matched.");
                }
            }
        }
    }

    //Delete Specific Item.
    const cartDeleteItem = (cProductId, cUserId) =>{
        for(let i = 0; i < cartItem.length; i++){
            const currentCart = cartItem[i];
            const existedProductId = parseInt(currentCart.product_id);
            const existeduserId = parseInt(currentCart.user_id);
            const currentUserId = parseInt(cUserId);
            const currentProductId = parseInt(cProductId);
            
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
                    'Deleted!',
                    'Your item has been deleted.',
                    'success'
                  )
                    // if(existedProductId === currentProductId && existeduserId === currentUserId){
                        axios.delete(`http://localhost:7000/cart-delete-item/${currentProductId}/${currentUserId}`)
                        .then(res =>{
                            console.log(res)
                            setTimeout(function() {
                                location.reload(true);
                            }, 2000);
                        })
                        .catch(err => console.log("Error ocurred while making Delete request:", err));
                    // } else{
                    //     console.log("UserId or productId is not matched.")
                    // }
                } else{
                    console.log("Cancel Delete Item.")
                }
                
            })
            .catch(err => console.log("Could not be delete message:", err ))
        }
    }

    const clearAllItems = (cUserId) =>{
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
                'Deleted!',
                'Your item has been deleted.',
                'success'
              )
                axios.delete(`http://localhost:7000/cart-clear-items/${cUserId}`)
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


    //Checkout All Items.
    const checkOutItems = (cUserId) =>{
        const currentUserId = parseInt(cUserId);

        if(cartItem.length !== "" && cartItem.length !== undefined){
            
                Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#88d779',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Check Out Items!'
                  })
                  .then(async (result) => {
                    if (result.isConfirmed) {
                      Swal.fire(
                        'Items Checked Out!',
                        'Items buy success.',
                        'success'
                      )
                        for(let i = 0; i < cartItem.length; i++){
                            const currentItem = cartItem[i]
                            try {
                            //Insert bought data into cart history.
                            const res = await axios.post("http://localhost:7000/cart-history",{
                                user_id : parseInt(currentItem.user_id),
                                product_id : parseInt(currentItem.product_id),
                                product_name : currentItem.product_name,
                                product_image : currentItem.product_image,
                                product_price : parseInt(currentItem.product_price),
                                product_quantity : parseInt(currentItem.product_quantity)
                            })
                                console.log("History inserted success :", res)
                                try{
                                    //Update bought amount.
                                    const currentProductId = currentItem.product_id;
                                    const currentBoughtAmount = currentItem.product_quantity;
                                    // const foundCategoryProductId = categoryProducts.find(product => product.product_id === currentProductId);

                                    for(let j = 0; j < categoryProducts.length; j++){
                                        const categoryProduct = categoryProducts[j];
                                        const categoryBoughtAmount = categoryProduct.bought_amount;

                                        if(categoryProduct.product_id === currentProductId){
                                            const res = await axios.put(`http://localhost:7000/cart-bought/${currentProductId}`,{
                                                bought_amount : currentBoughtAmount + categoryBoughtAmount
                                            })
                                            console.log("Bought amount updated success :", res)

                                            try{
                                                //Clear specific user cart data.
                                                const res = await axios.delete(`http://localhost:7000/cart-clear-items/${currentUserId}`)

                                                console.log(`${currentUserId} cart cleared success :`, res)

                                                setTimeout(function() {
                                                location.reload(true);
                                                }, 2000);

                                            } catch(error){
                                                console.error(`${currentUserId} cart is not cleared :`, error)
                                                throw error;
                                            }

                                        } else{
                                            console.log("Product Id is not matched.")
                                        }
                                    }

                                } catch(error){
                                    console.log("Bought amount updated is not success :", error)
                                    throw error;
                                }

                            } catch(error){
                                console.error("History inserted is not success :",error)
                                throw error;
                            }
                        }
                    } else{
                        console.log("Checkout is canceled.")
                    }
                  }).catch(error => console.log("Item cannot be check out",error))
            
        } else{
            console.log("Your cart is empty.")
        }
    }

    return(
        <>
    {
        auth ?
        <div className="container padding">

            <section>
                <Link className="cart" to="/cart/cart-history">History</Link>
                <Link className="disable-cart">Cart</Link>
                <Link className="disable-info">press enter to update product quantity</Link>
            </section>

        {
            currentUserCart.length === 0 ?
            (<section className="cart-empty">
                <h3 style={{padding:"10px 0"}}> Cart Is Empty </h3>
                <hr/>
                <p style={{padding:" 20px 0"}}> Please press <Link to="/categories">Here</Link> to find your product...</p>
            </section>)
            :
            
            
            (
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
                {
                    
                    cartItem.map(item =>{
                        return(

                    <tbody key={item.product_id}>
                        <tr className="table-border-bottom" >
                            <td style={{width:"10%"}}>
                                <img src={item.product_image} alt="maggie" style={{width:"100%"}}/>
                            </td>

                            <td className="capital-text" style={{textAlign:"center"}}> {item.product_name} </td>

                            <td style={{textAlign:"center"}}> {item.product_price} </td>

                            <td style={{textAlign:"center"}}>
                                <label style={{marginRight:"10px"}}> {item.product_quantity} </label>
                                <input 
                                    id={item.product_id}
                                    type="number" 
                                    name="quantity"
                                    min={-item.product_quantity + 1}
                                    max="999"
                                    onChange={(event) => setCurrentProduct(prevProduct =>({
                                        currentProductId : event.target.id,
                                        quantity: event.target.value}))}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                handleCartUpdate();
                                            }
                                        }}/>
                            </td>

                            <td style={{textAlign:"center"}}>
                                <button id={item.product_id} onClick={(event) => cartDeleteItem(event.target.id, userId.user_id)} className="button-delete">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                            )
                    })
                }

                <tfoot>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td style={{textAlign:"center",paddingTop:"70px"}}>
                            <h3 style={{fontSize:"25px"}}>Total Price</h3>
                            <p style={{fontSize:"35px"}}>RM {totalPrice}</p>
                            <div className="button-column">
                                <button id={currentUser} className="button-checkout" onClick={(event) => checkOutItems(event.target.id)} style={{margin:"10px 20px"}}>Check Out</button>
                                <button id={currentUser} className="button-delete" onClick={(event) => clearAllItems(event.target.id)} style={{margin:"10px 20px"}}>Clear All</button>
                            </div>
                        </td>
                    </tr>
                </tfoot>
                
            </table>
            )
        }

        </div>
         :
        <div style={{textAlign:"center",margin:"276px 0"}}>
            <h1>You are not logged in yet. Please press<Link to="/login"> Login Here</Link></h1>
        </div>
    }
     </>
    )
}
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function PostItem(){

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [admin, setAdmin] = useState({ isAdmin : "" });

    const [currentProduct, setCurrentProduct] = useState({
        productName : "",
        productDescription : "",
        productPrice : "",
        productImage : "",
        productQuantity : ""
    })

    // Get product
    useEffect(() =>{
        axios.get("http://localhost:7000/products")
        .then(res =>{
            setProducts(res.data);
        }).catch(err => console.log(err));
    },[products])

    //Get admin.
    useEffect(() =>{
        axios.get("http://localhost:7000/")
        .then(res =>{
            setAdmin({
                isAdmin : res.data.isAdmin
            })
        }).catch(err => console.log("Data admin cannot be get ", err));
    },[])

    //Admin post new porduct.
    const handlePostProduct = (event) =>{
        event.preventDefault();
        const currentImage = currentProduct.productImage
        const formData = new FormData();

        formData.append('image', currentImage);
        formData.append('product_name', currentProduct.productName);
        formData.append('product_description', currentProduct.productDescription);
        formData.append('product_price', currentProduct.productPrice);
        formData.append('product_quantity', currentProduct.productQuantity);
        if(admin.isAdmin === 1){
            axios.post("http://localhost:7000/post-item", formData)
            .then(res => {
                console.log("data inserted success :", res)
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Item Posted Success',
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    timer: 1000
                })
            })
            .catch(err => console.log("Post new product is not success", err));
        } else{
            console.log("Your are not admin, cannot handle this function.");
        }
    }

    //Delete product /category-delete-item/:cProductId
    const handleDeleteProduct = (productId) =>{
        event.preventDefault();
        const currentProductId = parseInt(productId);
        
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
                axios.delete(`http://localhost:7000/category-delete-item/${currentProductId}`)
                .then(res =>{
                    console.log(res)
                    setTimeout(function() {
                        location.reload(true);
                    }, 2000);
                })
                .catch(err => console.log("Error ocurred while making Delete request:", err));
            } else{
                console.log("Delete has been cancel.");
            }
        })
        .catch(err => console.log("Swal went wrong."))
        
    }

    return(
        <>
        {
            admin.isAdmin === 1?(
        <div className="post-page">
        {/* <img src={currentProduct.productImage} /> */}
            <div className="post-product">
                <form
                    action="/post-item"
                    method="POST"
                    encType="multipart/form-data"
                    onSubmit={handlePostProduct}
                    className="login-container">
                    <h2 style={{height: "100px",
                                paddingTop: "inherit",
                                display: "block"}}>Post Product</h2>

                    <div>
                        <input 
                            name="productName"
                            className="login-input"
                            type="text" 
                            placeholder="Product Title"
                            style={{width: "100%",
                                    border: "none",
                                    borderBottom: "1px solid grey",
                                    marginTop:"20px"}}
                            onChange={(e) => setCurrentProduct(prevProduct =>({
                                ...prevProduct,
                                productName : e.target.value
                            }))}
                            required/>
                    </div>

                    <div>
                        <input 
                            name="productDescription"
                            className="login-input"
                            type="text" 
                            placeholder="Product Description"
                            style={{width: "100%",
                                    border: "none",
                                    borderBottom: "1px solid grey"}}
                            onChange={(e) => setCurrentProduct(prevProduct =>({
                                ...prevProduct,
                                productDescription : e.target.value
                            }))}
                            required/>
                    </div>

                    <div>
                        <input 
                            name="productPrice"
                            className="login-input"
                            type="number" 
                            min={1}
                            pattern="[1-9]"
                            placeholder="Product Price"
                            style={{width: "100%",
                                    border: "none",
                                    borderBottom: "1px solid grey"}}
                            onChange={(e) => setCurrentProduct(prevProduct =>({
                                ...prevProduct,
                                productPrice : e.target.value
                            }))}
                            required/>
                    </div>

                    <div>
                        <input 
                            name="image"
                            className="login-input"
                            type="file" 
                            accept="image/*"
                            placeholder="Product Image"
                            style={{width: "100%",
                                    border: "none",
                                    borderBottom: "1px solid grey"}}
                            onChange={(e) => setCurrentProduct(prevProduct =>({
                                ...prevProduct,
                                productImage : e.target.files[0]
                                // productImage : URL.createObjectURL(e.target.files[0])
                            }))}
                            required/>
                    </div>

                    <div>
                        <input 
                            name="productQuantity"
                            className="login-input"
                            type="number" 
                            placeholder="Product Quantity"
                            style={{width: "100%",
                                    border: "none",
                                    borderBottom: "1px solid grey"}}
                            onChange={(e) => setCurrentProduct(prevProduct =>({
                                ...prevProduct,
                                productQuantity : e.target.value
                            }))}
                            required/>
                    </div>

                    <button type="submit" className="button-login">Post</button>
                    
                </form>
            </div>

            <div className="container padding">
                <section>
                    <Link className="disable-cart">All Products</Link>
                </section>

                <div className="search-container">
                    <input 
                        type="text" 
                        className="search-input" 
                        placeholder="Search..."
                        onChange={(event) => setSearch(event.target.value)}/>
                </div>

                <section>

                    <div className="card-column">
                        {
                            products.filter((item) =>{
                                return search.toLowerCase() === "" ? item : item.product_name.toLowerCase().includes(search);
                                }).map((product) =>{
                            return  (

                            <div key={product.product_id} className="card-section">
                                <img src={product.product_image} alt="Maggie" style={{maxWidth:"100%",maxHeight:"100%"}}/>
                                <div style={{
                                    display:"flex",
                                    justifyContent:"space-between",
                                    padding:"0 30px",
                                    borderTop:"1px solid rgb(168, 168, 168)"}}>
                                    <p className="capital-text" style={{fontSize:"18px"}}>{product.product_name}</p>
                                    <p style={{fontWeight:"bold",fontSize:"18px"}}>{`RM ${product.product_price}`}</p>

                                </div>

                                <div style={{display:"flex"}}>
                                    <Link to={`/edit-item/${product.product_id}`} className="button-checkout" style={{display:"block",margin:"20px auto",width:"80px"}}>Edit</Link>
                                    <button id={product.product_id} onClick={(e) => handleDeleteProduct(e.target.id)} className="button-delete" style={{display:"block",margin:"20px auto",width:"80px"}}>Delete</button>
                                </div>
                            </div>
                                )
                            })          
                        }
                    </div>
                </section>
            </div>
            
        </div>
          ) : (
            <div style={{textAlign:"center",margin:"276px 0"}}>
            <h1>Sorry, You are not admin. Please press<Link to="/login"> Login Here</Link></h1>
            </div>
          )
        }
        </>
    )
}
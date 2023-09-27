import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function EditItem(){
    
    const {id} = useParams();
    const navigate = useNavigate();
    const [admin, setAdmin] = useState({ isAdmin : "" });
    const [product, setProduct] = useState({
        productName: "",
        productDescription: "",
        productPrice: "",
        productImage: "",
        productQuantity: ""
    });


    axios.defaults.withCredentials = true;

    //Get admin.
    useEffect(() =>{
        axios.get("http://localhost:7000/")
        .then(res =>{
            setAdmin({
                isAdmin : res.data.isAdmin
            })
        }).catch(err => console.log("Data admin cannot be get ", err));
    },[])

    //Get specific item.
    useEffect(() =>{
        axios.get("http://localhost:7000/single-item/"+id)
        .then(res =>{
            const {
                    product_name,
                    product_description,
                    product_price,
                    product_image,
                    product_quantity } = res.data

           setProduct({
            productName: product_name,
            productDescription: product_description,
            productPrice: product_price,
            productImage: product_image,
            productQuantity : product_quantity
            }); 
        }).catch(err => console.log(err));
    },[id]) //Cannot update infinity.


    //Edit product details.
    const handleEdit = (event) =>{
        event.preventDefault();
        const formData = new FormData();

        formData.append('image', product.productImage);
        formData.append('product_name', product.productName);
        formData.append('product_description', product.productDescription);
        formData.append('product_price', product.productPrice);
        formData.append('product_quantity', product.productQuantity);

        axios.put(`http://localhost:7000/edit-category-item/${id}`,formData)
        .then(res => {
            console.log("Product edit success: ",res,

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Item Edit Success',
                showConfirmButton: false,
                allowOutsideClick: false,
                timer: 1000
            })
            .then((result) => {
                if (result.dismiss === Swal.DismissReason.timer) {
                    navigate('/post-item');
                } else{
                    console.log('something went wrong')
                }
            }).catch(err => console.log("Swal went error.",err))
        )}).catch(err => console.log("Error request Put:",err));
    }

    return(
        <>
        {
            admin.isAdmin === 1?(
         <div className="post-product">
                <form
                    onSubmit={handleEdit}
                    className="login-container">
                    <h2 style={{height: "100px",
                                paddingTop: "inherit",
                                display: "block"}}>Edit Product</h2>

                    <div>
                        <input 
                            name="productName"
                            className="login-input"
                            value={product.productName}
                            type="text" 
                            placeholder="Product Title"
                            style={{width: "100%",
                                    border: "none",
                                    borderBottom: "1px solid grey",
                                    marginTop:"20px"}}
                            onChange={(e) => setProduct(prevProduct =>({
                                ...prevProduct,
                                productName : e.target.value
                            }))}
                            required/>
                    </div>

                    <div>
                        <input 
                            name="productDescription"
                            value={product.productDescription}
                            className="login-input"
                            type="text" 
                            placeholder="Product Description"
                            style={{width: "100%",
                                    border: "none",
                                    borderBottom: "1px solid grey"}}
                            onChange={(e) => setProduct(prevProduct =>({
                                ...prevProduct,
                                productDescription : e.target.value
                            }))}
                            required/>
                    </div>

                    <div>
                        <input 
                            name="productPrice"
                            value={product.productPrice}
                            className="login-input"
                            type="number" 
                            min={1}
                            pattern="[1-9]"
                            placeholder="Product Price"
                            style={{width: "100%",
                                    border: "none",
                                    borderBottom: "1px solid grey"}}
                            onChange={(e) => setProduct(prevProduct =>({
                                ...prevProduct,
                                productPrice : e.target.value
                            }))}
                            required/>
                    </div>

                    <div>
                        {/* <img style={{width:"50%"}} src={`../../../public/${product.productImage}`}/> */}
                        <input 
                            name="productImage"
                            className="login-input"
                            type="file" 
                            accept="image/*"
                            placeholder="Product Image"
                            style={{width: "100%",
                                    border: "none",
                                    borderBottom: "1px solid grey"}}
                            onChange={(e) => setProduct(prevProduct =>({
                                ...prevProduct,
                                productImage : e.target.files[0]
                                // productImage : e.target.files[0] === "" && null && undefined ? product.productImage : e.target.files[0]
                            }))}
                            required/>
                    </div>

                    <div>
                        <input 
                            name="productQuantity"
                            value={product.productQuantity}
                            className="login-input"
                            type="number" 
                            placeholder="Product Quantity"
                            style={{width: "100%",
                                    border: "none",
                                    borderBottom: "1px solid grey"}}
                            onChange={(e) => setProduct(prevProduct =>({
                                ...prevProduct,
                                productQuantity : e.target.value
                            }))}
                            required/>
                    </div>

                    <button type="submit" className="button-login">Update</button>
                    
                </form>
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
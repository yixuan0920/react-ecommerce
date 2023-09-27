import React, { useEffect, useState } from "react";
import Maggie from "/maggie-removebg-preview.png";
import axios from "axios";
import Footer from "./components/footer";
import { Link } from "react-router-dom";

export default function Home() {

  // If user is signin
  const [auth, setAuth] = React.useState(false);
  const [categoryProducts, setCategoryProducts] = useState([]);

  const favoriteProducts = categoryProducts.map(data =>{
    return(
      <div key={data.product_id} className="card-section">
        <img src={data.product_image} alt="Maggie" style={{maxWidth:"100%"}}/>
        <div style={{
          display:"flex",
          justifyContent:"space-between",
          padding:"0 30px",
          borderTop:"1px solid rgb(168, 168, 168)"}}>
          <p className="capital-text" style={{fontSize:"18px"}}>{data.product_name}</p>
          <p style={{fontWeight:"bold",fontSize:"18px"}}>{`RM ${data.product_price}`}</p>

        </div>
        <Link to={`/single-item/${data.product_id}`} className="button-learn" style={{display:"block",margin:"20px"}}>View item</Link>
      </div>
    )
  })
  
  axios.defaults.withCredentials = true;

  React.useEffect(() =>{
    axios.get("http://localhost:7000")
    .then(res =>{
      if(res.data.Status === "Success"){
        setAuth(true);
      } else{
        setAuth(false);
      }
    }).catch(err => console.log(err))
  },[auth])

  //Get top 4 of favorite products.
  useEffect(() =>{
    axios.get("http://localhost:7000/products")
    .then(res =>{
        const data = res.data;
        const existedProducts = data.map(item =>({
            productId : item.product_id,
            productName :  item.product_name,
            productPrice : item.product_price,
            productImage : item.product_image,
            boughtAmount : item.bought_amount,
        }))
        const updateProduct = [];

        for(let i = 0; i < existedProducts.length; i++){
            const currentProducts = existedProducts[i];

            updateProduct.push({
                product_id : currentProducts.productId,
                product_name : currentProducts.productName,
                product_price : currentProducts.productPrice,
                product_image :currentProducts.productImage,
                bought_amount : currentProducts.boughtAmount
            })            
        }
        
        const sortedProducts = updateProduct.sort((a, b) => b.bought_amount - a.bought_amount);
        const topFourProducts = sortedProducts.slice(0, 4);
        
        if(topFourProducts.length != 0){
          setCategoryProducts(topFourProducts)
        }
    }).catch(err => console.log("request error get data :",err))
  },[auth])

 return(
  <>
  <div>
    <section className="home-container">
      <img 
        src="https://img.freepik.com/free-photo/showing-cart-trolley-shopping-online-sign-graphic_53876-133967.jpg"
        alt="image"
        style={{maxWidth:"100%",height:"auto"}}/>
      
      <div className="home-welcome">

        <h1 style={{paddingBottom:"30px"}}> Welcome to my ecommerce</h1>
        <p style={{paddingBottom:"30px"}}> Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo laudantium ullam labore molestias, saepe asperiores necessitatibus mollitia obcaecati ratione quos expedita quas ea iure voluptas aperiam cum voluptate, nesciunt optio.</p>

        <div>
          <button className="home-button button-learn"> Learn More</button>
          <button className="button-shop"> Shop Now</button>
        </div>
        
      </div>
    </section>

    <section className="container">
      <div style={{margin:"20px 0"}}>
        <p style={{textAlign:"center"}}>
          Hot Product
        </p>
        <h1 style={{textAlign:"center"}}> Everyone's Favorite</h1>
      </div>

      <div className="card-column">
        {favoriteProducts}
      </div>
    </section>


    <section className="our-client">
      <div style={{textAlign:"center",margin:"100px",border:"1px solid rgb(196, 196, 196)",padding:"50px"}}>
        <h3 style={{marginBottom:"50px"}}> Our Client </h3>
        <p style={{padding:"20px 100px",textAlign:"left"}}> Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate blanditiis nisi, recusandae nostrum, nam id dignissimos similique architecto impedit eveniet quidem veritatis ut facilis, quos fuga ipsum maiores nihil. Facere.</p>
      </div>
    </section>

  </div>
  <Footer/>

  </>
 )
}
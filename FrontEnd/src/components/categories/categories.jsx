import { React, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom"
import axios from "axios";

export default function Categories(){

    const [auth, setAuth] = useState(false);
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");

    axios.defaults.withCredentials = true;
    
    //Get User
    useEffect(() =>{
        axios.get("http://localhost:7000/")
        .then(res =>{
            if(res.data.Status === "Success"){
                setAuth(true);
            } else{
                setAuth(false);
            }
        }).catch(err => console.log(err))
    },[])

    // Get products
    useEffect(() =>{
            axios.get("http://localhost:7000/products")
            .then(res =>{
                setProducts(res.data);
            }).catch(err => console.log(err));

    },[])

    return(
        <>
    {
        auth ?
        
        <div className="container padding">
            <section>
                <Link className="disable-cart">Categories</Link>
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
                            <img src={product.product_image} alt="Maggie" style={{maxWidth:"100%"}}/>
                            <div style={{
                                display:"flex",
                                justifyContent:"space-between",
                                padding:"0 30px",
                                borderTop:"1px solid rgb(168, 168, 168)"}}>
                                <p className="capital-text" style={{fontSize:"18px"}}>{product.product_name}</p>
                                <p style={{fontWeight:"bold",fontSize:"18px"}}>{`RM ${product.product_price}`}</p>

                            </div>

                            <Link to={`/single-item/${product.product_id}`} className="button-learn" style={{display:"block",margin:"20px auto",width:"150px"}}>View item</Link>
                        </div>
                            )
                        })          
                    }
                </div>
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
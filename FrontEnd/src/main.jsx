import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import Nav from './components/nav'
import Home from './Home'
import Categories from './components/categories/categories'
import Cart from './components/mycart/cart'
import FAQ from './components/faq'
import Account from './components/account/account'
import History from './components/mycart/history'
import SingleItem from './components/categories/singleItem'
import Login from './components/account/login'
import Register from './components/account/register'
import Edit from './components/account/edit'
import PostItem from './components/admin/postItem'
import EditItem from './components/admin/editItem'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <header>
      <Nav/>
    </header>

    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/categories' element={<Categories/>} />
      <Route path='/cart' element={<Cart/>} />
      <Route path='/faq' element={<FAQ/>} />
      <Route path='/account' element={<Account/>} />
      <Route path="/cart/cart-history" element={<History/>}/>
      <Route path='/single-item/:id' element={<SingleItem/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/Register' element={<Register/>}/>
      <Route path='/edit/:id' element={<Edit/>}/>

      {/* admin site */}
      <Route path='/post-item' element={<PostItem/>}/>
      <Route path='/edit-item/:id' element={<EditItem/>}/>

    </Routes>

  </BrowserRouter>
)

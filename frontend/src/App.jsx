import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Home from './pages/Homem'
import Cart from './pages/Cart'
import About from './pages/About'
import Collection from './pages/Collection'
import Loginm from './pages/Loginm'
import Placeorder from './pages/Placeorder'
import Contact from './pages/Contact'
import Order from './pages/Order'
import Navbar from './components/Navbar'
import Product from './pages/Productm'
import Footer from './components/Footer'
import Searchbar from './components/searchbar'
 import { ToastContainer, toast } from 'react-toastify';
 import 'react-toastify/dist/ReactToastify.css'


const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md-px-[7vw] lg:px-[9vw]'>
      <ToastContainer/>
      <Navbar/>
      <Searchbar/>
 <Routes>
  <Route path='/' element={<Home/>}></Route>
  <Route path='/About' element={<About/>}></Route>
  <Route path='/Cart' element={<Cart/>}></Route>
  <Route path='/Collection' element={<Collection/>}></Route>
  <Route path='/Contact' element={<Contact/>}></Route>
  <Route path='/Login' element={<Loginm/>}></Route>
  <Route path='/Order' element={<Order/>}></Route>
  <Route path='/Placeorder' element={<Placeorder/>}></Route>
  <Route path='/Product/:productId' element={<Product/>}></Route>
 </Routes>
 <Footer/>
    </div>
  )
}

export default App

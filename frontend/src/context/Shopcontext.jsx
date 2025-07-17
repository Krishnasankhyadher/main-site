import React, { useEffect, useState } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios"
const Shopcontext = createContext();

const Shopcontextprovider = (props) => {
    const currency = '₹';
    const delivery_charge = 10;
    const backendurl=import.meta.env.VITE_BACKEND_URL
    const[search,setsearch]=useState('')
    const[showsearch,setshowsearch]=useState(false)
    const [cartitems,setcartitems]=useState({})
    const [products,setproducts]=useState([])
    const [token, settoken]=useState('')
    const navigate=useNavigate()

    const addtocart=async(itemid,size)=>{
        if(!size){
            toast.error('select your size')
            return
        }
        let cartdata =structuredClone(cartitems)

        if(cartdata[itemid]){
            if(cartdata[itemid][size]){
                cartdata[itemid][size] +=1
            }
            else{
                cartdata[itemid][size] =1
            }
        }
        else{
            cartdata[itemid]={}
            cartdata[itemid][size]=1
        }
     
        setcartitems(cartdata)

  
        if (token) {
      try {
     const response =  await axios.post(backendurl +'/api/cart/add',{itemid, size}, { headers: { Authorization: `Bearer ${token}` } }
)
       
      } catch (error) {
        console.log(error);
        toast.error(error.message)
        
      }
      
    }
    }
    
   
  const getcartcount = () => {
  let totalcount = 0;
  for (const itemid in cartitems) {
    for (const size in cartitems[itemid]) {
      if (cartitems[itemid][size] > 0) {
        totalcount += cartitems[itemid][size];
      }
    }
  }
  return totalcount;
};
const updatequantity=async(itemid,size,quantity)=>{
    let cartdata= structuredClone(cartitems)
    cartdata[itemid][size]=quantity
    setcartitems(cartdata)
     if (token) {
      try {
        await axios.post(backendurl +'/api/cart/update',{itemid, size, quantity}, { headers: { Authorization: `Bearer ${token}` } }
)
      } catch (error) {
        console.log(error);
        toast.error(error.message)
        
      }
      
    }
}
const getcartamount = () => {
  let totalAmount = 0;

  for (const items in cartitems) {
    let itemInfo = products.find((product) => product._id === items);
    
    for (const item in cartitems[items]) {
      try {
        if (cartitems[items][item] > 0) {
          totalAmount += itemInfo.price * cartitems[items][item];
        }
      } catch (error) {
        // Optional: Log or handle error
      }
    }
    
  }

  return totalAmount;
};
const getproductdata =async ()=>{
  try {
    const response =await axios.get(backendurl +'/api/product/list')
    if(response.data.success){
      setproducts(response.data.products)
    }else{
      toast.error(response.data.message)
    }
  } catch (error) {
    console.log(error)
    toast.error(error.message)
  }
}
const getcartitems= async (token )=>{
  try {
    const response= await axios.post(backendurl + '/api/cart/get',{},{ headers: { Authorization: `Bearer ${token}` } }
)
    if (response.data.success) {
      setcartitems(response.data.cartdata)
    }
  } catch (error) {
    console.log(error)
    toast.error(error.message)
  }
}

useEffect(()=>{
  getproductdata()
},[])
useEffect(() => {
  const storedToken = localStorage.getItem('token');
  if (!token && storedToken) {
    settoken(storedToken);
    getcartitems(storedToken);
  }
}, [token]);

    const value = {
        products,
        currency,
        delivery_charge,
        search,setsearch,showsearch,setshowsearch,cartitems,
        addtocart,getcartcount,updatequantity,getcartamount,
        navigate,backendurl,token,settoken,setcartitems, 
    };

    return (
        <Shopcontext.Provider value={value}>
            {props.children}
        </Shopcontext.Provider>
    );
};

export default Shopcontextprovider;
export { Shopcontext };
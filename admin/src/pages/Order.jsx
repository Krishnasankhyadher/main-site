import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { backendurl, currency } from '../App'
import { toast } from 'react-toastify'

const Order = ({ token }) => {
  const [orders, setorders] = useState([])

  const fetchalldata = async () => {
    if (!token) return
    try {
      const response = await axios.post(`${backendurl}/api/order/list`, {}, {
        headers: { token }
      })
      if (response.data.success) {
        setorders(response.data.orders)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  } 
   const statushandler = async (event , orderid )=>{
   try {
    const response = await axios.post(backendurl + '/api/order/status', {orderid, status:event.target.value},{headers:{token}})
    if (response.data.success) {
      await fetchalldata()
    }
   } catch (error) {
    console.log(error)
    toast.error(response.data.message)
   }
   }

  useEffect(() => {
    fetchalldata()
  }, [token])

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Order Page</h3>
      <div className="space-y-4">
        {orders.map((order, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row items-start justify-between border border-gray-300 rounded-lg p-4 shadow-sm text-gray-800 gap-4"
          >
            {/* LEFT: Product info and Address */}
            <div className="flex-1 flex gap-4">
              <img
                className="w-12 h-12 object-contain"
                src="https://www.svgrepo.com/show/421577/box-delivery.svg"
                alt="package"
              />
              <div className="space-y-1">
                {order.items.map((item, idx) => (
                  <p key={idx}>
                    {item.name} x {item.quantity} <span className="text-xs">({item.size})</span>
                  </p>
                ))}
                <div className="mt-2 text-sm">
                  <p className="font-semibold">Name: {order.address?.firstname} {order.address?.lastname}</p>
                  <p>{order.address?.street}</p>
                  <p>{order.address?.city}, {order.address?.state}, {order.address?.country} - {order.address?.zipcode}</p>
                  <p>📞 {order.address?.phone}</p>
                </div>
              </div>
            </div>

            {/* CENTER: Payment and Date Info */}
            <div className="text-sm min-w-[150px]">
              <p><strong>Method:</strong> {order.paymentmethod}</p>
              <p><strong>Payment:</strong> {order.payment ? 'Done' : 'Pending'}</p>
              <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
            </div>

            {/* RIGHT: Amount + Status */}
            <div className="flex flex-col items-end gap-2 min-w-[120px]">
              <p className="font-semibold">{currency}{order.amount}</p>
              <select onChange={(event)=>statushandler(event, order._id)} value={order.status} className="border px-2 py-1 rounded text-sm">
                <option value="Order placed">Order placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Order

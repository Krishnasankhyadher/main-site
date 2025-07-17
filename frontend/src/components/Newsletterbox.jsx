import React from 'react'

const Newsletterbox = () => {
  const onSubmitHandler=(event)=>{
   event.preventDefault()
  }
  return (
    <div className='text-center'>
        <p className='text-2xl font-medium text-gray-800'>Subscribe Now & get $150 OFF</p>
        <p className='text-gray-400 mt-3'>
            You get 150 off on your first order of above $499

        </p>
        <form onSubmit={onSubmitHandler} action="create" method='post' className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'>
            <input className='w-full sm:flex-1 outline-none' type="email" placeholder='Enter your email' required />
            <button type='submit' className='bg-black text-white text-xs py-4 px-10'>SUBSCRIBE</button>
        </form>
      
    </div>
  )
}

export default Newsletterbox

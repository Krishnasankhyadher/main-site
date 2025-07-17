import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <div>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm '>
                <div>
                    <Link to='/'><img src="/Trendoor/images/Screenshot 2025-06-30 141043.png" alt="no image" className='w-36' /></Link>
                    <p className='w-full md:w-2/3 text-gray-600'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam tempora minima in laborum beatae libero necessitatibus quo fugit id debitis.

                    </p>
                </div>
                <div>
                    <p className='text-xl font-medium mb-5'>COMPANY</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
                        <li>HOME</li>
                        <li>ABOUT US</li>
                        <li>DELIVERY</li>
                        <li>PRIVACY POLICY</li>

                    </ul>
                </div>
                <div>
                    <p className='text-xl font-medium mb-5'>GET IN TOUCH </p>
                    <ul className='flex flex-col gap-1 text-gray-600'>

                    <li>+91 9412589173</li>
                    <li>krishnasankhyadher@gmail.com</li>
                    </ul>

                </div>

            </div>
            <div>
                <hr />
                <p className='py-5 text-sm text-center'>Copyright 2024@ Trendoor.in -All Rights Reserved</p>
            </div>

        </div>
    )
}

export default Footer

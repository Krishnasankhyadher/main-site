import React, { useContext, useEffect, useState } from 'react'
import { Shopcontext } from '../context/Shopcontext'
import Title from '../components/Title'
import Productitem from '../components/Productitem'
const Collection = () => {
  const { products , search, showsearch} = useContext(Shopcontext)
  const [showfilter, setShowfilter] = useState(false)
  const [filterproducts, setfilterproducts] = useState([])
  const [category, setcategory] = useState([])
  const [subcategory, setsubcategory] = useState([])
  const [sortType, setsortType] = useState('relavent')

  const togglecategory = (e) => {
    if (category.includes(e.target.value)) {
      setcategory(prev => prev.filter(item => item !== e.target.value))
    }
    else {
      setcategory(prev => [...prev, e.target.value])
    }

  }
  const togglesubcategory = (e) => {
    if (subcategory.includes(e.target.value)) {
      setsubcategory(prev => prev.filter(item => item !== e.target.value))
    }
    else {
      setsubcategory(prev => [...prev, e.target.value])
    }

  }
  const applyfilter = () => {
    let productscopy = products.slice();

    if(showsearch && search){
      productscopy=productscopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }

    if (category.length > 0) {
      productscopy = productscopy.filter(item => category.includes(item.category));
    }

    if (subcategory.length) {
      productscopy = productscopy.filter(item => subcategory.includes(item.subcategory));
    }

    setfilterproducts(productscopy)
  };
  const sortproduct = () => {
    let fpcopy = filterproducts.slice()
    switch (sortType) {
      case 'low-high':
        setfilterproducts(fpcopy.sort((a, b) => (a.price - b.price)))
        break;
      case 'high-low':
        setfilterproducts(fpcopy.sort((a, b) => (b.price - a.price)))
        break;
      default:
        applyfilter()
        break;
    }


  }
  useEffect(() => {
    sortproduct()
  }, [sortType])


  useEffect(() => {
    applyfilter()
  }, [category, subcategory,search,showsearch,products])

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      <div className='min-w-60'>
        <p onClick={() => setShowfilter(!showfilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>FILTERS
          <img src="https://www.svgrepo.com/show/501929/drop-down-minor.svg" className={`h-3 sm:hidden ${showfilter ? 'rotate-90' : ''}`} alt="" /></p>
        <div className={`border border-gray-300 pl-5 py- mt-6 ${showfilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input type="checkbox" className='w-3' value={'women'} onClick={togglecategory} />Women

            </p>
            <p className='flex gap-2'>
              <input type="checkbox" className='w-3' value={'men'} onClick={togglecategory} />Men

            </p>

            <p className='flex gap-2'>
              <input type="checkbox" className='w-3' value={'kids'} onClick={togglecategory} />Kids

            </p>



          </div>


        </div>
        <div className={`border border-gray-300 pl-5 py- mt-6 my-5 ${showfilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>TYPE</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input type="checkbox" className='w-3' value={'topwear'} onClick={togglesubcategory} />Upper Wear

            </p>
            <p className='flex gap-2'>
              <input type="checkbox" className='w-3' value={'bottomwear'} onClick={togglesubcategory} />Bottom wear

            </p>





          </div>


        </div>


      </div>
      <div className='flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={'ALL'} text2={'COLLECTION'}></Title>
          <select onChange={(e) => setsortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2' id="">
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>

        </div>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {
            filterproducts.map((item, index) => (
              <Productitem
                key={index}
                id={item._id}
                image={item.image}
                name={item.name}
                price={item.price}
              />
            ))
          }


        </div>

      </div>

    </div>
  )
}

export default Collection

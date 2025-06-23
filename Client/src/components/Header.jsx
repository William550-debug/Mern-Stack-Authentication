import React, { useContext } from 'react'
import{ assets} from '../assets/assets'
import { AppContent } from '../context/AppContext'

const Header = () => {

  const {userData} = useContext(AppContent)
  return (
    <div className='flex flex-col items-center mt-20 px-4 center-text-gray-800'>
      <img src={assets.header_img} alt="Logo"  className='w-36 h-36 rounded-full mb-6'/>
      <h1 className='flex items-center gap-2 text-xl sm:text-3xl  font-medium mb-2 '
      >Hey {userData ? userData.name:'Developer' }
        <img src={assets.hand_wave} alt=""  className='w-8 aspect-square'/>

      </h1>
      <h2 className='text-3xl sm:text-5xl font-semibold mb-4 '>Welcome to the platform</h2>
      <p className='mb-8 max-w-md'>We are glad to have you here. Explore and enjoy your stay!</p>
      <button className='border border-gray-500 rounded-full py-2.5  px-8 hover:bg-gray-100 transition-all'>Get Started</button>

    </div>
  )
}

export default Header

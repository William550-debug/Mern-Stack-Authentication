import React, { useContext } from 'react'
import {assets} from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';


const Navbar = () => {

  const navigate = useNavigate();
 const { userData, sendVerificationOtp, logout, setIsLoggedin, setUserData } = useContext(AppContent);

  

  const handleVerifyClick = async () => {
    if (userData?.isVerified) {
        toast.info('Your email is already verified');
        return;
    }
        const success = await sendVerificationOtp();
        if (success) {
            navigate('/verify-email');
        }
    };

  const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

  const handleLogin = () => {
    navigate('/login')
  }

  return (
    <div className='w-full flex  justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
      <img src={assets.logo} alt="" className='w-28 sm:w-32' />
      {userData?
      <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group  '>
        {userData.name[0].toUpperCase()}
        <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10'>
          <ul className='list-none m-0 p-2 bg-gray-100 text-sm'>
            {!userData.isVerified &&
             <li onClick={handleVerifyClick} className='py-1 px-2 hover:bg:gray-100 text-sm cursor-pointer'>Verify email</li>
             }
           
            <li onClick={handleLogout} className='py-1 px-2 hover:bg:gray-100 text-sm cursor-pointer pr-10'>Logout</li>
          </ul>
        </div>
        
      </div>:

      <button
        onClick = {() => handleLogin()}
       className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all'
       >
        Login
        <img src={assets.arrow_icon} alt="Login Icon" className='w-4 h-4' />
      </button>}
    </div>
  )
}

export default Navbar

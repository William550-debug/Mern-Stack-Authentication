import axios from "axios";
import { createContext, useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import {useNavigate} from 'react-router-dom'

export const AppContent = createContext()



export const AppContextProvider = (props)=>{

    axios.defaults.withCredentials = true;

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const navigate = useNavigate();
    

    const [isLoggedin, setIsLoggedin]  = useState(false);
    const[userData, setUserData] = useState(false);
    const [isLoading, setIsLoading] = useState(true);


    const getAuthState = async () =>{

        try{
            const {data} = await axios.get(backendUrl+ '/api/auth/is-auth')

            if(data.success){
                setIsLoggedin(true);
                await getUserData();
            }

            return data.success;
            
            


        }catch(error){
            toast.error(error.response?.data?.message || error.message);

        }
        finally{
            setIsLoading(false);
        }
    }

    const getUserData = async () => {
        try{
            const {data} = await axios.get(backendUrl + '/api/user/data')
            

            if(data.success){
                setUserData(data.userData);
                return data.UserData;

            }else{
                toast.error(data.message);
                return null;
            }
            

        }catch(error){
            toast.error(error.response?.data?.message || error.message);

        }
    }

    const sendVerificationOtp = async ()=>{
    
        try{
          axios.defaults.withCredentials = true
    
          const {data} = await axios.post( backendUrl + '/api/auth/send-verify-otp')
    
          if(data.success){
            navigate('/verify-email');
            toast.success(data.message);
    
    
          }else{
            toast.error(data.message)
          }
    
        }catch (error){
          toast.error(error.message)
          
        }
      }
    
      const logout = async() =>{
        try{
          axios.defaults.withCredentials = true;
          const {data} = await axios.post(backendUrl + '/api/auth/logout')
          data.success && setIsLoggedin(false)
          data.success && setUserData(false)
    
        }catch(error){
          toast.error(error.message)
    
        }
      }

     useEffect(() => {
        getAuthState();
    }, []);

    const value = useMemo(() => ({
        backendUrl,
        isLoggedin,
        setIsLoggedin,
        userData,
        setUserData,
        getUserData,
        sendVerificationOtp,
        logout,
        isLoading
        
    }), [isLoggedin, userData, isLoading]);
  
    return (
        <AppContent.Provider value={value}>
        {props.children}
        </AppContent.Provider>
    );

}
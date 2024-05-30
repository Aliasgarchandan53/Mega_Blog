import { useEffect, useState } from 'react'
import {useDispatch} from "react-redux"
import authService from "./appwrite/auth"
import {login,logout} from "./store/authSlice"
import './App.css'
import component from "./components/index"

function App() {

  const [loading,setLoading]=useState(true)
  const dispatch = useDispatch()

  useEffect(()=>{
    authService.getCurrentUser()
    .then((userData)=>{
      if(userData){
        dispatch(login({userData}))
      }
      else{   //just to update the state  
        dispatch(logout())
      }
    })
    .finally(()=>setLoading(false))
  },[])

  return !loading?(
    <div className='min-h-screen flex flex-wrap content-betweenbg-gray-400' >
      <div className='w-full block' >
        <component.Header />
        <main>
          {/* <Outlet/> */}
        </main>
        <component.Footer />
      </div>
    </div>
  ):null
}

export default App

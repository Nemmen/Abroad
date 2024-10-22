import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { post } from '../services/ApiEndpoint'
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'
export default function Register() {
  const navigate = useNavigate()
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')


  const handleSubmit=async(e)=>{
    e.preventDefault();
    try {
     const request= await post('http://localhost:4000/auth/register',{name,email,password})
     const reposne=request.data
     if (request.status==200) {
          toast.success(reposne.message)
          navigate('/auth/login')
     }
     console.log(reposne)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
          <div className='register-container'>
            <h2>Register</h2>
               <form action="" onSubmit={handleSubmit}>
               <div className='input-group'>
                <label htmlFor="username">Username</label>
                <input type="text"
                onChange={(e)=> setName(e.target.value)} name="" id="username" />
               </div>
               <div className='input-group'>
                <label htmlFor="email">Emaiil</label>
                <input type="email" name="" onChange={(e)=>setEmail(e.target.value)} id="email" />
               </div>
               <div className='input-group'>
                <label htmlFor="password">Password</label>
                <input type="password" onChange={(e)=>setPassword(e.target.value)} name="" id="password" />
               </div>
               <button type='submit'>Register</button>
               <p className='register-link'>
               Already have an account? <Link to={'/auth/login'}>Login here</Link>
                </p>
               </form>
          </div>




    </>
  )
}

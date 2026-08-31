import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient';
import './App.css'
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Login from './login/Login';
import Home from './pages/Home';
import { IoHome, IoPersonCircle } from "react-icons/io5";
import Account from './pages/Account';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function getSession(){
      const { data: { session } } = await supabase.auth.getSession();
      if(!session) navigate('/login');
    }
    getSession();
  }, []);

  return (
    <div>
      {location.pathname !== "/login" && 
      <header>
        <Link className='logo link' to="/" reloadDocument><h2>Orchid</h2></Link>
      </header>
      }
      <div style={{marginBottom: "70px"}} />
      <div style={{padding: "10px"}}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </div>
      {location.pathname !== "/login" &&
      <footer>
        <Link to="/" reloadDocument className='link'><h2><IoHome /></h2></Link>
        <Link to="/account" reloadDocument className='link'><h2><IoPersonCircle /></h2></Link>
      </footer>
      }
    </div>
  )
}

export default App

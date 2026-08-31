import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient';
import './App.css'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Login from './login/Login';
import Home from './pages/Home';

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
        <h2 className='logo'>Orchid</h2>
      </header>
      }
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  )
}

export default App

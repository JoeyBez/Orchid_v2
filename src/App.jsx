import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient';
import './App.css'
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Login from './login/Login';
import Home from './pages/Home';
import { IoHome, IoPersonCircle } from "react-icons/io5";
import Account from './pages/Account';
import EditProfile from './pages/EditProfile';
import SearchBar from './components/SearchBar';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState();

  async function getSession(){
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session);
    if(!session) navigate('/login');
    return session.user.id;
  }

  useEffect(() => {
    getSession();
  }, [window.location.href]);

  return (
    <div>
      {location.pathname !== "/login" && 
      <header>
        {/* <Link to="/" className='link' reloadDocument><h2><IoHome /></h2></Link> */}
        <div style={{textAlign:"left", width:"100%", alignContent:"center"}}><div style={{width:"fit-content"}}><Link className='logo link' to="/" reloadDocument><h3>Orchid</h3></Link></div></div>
        <SearchBar />
        <div style={{float:"right", width:"100%", alignContent:"center"}}><div style={{width:"fit-content", float:"right"}}><Link to={`/account?user=${user ? user.user.id : null}`} className='link' reloadDocument><h2><IoPersonCircle /></h2></Link></div></div>
      </header>
      }
      <div style={{marginBottom: "70px"}} />
      <div style={{padding: "20px"}}>
        <Routes>
          <Route path="/" element={<Home session={user}/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account session={user || null} getSession={getSession}/>} />
           <Route path="/edit-profile" element={<EditProfile />} />
        </Routes>
      </div>
      {/* {location.pathname !== "/login" &&
      <footer>
        <Link to="/" reloadDocument className='link'><h2><IoHome /></h2></Link>
        <Link to="/account" reloadDocument className='link'><h2><IoPersonCircle /></h2></Link>
      </footer>
      } */}
    </div>
  )
}

export default App

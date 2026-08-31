import { useEffect, useState } from 'react'
import './App.css'
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  const [currentSession, setCurrentSession] = useState();

  useEffect(() => {
    async function getSession(){
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentSession(session);
    }
  }, []);

  return (
    <>
      
    </>
  )
}

export default App

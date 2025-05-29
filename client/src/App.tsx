import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { useEffect } from 'react';
import Auth from './utils/auth';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    // Optional: Check authentication status on initial load
    if (!Auth.loggedIn() && window.location.pathname !== '/login') {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className='container'>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default App;
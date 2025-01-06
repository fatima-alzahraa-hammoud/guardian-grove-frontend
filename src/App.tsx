import './styles/App.css';
import Login from './pages/Login';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Signup from './pages/Signup';
import LandinPageNavbar from './components/common/LandingPageNavbar';
import Main from './pages/MainDashboard';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { toast, ToastContainer } from 'react-toastify';
interface DecodedToken {
  userId: string;
  role: string;
}

function App() {

  const [userId, setUserId] = useState<string | null>(null);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
      
  useEffect(() =>{
      if (token){
          const decoded = jwtDecode<DecodedToken>(token);
          console.log("Decoded token:", decoded); 
          setUserId(decoded.userId);
      }
      else{
          toast.error("You are not allowed to access the page");
          navigate("/");
      }
  }, []);

  return (
    <>
      <div className='App'>
        <ToastContainer />
        <Routes>
          <Route path='/' element={<Login />}/>
          <Route path='/signup' element={<Signup />}/>
          <Route path='/landingPage' element={<LandinPageNavbar />}/>
          <Route path='/dashboard' element={<Main />} /> 
        </Routes>
      </div>
    </>
  )
}

export default App

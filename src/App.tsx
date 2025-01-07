import './styles/App.css';
import Login from './pages/Login';
import { Routes, Route, useLocation } from 'react-router-dom';
import Signup from './pages/Signup';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { requestApi } from './libs/requestApi';
import { requestMethods } from './libs/enum/requestMethods';
import { setUser } from './redux/slices/userSlice';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';

interface DecodedToken {
  userId: string;
  role: string;
}

function App() {

  const dispatch = useDispatch();
  const location = useLocation();

  const [userId, setUserId] = useState<string | null>(null);

  const token = sessionStorage.getItem("token");
      
  useEffect(() =>{
      if (location.pathname === '/' || location.pathname === 'signup'){
        return;
      }
      if (token){
          const decoded = jwtDecode<DecodedToken>(token);
          setUserId(decoded.userId);
          const fetchUsers = async() =>{
            try{

              const response = await requestApi({
                  route: "/users/user",
                  method: requestMethods.GET,
                  body: userId,
              });

              if (response){
                  dispatch(setUser(response.user));
              }

            }catch(error){
            }
          }
          fetchUsers();
      }
  }, []);

  return (
    <>
      <div className='App'>
        <Routes>
          <Route path='/' element={<Login />}/>
          <Route path='/signup' element={<Signup />}/>
          <Route path='/landingPage' element={<LandingPage />}/>
          <Route path='/dashboard/*' element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute> } />
        </Routes>
      </div>
    </>
  )
}

export default App

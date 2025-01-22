import './styles/App.css';
import Login from './pages/Login';
import { Routes, Route, useLocation } from 'react-router-dom';
import Signup from './pages/SignUp';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { requestApi } from './libs/requestApi';
import { requestMethods } from './libs/enum/requestMethods';
import { selectFamilyId, setUser } from './redux/slices/userSlice';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import AddMembersQuestion from './components/SignUp Components/AddMembersQuestion';
import AddMembersForm from './pages/AddMembersForm';
import AddMembersBackground from './components/common/AddMembersBackground';
import { setFamily } from './redux/slices/familySlice';
import AdminSidebar from './admin/AdminSidebar';
import { SidebarProvider } from './components/ui/sidebar';
import Admin from './pages/Admin';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

interface DecodedToken {
  userId: string;
  role: string;
}

function App() {

  const dispatch = useDispatch();
  const familyId = useSelector(selectFamilyId);
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
                  body:  { userId },
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

  useEffect(() => {
    if (location.pathname === '/' || location.pathname === 'signup'){
      return;
    }
    if (!familyId) return;
    
    const fetchFamilyDetails = async () => {
      try {
        const result = await requestApi({
          route: "/family/getFamily",
          method: requestMethods.POST,
          body: {familyId}
        });

        if (result){
          if (result.family)
            dispatch(setFamily(result.family));
        }
        else{
          console.log(result.message)
        }
      } catch (error) {
        console.log("Something went wrong", error);
      }
    };

    fetchFamilyDetails();
  }, [userId,familyId])

  return (
    <>
    
      <div className='App'>
        <Routes>
          <Route path='/' element={<Login />}/>
          <Route path='/signup' element={<Signup />}/>
          <Route path='/landingPage' element={<LandingPage />}/>
          <Route path='/dashboard/*' element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute> } />
          <Route path='/addMembersQuestion' element={ <ProtectedRoute> <AddMembersBackground ChildComponent={AddMembersQuestion} /> </ProtectedRoute> } />
          <Route path='/addMembers' element={ <ProtectedRoute> <AddMembersBackground ChildComponent={AddMembersForm} /> </ProtectedRoute> } />
          <Route path='/admin/*' element={<SidebarProvider><ProtectedAdminRoute><Admin /></ProtectedAdminRoute></SidebarProvider>}/>
        </Routes>
      </div>
    </>
  )
}

export default App

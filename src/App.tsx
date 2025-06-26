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
import { SidebarProvider } from './components/ui/sidebar';
import Admin from './pages/Admin';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import ChangePasswordPage from './components/SignUp Components/ChangePasswordForm';
import { generateToken, messaging } from './notifications/firebase.ts';
import { onMessage } from 'firebase/messaging';
import {Toaster} from 'react-hot-toast';
import { showFirebaseNotificationToast } from './lib/CustomToast.tsx';

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

  useEffect(() => {
    const initializeFirebase = async () => {
      try {        
        onMessage(messaging, (payload) => {
          console.log('Message received: ', payload);
          showFirebaseNotificationToast(payload);
        });
      } catch (error) {
        console.error('Firebase initialization error:', error);
      }
    };

    initializeFirebase();
  }, []);

  // generate token and save to user to backend
  useEffect(() => {
    const saveFcmTokenToBackend = async (token: string) => {
      if (!userId) return;

      try {
        await requestApi({
          route: "/users/save-fcm-token",
          method: requestMethods.POST,
          body: { userId, fcmToken: token },
        });
        console.log("FCM token saved to backend");
      } catch (error) {
        console.error("Failed to save FCM token:", error);
      }
    };

    const getAndSaveToken = async () => {
      try {
        const token = await generateToken();
        if (token) {
          saveFcmTokenToBackend(token);
        }
      } catch (error) {
        console.error("Error getting or saving FCM token:", error);
      }
    };

    if (userId) {
      getAndSaveToken();
    }
  }, [userId]);
      
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

            }catch(error: unknown){
              console.error('Error fetching user:', error);
            }
          }
          fetchUsers();
      }
  }, [dispatch, location.pathname, token, userId]);

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
  }, [userId, familyId, dispatch, location.pathname]);

  return (
    <>
    
      <div className='App'>
        <Toaster position='top-right'/>
        <Routes>
          <Route path='/' element={<Login />}/>
          <Route path='/signup' element={<Signup />}/>
          <Route path='/landingPage' element={<LandingPage />}/>
          <Route path='/dashboard/*' element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute> } />
          <Route path='/addMembersQuestion' element={ <ProtectedRoute> <AddMembersBackground ChildComponent={AddMembersQuestion} /> </ProtectedRoute> } />
          <Route path='/addMembers' element={ <ProtectedRoute> <AddMembersBackground ChildComponent={AddMembersForm} /> </ProtectedRoute> } />
          <Route path='/admin/*' element={<SidebarProvider><ProtectedAdminRoute><Admin /></ProtectedAdminRoute></SidebarProvider>}/>
          <Route path='/changePassword' element={ <ProtectedRoute> <ChangePasswordPage /> </ProtectedRoute> } />
        </Routes>
      </div>
    </>
  )
}

export default App

import './styles/App.css';
import Login from './pages/Login';
import { Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

function App() {

  return (
    <>
      <div className='App'>
        <Routes>
          <Route path='/' element={<Login />}/>
          <Route path='/signup' element={<Signup />}/>
          <Route path='/dashboard' element={<ProtectedRoute element={<Navbar userId={''} />} />} /> 
        </Routes>
      </div>
    </>
  )
}

export default App

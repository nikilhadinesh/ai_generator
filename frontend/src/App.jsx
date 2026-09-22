import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import TextToVideo from './pages/TextToVideo';
import ImageToVideo from './pages/ImageToVideo';
import TextToImage from './pages/TextToImage';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Example axios call:
axios.get(`${API_BASE_URL}/api/users`)
  .then(res => console.log(res.data));


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/text-to-video" element={<ProtectedRoute><TextToVideo /></ProtectedRoute>} />
          <Route path="/image-to-video" element={<ProtectedRoute><ImageToVideo /></ProtectedRoute>} />
          <Route path="/text-to-image" element={<ProtectedRoute><TextToImage /></ProtectedRoute>} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
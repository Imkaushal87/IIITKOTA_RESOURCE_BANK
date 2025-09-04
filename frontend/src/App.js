import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const Navigation = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="bg-white shadow-md py-3 px-8 flex justify-between items-center">
      <div className="text-lg font-bold text-blue-600">IIIT Kota Resource Bank</div>
      <div className="flex space-x-6">
        <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
          Home
        </Link>
        {isAuthenticated && (
          <Link to="/upload" className="text-gray-700 hover:text-blue-600 transition-colors">
            Upload
          </Link>
        )}
        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-600 transition-colors">
              Login
            </Link>
            <Link to="/signup" className="text-gray-700 hover:text-blue-600 transition-colors">
              Signup
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

const AppContent = () => {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

function App() {
  return <AppContent />;
}

export default App;

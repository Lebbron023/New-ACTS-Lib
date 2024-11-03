import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
//auth
import Login from "./auth/Login";
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import RegisterAccount from "./auth/RegisterAccount"
//user
import Resources from "./user/pages/Resources";
import Home from "./user/pages//Home";
import UpComingEvents from "./user/pages/UpComingEvents";
import Account from "./user/pages/Account";
//admin
import AdminResources from './admin/pages/AdminResources';
import AdminHome from "./admin/pages/AdminHome";
import AdminActivities from "./admin/pages/adminActivities";

function App() {
  return (
      <AuthProvider>
          <BrowserRouter>
              <div className="scrollbar-hidden">
                  <Routes>
                      <Route index element={<Login />} /> {/* Public route */}
                      <Route path="/login" element={<Login />} /> {/* Public route */}
                      <Route path="/register" element={<RegisterAccount />} /> {/* Public route */}
                      <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
                      <Route path="/account" element={<ProtectedRoute element={<Account />} />} />
                      <Route path="/resources" element={<ProtectedRoute element={<Resources />} />} />
                      <Route path="/events" element={<ProtectedRoute element={<UpComingEvents />} />} />
                      {/* ADMIN ROUTES  */}
                      <Route path="/adminHome" element={<ProtectedRoute element={<AdminHome />} />} />
                      <Route path="/adminResources" element={<ProtectedRoute element={<AdminResources />} />} />
                      <Route path="/adminActivities" element={<ProtectedRoute element={<AdminActivities />} />} />
                  </Routes>
              </div>
          </BrowserRouter>
      </AuthProvider>
  );
}

export default App;

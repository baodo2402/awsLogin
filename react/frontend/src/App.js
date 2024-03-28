import { BrowserRouter, NavLink, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Home from "./Home";
import Register from "./Register";
import Login from "./Login";
import PremiumContent from "./PremiumContent";
import ChangeInfo from "./ChangeInfo";
import Profile from "./Profile";
import Calendar from "./service/Calendar";
import CalendarOptions from "./service/CalendarOptions";
import ForgetPassword from "./ForgetPassword";
import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";
import ResetPassword from "./ResetPassword";
import CalendarSearch from "./CalendarSearch";
import StaffsManagement from "./StaffsManagement";
import './index.css'
import React, { useState, useEffect } from "react";
import { getUser, getToken, setUserSession, resetUserSession } from "./service/AuthService";
import axios from "axios";
import AccessInformation from "./service/AccessInformation";
import AddOrEditJobs from "./AddOrEditJobs";

const { requestConfig ,verifyTokenAPIURL } = AccessInformation;

function App() {
  
  
  const [isAuthenticating, setAuthenicating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token === 'undefined' || token === undefined || token === null || !token ) {
      setIsAuthenticated(false);
      setAuthenicating(false);
      return;

    }

    const requestBody = {
      user: getUser(),
      token: token
    }

    axios.post(verifyTokenAPIURL, requestBody, requestConfig).then(response => {
      setUserSession(response.data.user, response.data.token);
      setAuthenicating(false);
      setIsAuthenticated(true);
    }).catch(() => {
      resetUserSession();
      setAuthenicating(false);
    })
  }, [isAuthenticating]);

  const token = getToken();

  return (
    <div className="App">
      <BrowserRouter>
        {isAuthenticating && token ? (
          <div className="content">Authenticating...</div>
        ) : (
          <>
            {/* Header */}
            <Header />

            {/* Routes */}
            <Routes>
              <Route path="/" element={<Home />} />

              <Route element={<PublicRoute />}>
                <Route path="/register" element={<Register />} />
              </Route>
                
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
              </Route>
              

              <Route element={<PrivateRoute isAuthenticated={isAuthenticating}/>}>
                <Route
                  path="/premium-content" element={<PremiumContent />}
                />
              </Route> 

              <Route element={<PrivateRoute isAuthenticated={isAuthenticating}/>}>
                <Route path="/profile" element={<Profile />}/>
              </Route>
              <Route element={<PrivateRoute isAuthenticated={isAuthenticating}/>}>
                <Route path="/changeInfo" element={<ChangeInfo />}/>
              </Route>

              <Route element={<PrivateRoute isAuthenticated={isAuthenticating}/>}>
                <Route path="/calendar" element={<Calendar />} />
              </Route>

              <Route element={<PrivateRoute isAuthenticated={isAuthenticating}/>}>
                <Route path="/calendaroption" element={<CalendarOptions />} />
              </Route>

              <Route element={<PublicRoute />}>
                <Route path="/forgetpassword" element={<ForgetPassword />} />
              </Route>

              <Route element={<PublicRoute />}>
                <Route path="/resetpassword" element={<ResetPassword />} />
              </Route>
    
              <Route element={<PrivateRoute isAuthenticated={isAuthenticating}/>}>
                <Route path="/calendarsearching" element={<CalendarSearch />} />
              </Route>

              <Route element={<PrivateRoute isAuthenticated={isAuthenticating}/>}>
                <Route path="/staff-management" element={<StaffsManagement />} />
              </Route>

              <Route element={<PrivateRoute isAuthenticated={isAuthenticating}/>}>
                <Route path="/add-or-edit-jobs" element={<AddOrEditJobs />} />
              </Route>
            
            </Routes>
          </>
        )}
      </BrowserRouter>
    </div>
  );
}

function Header() {
  const navigate = useNavigate();
  const location = useLocation(); // Hook for location
  // Define an array of routes where the header should be displayed
  const routesWithHeader = ["/", "/register", "/login"];

  // Check if the current route is in the array
  const displayHeader = routesWithHeader.includes(location.pathname);

  const handleHome = () => {
    navigate('/')
  }
  
  const handleRegister = () => {
    navigate('/register')
  }
  
  const handleLogin = () => {
    navigate('/login')
  }
  return (
    displayHeader && (
      <div className="header">
        <div className="background"></div>
         <input type="radio" name="hi" id="home" onChange={handleHome} defaultChecked/>
        <label htmlFor="home" id="home-label" >
          Home
        </label>

        <input type="radio" name="hi" id="register" onChange={handleRegister} />
        <label htmlFor="register" id="register-label">
          Register
        </label>

        <input type="radio" name="hi" id="login" onChange={handleLogin} />
        <label htmlFor="login" id="login-label" >
          Login
        </label>
        <span className="indicator"></span>
      </div>
    )
  );
}
export default App;
import { BrowserRouter, NavLink, Routes, Route, useLocation} from "react-router-dom";
import Home from "./Home";
import Register from "./Register";
import Login from "./Login";
import PremiumContent from "./PremiumContent";
import ChangeInfo from "./ChangeInfo";
import Profile from "./Profile";
import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";
import React, { useState, useEffect } from "react";
import { getUser, getToken, setUserSession, resetUserSession } from "./service/AuthService";
import axios from "axios";

const verifyTokenAPIURL = 'https://lyg1apc3wl.execute-api.ap-southeast-2.amazonaws.com/prod/verify';
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

    const requestConfig = {
      headers: {
          'x-api-key': 'EmYB7EcYzn2NK1dUkD2kK8MA18r5dp6tQ7wB7U1d'
      }
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
  
  // if(token) {
  //   setIsAuthenticated(true);
  // } else {
  //   setIsAuthenticated(false);
  // }

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
              
            </Routes>
          </>
        )}
      </BrowserRouter>
    </div>
  );
}

function Header() {
  const location = useLocation(); // Hook for location
  // Define an array of routes where the header should be displayed
  const routesWithHeader = ["/", "/register", "/login"];

  // Check if the current route is in the array
  const displayHeader = routesWithHeader.includes(location.pathname);

  return (
    displayHeader && (
      <div className="header">
        <NavLink activeclassname="active" to="/">
          Home
        </NavLink>
        <NavLink activeclassname="active" to="/register">
          Register
        </NavLink>
        <NavLink activeclassname="active" to="/login">
          Login
        </NavLink>
      </div>
    )
  );
}
export default App;
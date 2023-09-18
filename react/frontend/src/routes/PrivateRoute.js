// import React from 'react';
// import { Route, Navigate } from 'react-router-dom';
// import { getToken } from '../service/AuthService';

// const PrivateRoute = ({ element: Element, ...rest }) => {
//   return (
//     <Route
//       {...rest}
//       element={
//         getToken() ? (
//           <Element />
//         ) : (
//           // Redirect to the login route using the Navigate component
//           <Navigate to="/login" replace={true} />
//         )
//       }
//     />
//   );
// };

// export default PrivateRoute;
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getToken } from '../service/AuthService';

const PrivateRoute = ({isAuthenticated}) => {
  return !isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;

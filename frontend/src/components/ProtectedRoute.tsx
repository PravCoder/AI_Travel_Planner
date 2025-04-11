import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { TokenHelper } from "../utils/TokenHelper";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  console.log("ProtectedRoute: Checking token...");
  const token = TokenHelper.getToken();
  const location = useLocation();

  if (!token || (token && TokenHelper.isTokenExpired(token))) {
    console.log(
      "ProtectedRoute: Token invalid or expired, redirecting to login"
    );
    TokenHelper.removeToken();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log("ProtectedRoute: Token valid, rendering protected content");
  return children;
};

export default ProtectedRoute;
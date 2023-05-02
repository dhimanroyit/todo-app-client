import React, { Suspense, lazy } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import PrivateOutlet from "./PrivateOutlet";
import { useAuthContext } from "../context/authContext";

const LoginPage = lazy(() => import("../pages/LoginPage"));
const SignUpPage = lazy(() => import("../pages/SignUpPage"));
const TaskPage = lazy(() => import("../pages/TaskPage"));

export default function RouteApp() {
  const { loginUser } = useAuthContext();
  return (
    <Suspense fallback={<h3>Loading</h3>}>
      <Routes>
        <Route
          path="/"
          element={
            loginUser ? <Navigate to="/task" /> : <Navigate to="/login" />
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/" element={<PrivateOutlet />}>
          <Route path="/task" element={<TaskPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

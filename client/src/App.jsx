
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Signup from "./pages/signup.jsx";
import Login from "./pages/login.jsx";
import Dashboard from "./pages/Dashboard.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>

                    {/* Home Route */}
                    <Route
                        path="/"
                        element={<Navigate to="/dashboard" replace />}
                    />

                    {/* Signup Route */}
                    <Route
                        path="/signup"
                        element={<Signup />}
                    />

                    {/* Login Route */}
                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    {/* Protected Dashboard Route */}
                    <Route element={<ProtectedRoute />}>
                        <Route
                            path="/dashboard"
                            element={<Dashboard />}
                        />
                    </Route>

                    {/* 404 / Unknown Route */}
                    <Route
                        path="*"
                        element={<Navigate to="/" replace />}
                    />

                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;

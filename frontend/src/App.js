import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UserProductPage from "./pages/UserProductPage";
import AdminProductPage from "./pages/AdminProductPage";

const App = () => {
    return (
        <Router>
            <nav>
                <Link to="/">User View</Link> | <Link to="/admin">Admin View</Link>
            </nav>
            <Routes>
                <Route path="/" element={<UserProductPage />} />
                <Route path="/admin" element={<AdminProductPage />} />
            </Routes>
        </Router>
    );
};

export default App;

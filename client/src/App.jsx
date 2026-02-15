import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ListPage from "./pages/List";
import Detail from "./pages/Detail";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Favorites from "./pages/Favorites";

import AnimatedBackground from "./components/AnimatedBackground";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <>
      <AnimatedBackground />
      <Sidebar />
      <div style={{ paddingLeft: '0', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:slug" element={<ListPage />} />
          <Route path="/place/:id" element={<Detail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </>
  );
}

export default App;

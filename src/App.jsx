import React, { useContext, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeContext } from "./context/ThemeContext";
import Sidebar from "./components/Sidebar";
import MapView from "./components/MapView";
import TravelList from "./components/TravelList";
import { Sun, Moon, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Profile from "./pages/Profile";
import Login from "./pages/Login";

function App() {

  const { dark, setDark } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <Routes>
      <Route path="/profile" element={<Profile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <div className={`min-h-screen flex flex-col ${dark ? 'dark bg-gray-900' : 'bg-gray-100'}`}>

          <nav className={`${dark ? 'bg-gray-800' : 'bg-blue-600'} text-white p-4 flex justify-between items-center`}>
            <h1 className="text-xl font-bold">🌍 Trip Planner</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                onClick={() => navigate('/profile')}
                className={`${dark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-400'} px-3 py-2 rounded-full transition-colors`}
                style={{ border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Profile"
              >
                <User size={20} />
              </button>

              <button
                onClick={() => setDark(!dark)}
                className={`${dark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white text-blue-600 hover:bg-gray-100'} px-3 py-2 rounded flex items-center gap-2 transition-colors`}
                style={{ border: 'none', cursor: 'pointer' }}
              >
                {dark ? <Sun size={18} /> : <Moon size={18} />}
                <span className={dark ? 'text-white' : ''}>{dark ? 'Light' : 'Dark'} Mode</span>
              </button>
            </div>
          </nav>

          <div className="flex flex-1">
            <Sidebar setSelectedOption={setSelectedOption} />

            <div className="flex-1 p-2" style={{ position: 'relative' }}>
              <MapView selectedOption={selectedOption} />
              <TravelList selectedOption={selectedOption} />
            </div>
          </div>

        </div>
      } />
    </Routes>
  );
}

export default App;

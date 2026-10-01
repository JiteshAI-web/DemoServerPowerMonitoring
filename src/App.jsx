
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useMqtt } from './store/Mqtt';
import { replace, useNavigate } from 'react-router-dom';


import TopBar from "./components/TopBar"
import Header from './components/Header';
import WelcomeCard from './components/WelcomeCard';
import DashboardContent from './components/DashboardContent';
import Footer from './components/Footer';

const App = () => {
  const { eventLogs, passedMessage, alertStatus, receivedWifiStatus, alertmessage } = useMqtt();
  const hasPostedRef = useRef(false);
  const apiUrl = import.meta.env.VITE_API_URL
  const storedData = localStorage.getItem('loggedData');
  const userData = storedData ? JSON.parse(storedData) : null;
  const user_name = userData?.User_name;
  const [wifiStatus, setWifiStatus] = useState('ALIVE');
  const navigate = useNavigate();

  //  🔁 heartbeat logic (static mode defaults to ALIVE)
  useEffect(() => {
    setWifiStatus("ALIVE");
    const interval = setInterval(() => {
      if (!receivedWifiStatus) {
        setWifiStatus("ALIVE");
        return;
      }

      const diff = Date.now() - receivedWifiStatus;
      setWifiStatus(diff <= 10000 ? "ALIVE" : "ALIVE");
    }, 1000);

    return () => clearInterval(interval);
  }, [receivedWifiStatus]);
  
  const handleLogout = () => {
    localStorage.removeItem('loggedData');
    navigate("/login", {replace: true});
  };
  return(
    <div className='h-screen bg-gray-50 py-6 flex flex-col gap-4'>
      <TopBar wifiStatus={wifiStatus} handleLogout={handleLogout}/>
      <Header passedMessage={passedMessage} alertStatus={alertStatus}/>
      <WelcomeCard user_name={user_name}/>
      <DashboardContent />
      <Footer />
    </div>
  );
}

export default App;
# 🚀 Power Monitoring Dashboard 2026  
### Standard Operating Procedure (SOP)

---

## 📌 1. Project Overview

The **Power Monitoring Dashboard 2026** is a real-time web application designed to monitor aeration devices and analyze electrical performance. The system provides **live phase-wise data (R, Y, B)**, tracks session-based operations, monitors energy consumption, and handles alerts efficiently.

This application integrates frontend, backend APIs, and MQTT-based real-time communication to ensure seamless monitoring and control.

---

## 🏗️ 2. System Architecture

### 🔹 Frontend
- React.js (Vite)
- Tailwind CSS
- Chart.js (Data Visualization)

### 🔹 Backend
- REST APIs for:
  - User Authentication
  - Session Management
  - Abort Operations

### 🔹 Real-Time Communication
- MQTT over WebSocket (WSS)
- Secure broker connection

---

## ⚙️ 3. Installation & Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/Power-Monitoring-Dashboard-2026.git
cd Power-Monitoring-Dashboard-2026

Step 2: Install Dependencies
npm install

Step 3: Install Required Libraries
npm install axios react-router-dom mqtt chart.js react-chartjs-2

Step 4: Configure Environment Variables
Create a .env file in the root directory and add:
VITE_API_URL=http://your-backend-api-url

Step 5: Start Development Server
npm run dev

Step 6: Open Application
http://localhost:5173

🔐 4. Authentication Workflow
User enters username and password.
Backend validates credentials.
A token is generated and returned.
Token is stored in browser localStorage.
Protected routes verify authentication before granting access.

📡 5. MQTT Integration
🔹 Connection Details
Protocol: WSS (WebSocket Secure)
Broker: mqttbroker.bc-pl.com
Port: 443
Path: /mqtt
🔹 Subscribed Topics
Device Status
Alerts
Heartbeat
Session Status
🔹 Published Topics
Session Scheduling
Abort Commands


🟢 Step 1: User Login
User logs into the system
Token stored locally
Redirected to dashboard
🟢 Step 2: Start Session
User selects:
Start Time
End Time
Device
System:
Publishes MQTT message
Calls backend API
🟢 Step 3: Monitor Session
Real-time updates via MQTT
Backend polling updates:
Status
Energy
🟢 Step 4: Abort Session
User triggers abort
MQTT + API request sent
🟢 Step 5: Reset Dashboard
Clears UI
Resets MQTT data

7. Data Handling
MQTT messages received in structured JSON format
Data parsed and stored in application state
Only recent data is used for visualization
Charts update dynamically in real time

8. Features
Real-time power monitoring
Phase-wise data visualization (R, Y, B)
Session scheduling and tracking
Energy consumption monitoring
MQTT-based live communication
Alert system with auto-clear functionality
Device connectivity status (WiFi heartbeat)
Secure authentication system
Responsive UI design

9. UI & Design
Built using Tailwind CSS
Responsive layout 
Clean and modern dashboard interface

Color Indicators:
Green → Connected / Active
Red → Error / Alert
Yellow → Pending

10. Project Structure
src/
│
├── components/        # UI Components (Header, Footer, Charts, TopBar)
├── pages/             # Pages (Login, R&D)
├── store/             # MQTT Context Provider
├── service/           # API Services
├── App.jsx            # Main Application
├── main.jsx           # Entry Point


11. Protected Routes
Uses token stored in localStorage
Unauthorized users redirected to login page
Ensures secure access to dashboard

12. Important Notes
MQTT broker must be active and reachable
Backend API server must be running
Internet connection is required
Authentication token is mandatory
Environment variables must be configured correctly

13.Author
Satyaprakash Pradhan
Bariflo Cybernetics


14.Version History
Version 1.0
Real-time dashboard implementation
MQTT integration
Session management system
Authentication and alert handling
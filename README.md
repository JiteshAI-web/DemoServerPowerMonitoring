Power Monitoring Dashboard 2026 – SOP (Standard Operating Procedure)

1. Project Overview
This application is designed to monitor aeration devices in real time. It displays phase-wise power data (R, Y, B), tracks session-based energy consumption, and provides live updates using MQTT communication. The system also includes authentication, alert handling, and device status monitoring.

2. System Architecture
The frontend of the application is built using React.js with Vite and styled using Tailwind CSS. Data visualization is handled using Chart.js.
The backend provides REST APIs for authentication and session management.
Real-time communication is handled using MQTT over WebSocket protocol.

3. Installation and Setup Procedure

Step 1: Clone the repository from GitHub
Command:
git clone https://github.com/your-username/Power-Monitoring-Dashboard-2026.git

Step 2: Navigate to the project directory
Command:
cd Power-Monitoring-Dashboard-2026

Step 3: Install dependencies
Command:
npm install

Step 4: Install required libraries (if not already installed)
Command:
npm install axios react-router-dom mqtt chart.js react-chartjs-2

Step 5: Setup environment variables
Create a .env file in the root directory and add:
VITE_API_URL=http://your-backend-api-url

Step 6: Start the development server
Command:
npm run dev

Step 7: Open the application in browser
http://localhost:5173

4. Authentication Procedure
1. The user enters login credentials (username and password).
2. The system validates credentials through the backend API.
3. Upon successful authentication, a token is generated and stored in the browser local storage.
4. Protected routes ensure that only authenticated users can access the dashboard.

5. MQTT Integration Procedure
The application connects to an MQTT broker using WebSocket protocol.

Example connection (concept):
ws://your-mqtt-broker-url:port/mqtt

It subscribes to multiple topics for receiving real-time data such as:
- Device status
- Alerts
- Session updates
- Heartbeat signals

It publishes messages to topics for:
- Scheduling sessions
- Aborting sessions

6. Application Workflow

Step 1: User Login
The user logs into the system using valid credentials. After login, access to the dashboard is granted.

Step 2: Start Session
The user selects start time, end time, and the aeration device. On submission:
- A scheduling message is sent via MQTT
- A session creation request is sent to the backend API

Step 3: Monitor Session
The system continuously receives real-time data through MQTT.
At the same time, it polls the backend API at regular intervals to update:
- Session status
- Energy consumption

Step 4: Abort Session
If required, the user can abort the session.
The system sends both MQTT and API requests to stop the session immediately.

Step 5: Reset Dashboard
The dashboard can be reset to clear all displayed data and restore the initial state.

7. Data Handling Procedure
Incoming MQTT messages contain device data in structured format.
This data is parsed and stored in the application state.
The UI updates dynamically based on the latest data.
Charts are refreshed in real time to reflect updated values.

8. Features
- Real-time power monitoring dashboard
- Phase-wise data visualization (R, Y, B)
- Session scheduling and tracking
- Energy consumption monitoring
- MQTT-based live communication
- Alert system with automatic clearing
- Device connectivity status (WiFi/heartbeat)
- Secure authentication system

9. UI and Styling Procedure
The application uses Tailwind CSS for styling.
Layouts are designed using Flexbox and Grid systems.
The UI is responsive and adapts to different screen sizes.
Color indicators are used for better visualization:
- Green indicates active or connected state
- Red indicates alerts or errors

10. Project Structure Overview
The project is organized into multiple folders including components, pages, services, and store modules.
Each component is responsible for a specific functionality such as header, dashboard, charts, authentication, and MQTT handling.

11. Deployment Procedure

Step 1: Build the project
Command:
npm run build

Step 2: Preview build locally
Command:
npm run preview

Step 3: Deploy the dist/ folder to server

Note:
Ensure backend API and MQTT broker are running before deployment.

12. Important Notes
- The MQTT broker must be active and reachable
- The backend API server must be running
- Internet connectivity is required
- Authentication token is mandatory for accessing protected routes

13. Author
Satyaprakash Pradhan
Bariflo Cybernetics

14. Version History
Version 1.0 includes:
- Real-time dashboard implementation
- MQTT integration
- Session management system
- Authentication and alert features
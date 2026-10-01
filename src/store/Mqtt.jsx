import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import mqtt from "mqtt";

const MqttContext = createContext();

const initialMockTelemetry = [
  {
    time: new Date().toISOString(),
    value: JSON.stringify({
      Dev1: { R: "232.4", Y: "229.8", B: "231.0" },
      Dev2: { R: "226.5", Y: "230.1", B: "228.4" }
    })
  }
];

export const MqttProvider = ({ children }) => {
  const [client, setClient] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("connected");
  const [eventLogs, setEventLogs] = useState([]);
  const [passedMessage, setPassedMessage] = useState(null);
  const [alertStatus, setAlertStatus] = useState(null);
  const [receivedWifiStatus, setReceivedWifiStatus] = useState(Date.now());
  const [alertmessage, setAlertMessage] = useState("");
  const alertTimeoutRef = useRef(null);

  const [loggedUserData, setLoggedUserData] = useState(localStorage.getItem("loggedData"));

  const [data, setData] = useState(() => ({
    "pomon/BFL_PomonA001/rnd/status": initialMockTelemetry,
  }));

  const lastDeviceRef = useRef(null);

  const storeDataInLS = (userData) => {
    setLoggedUserData(userData);
    return localStorage.setItem("loggedData", JSON.stringify(userData));
  };

  useEffect(() => {
    const wifiInterval = setInterval(() => {
      setReceivedWifiStatus(Date.now());
    }, 5000);

    let mqttClient;
    try {
      mqttClient = mqtt.connect({
        hostname: "mqttbroker.bc-pl.com",
        port: 443,
        protocol: "wss",
        path: "/mqtt",
        username: "mqttuser",
        password: "Bfl@2025",
        clientId: `mqtt_${Math.random().toString(16).slice(4)}`,
        reconnectPeriod: 10000,
        connectTimeout: 5000
      });

      const handleStatusChange = (newStatus) => {
        setConnectionStatus(newStatus);
      };

      mqttClient.on("connect", () => {
        handleStatusChange("connected");
        mqttClient.subscribe([
          "pomon/BFL_PomonA001/rnd/status",
          "pomon/BFL_PomonA001/rnd/alert",
          "pomon/BFL_PomonA001/device_status",
          "pomon/BFL_PomonA001/heartbeat",
          "pomon/BFL_PomonA001/rnd/abort"
        ]);
      });

      mqttClient.on("message", (topic, message) => {
        const messageStr = message.toString();

        const lines = messageStr
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0);

        const newMessages = lines.map((line) => ({
          time: new Date().toISOString(),
          value: line,
        }));

        setData((prevData) => {
          const existing = prevData[topic] || [];
          return {
            ...prevData,
            [topic]: [...existing, ...newMessages].slice(-4),
          };
        });

        if (topic === "pomon/BFL_PomonA001/heartbeat") {
          setReceivedWifiStatus(Date.now());
        }
      });

      setClient(mqttClient);
    } catch (e) {
      console.warn("MQTT connection unhandled error, running in static mode", e);
    }

    return () => {
      clearInterval(wifiInterval);
      if (mqttClient) {
        try { mqttClient.end(); } catch (err) {}
      }
    };
  }, []);

  const publishMessage = (topic, message, retain = false) => {
    if (client && client.connected) {
      try {
        client.publish(topic, message, { retain });
      } catch (err) {}
    }

    // Static mode local updates
    if (topic === "pomon/BFL_PomonA001/rnd/schedule") {
      try {
        const parsed = JSON.parse(message);
        setPassedMessage(parsed);

        // Generate static random telemetry readings on schedule publish
        const mockReading = {
          time: new Date().toISOString(),
          value: JSON.stringify({
            Dev1: {
              R: (220 + Math.random() * 20).toFixed(1),
              Y: (220 + Math.random() * 20).toFixed(1),
              B: (220 + Math.random() * 20).toFixed(1)
            },
            Dev2: {
              R: (220 + Math.random() * 20).toFixed(1),
              Y: (220 + Math.random() * 20).toFixed(1),
              B: (220 + Math.random() * 20).toFixed(1)
            }
          })
        };

        setData((prev) => ({
          ...prev,
          "pomon/BFL_PomonA001/rnd/status": [
            ...(prev["pomon/BFL_PomonA001/rnd/status"] || []),
            mockReading
          ].slice(-4)
        }));
      } catch (err) {
        console.error("Failed to parse R&D schedule message:", err);
      }
    }
  };

  const clearTopicData = (topic) => {
    setData((prevData) => ({
      ...prevData,
      [topic]: [],
    }));
  };

  return (
    <MqttContext.Provider
      value={{
        data,
        publishMessage,
        clearTopicData,
        alertStatus,
        connectionStatus,
        eventLogs,
        passedMessage,
        setPassedMessage,
        receivedWifiStatus,
        loggedUserData,
        storeDataInLS,
        alertmessage
      }}
    >
      {children}
    </MqttContext.Provider>
  );
};
export const useMqtt = () => useContext(MqttContext);

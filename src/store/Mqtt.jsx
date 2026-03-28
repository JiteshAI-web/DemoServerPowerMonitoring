import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import mqtt from "mqtt";

const MqttContext = createContext();

export const MqttProvider = ({ children }) => {
  const [client, setClient] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [eventLogs, setEventLogs] = useState([]);
  const [passedMessage, setPassedMessage] = useState(null);
  const [alertStatus, setAlertStatus] = useState(null);
  const [receivedWifiStatus, setReceivedWifiStatus] = useState(null);
  const [alertmessage, setAlertMessage] = useState("")
  const alertTimeoutRef = useRef(null);

  const [loggedUserData, setLoggedUserData] = useState(localStorage.getItem("loggedData"))

  const [data, setData] = useState(() => ({
    "pomon/BFL_PomonA001/rnd/status": [],
  }));

  const lastDeviceRef = useRef(null);

  const storeDataInLS = (userData) => {
    setLoggedUserData(userData);
    return localStorage.setItem("loggedData", JSON.stringify(userData))
  }
  useEffect(() => {

    const mqttClient = mqtt.connect({
      hostname: "mqttbroker.bc-pl.com",
      port: 443,
      protocol: "wss",
      path: "/mqtt",
      username: "mqttuser",
      password: "Bfl@2025",
      clientId: `mqtt_${Math.random().toString(16).slice(4)}`,
      reconnectPeriod: 5000,
    });

    const handleStatusChange = (newStatus) => {
      if (connectionStatus !== newStatus) {
        setConnectionStatus(newStatus);
        console.log(`MQTT: ${newStatus}`);
      }
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

    mqttClient.on("reconnect", () => {
      handleStatusChange("reconnecting");
    });

    mqttClient.on("offline", () => {
      handleStatusChange("disconnected");
    });

    mqttClient.on("error", (err) => {
      // console.error("MQTT error:", err);
    });

    mqttClient.on("message", (topic, message) => {
      const messageStr = message.toString();
      // console.log(`📩 ${topic}:`, messageStr); 



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

      const allowedLogs = [
        "New R&D event scheduled.",
        "Activated Aeration Device",
        "Deactivated Aeration Device",
      ];

      lines.forEach((line) => {
        if (
          topic === "pomon/BFL_PomonA001/rnd/status" &&
          allowedLogs.some((msg) => line.includes(msg))
        ) {
          setEventLogs((prev) => [
            ...prev,
            { time: new Date().toISOString(), message: line },
          ]);
        }
      });


      // Inside MQTT message handler:
      if (topic === "pomon/BFL_PomonA001/heartbeat") {
        const message = messageStr.trim();
        if (message === "ALIVE") {
          setReceivedWifiStatus(Date.now());
        }
      }

      // 
      if (topic === "pomon/BFL_PomonA001/rnd/alert") {
        let alertmessage = messageStr.trim().toLowerCase();
        setAlertMessage(alertmessage)
        console.log("📢 Alert data received:", alertmessage);

      }

      if (topic === "pomon/BFL_PomonA001/device_status") {
        let formatted = messageStr.trim().toLowerCase();
        setAlertStatus(formatted);
        console.log("📢 Alert data received:", formatted);

        try {
          const jsonPart = formatted.replace(/^alert status:\s*/i, "");
          const payload = JSON.parse(jsonPart);

          let deviceLabel = payload.adc;
          if (payload.adc === "dev1") {
            deviceLabel = "Device One";
          } else if (payload.adc === "dev2") {
            deviceLabel = "Device Two";
          }

          const phase = payload.phase.toUpperCase();
          formatted = `${deviceLabel}, ${phase}-${payload.value}`;

          if (
            (payload.adc === "dev1" || payload.adc === "dev2") &&
            lastDeviceRef.current !== payload.adc
          ) {
            lastDeviceRef.current = payload.adc;
          }
        } catch {
          // fallback to raw string
        }

        // Update the formatted alert status
        setAlertStatus(formatted);
        console.log("🚨 Alert status updated:", formatted);

        // 🆕 Clear alert after 10 seconds
        if (alertTimeoutRef.current) {
          clearTimeout(alertTimeoutRef.current);
        }

        alertTimeoutRef.current = setTimeout(() => {
          setAlertStatus(null);
          console.log("🕓 Alert cleared after 10 seconds");
        }, 10000);
      }

    });

    setClient(mqttClient);

    return () => {
      mqttClient.end();
      handleStatusChange("disconnected");
    };
  }, []);

  const publishMessage = (topic, message, retain = false) => {
    if (client && client.connected) {
      client.publish(topic, message, { retain });
      console.log(`🚀 Published to ${topic}:`, message);

      if (topic === "pomon/BFL_PomonA001/rnd/schedule") {
        try {
          const parsed = JSON.parse(message);
          setPassedMessage(parsed);
        } catch (err) {
          console.error("Failed to parse R&D schedule message:", err);
        }
      }
    } else {
      console.warn("❌ MQTT client not connected");
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

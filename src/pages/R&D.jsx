import React, { useState, useEffect } from 'react';
import { useMqtt } from '../store/Mqtt';
import axios from 'axios';
import {
  createSession,
  getSessionById,
  abortSession
} from '../service/Api';

const RnD = () => {

  // =========================
  // 🔹 STATE MANAGEMENT
  // =========================
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedPart, setSelectedPart] = useState('Part One');
  const [result, setResult] = useState('');
  const [status, setStatus] = useState('IDLE');
  const [sessionId, setSessionId] = useState(null);
  const [energy, setEnergy] = useState(0);

  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: ""
  });

  const { publishMessage, setPassedMessage } = useMqtt();

  // =========================
  // 🔹 API: SAVE SESSION
  // =========================
  const saveSession = async (data) => {
    try {
      const response = await createSession(data);
      console.log('API Response:', response);

      const sessionData = response.data;

      setSessionId(sessionData.id);
      setStatus(sessionData.status);
      setEnergy(sessionData.total_wh);

      setPopup({
        show: true,
        message: response.message,
        type: "success"
      });

    } catch (error) {
      console.log('API error:', error);

      setStatus('Error');
      setPopup({
        show: true,
        message: error.start_time || "Something went wrong",
        type: "error"
      });
    }
  };

  // =========================
  // 🔹 ABORT SESSION
  // =========================
  const handleAbort = async (sessionId) => {
    if (!sessionId) {
      alert("No active session");
      return;
    }

    try {
      const response = await abortSession(sessionId);
      console.log(response);
      alert("Session Aborted");
    } catch (error) {
      console.error(error);
      alert("Abort Failed");
    }
  };

  // =========================
  // 🔹 MAIN FUNCTION
  // =========================
  const calculateTimeDifference = async () => {

    // Validation
    if (!startTime || !endTime) {
      setResult('Please select both time');
      setStatus('Error');
      return;
    }

    // Time Calculation
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    const startTotalSeconds = (startHours * 60 + startMinutes) * 60;
    const endTotalSeconds = (endHours * 60 + endMinutes) * 60;

    let differenceInSeconds = endTotalSeconds - startTotalSeconds;

    if (differenceInSeconds < 0) {
      differenceInSeconds += 24 * 60 * 60;
    }

    setResult(`${differenceInSeconds} sec`);
    setStatus('PENDING');

    // Mapping
    const partMap = {
      'Part One': 1,
      'Part Two': 2,
    };

    const deviceMap = {
      "Part One": "BFL_PomonA001",
      "Part Two": "BFL_PomonA001"
    };

    const mainMap = {
      "Part One": 1,
      "Part Two": 2
    };

    // Validation
    if (!selectedPart) {
      setStatus('Error');
      setResult('Please select Aeration');
      return;
    }

    const deviceId = deviceMap[selectedPart];
    const mainValue = mainMap[selectedPart];

    // Date formatting
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    const formatDateTime = (time) => {
      return `${today}T${time}:00+05:30`;
    };

    // MQTT Payload
    const mqttMessage = {
      start_time: startTime,
      duration: differenceInSeconds,
      main: mainValue
    };

    // API Payload
    const message = {
      device_id: deviceId,
      start_time: formatDateTime(startTime),
      end_time: formatDateTime(endTime),
      main: mainValue
    };

    // Send MQTT
    publishMessage(
      `pomon/${deviceId}/rnd/schedule`,
      JSON.stringify(mqttMessage)
    );

    // API Call
    await saveSession(message);
  };

  // =========================
  // 🔹 POLLING (STATUS + ENERGY)
  // =========================
  useEffect(() => {

    if (!sessionId) return;

    const interval = setInterval(async () => {
      try {
        const data = await getSessionById(sessionId);

        setEnergy(data.total_wh);
        setStatus(data.status);

        setPassedMessage({
          start_time: data.start_time,
          duration: data.duration
        });

        if (data.status === "COMPLETED") {
          clearInterval(interval);
        }

      } catch (error) {
        console.error(error);
      }
    }, 3000);

    return () => clearInterval(interval);

  }, [sessionId]);

  // =========================
  // 🔹 POPUP AUTO CLOSE
  // =========================
  useEffect(() => {
    if (popup.show) {
      const timer = setTimeout(() => {
        setPopup({
          show: false,
          message: "",
          type: ""
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [popup]);

  // =========================
  // 🔹 UI
  // =========================
  return (
    <div className="flex justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-6xl">

        {/* Popup */}
        {popup.show && (
          <div className='fixed top-5 left-1/2 transform -translate-x-1/2 z-50'>
            <div className={`px-4 py-2 shadow-lg rounded text-white ${
              popup.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}>
              {popup.message}
            </div>
          </div>
        )}

        {/* Table */}
        <table className="w-full border border-gray-300 text-sm text-center">

          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-2 border">Start Time</th>
              <th className="p-2 border">End Time</th>
              <th className="p-2 border">Select</th>
              <th className="p-2 border">Energy</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr className="bg-gray-50">

              {/* Start Time */}
              <td className="p-2 border">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full p-1 border rounded"
                  step="60"
                />
              </td>

              {/* End Time */}
              <td className="p-2 border">
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full p-1 border rounded"
                  step="60"
                />
              </td>

              {/* Select */}
              <td className="p-2 border">
                <select
                  value={selectedPart}
                  onChange={(e) => setSelectedPart(e.target.value)}
                  className="p-1 border rounded"
                >
                  <option value="">Select</option>
                  <option value="Part One">Aeration One</option>
                  <option value="Part Two">Aeration Two</option>
                </select>
              </td>

              {/* Energy */}
              <td className="p-2 border">
                <input
                  type="text"
                  value={energy}
                  className="text-center"
                />
              </td>

              {/* Status */}
              <td className="p-2 border">
                <span
                  className={`font-bold text-md ${
                    status === 'PROCESSING'
                      ? 'text-orange-500'
                      : status === 'COMPLETED'
                      ? 'text-green-500'
                      : status === 'PENDING'
                      ? 'text-yellow-500'
                      : status === 'Error'
                      ? 'text-red-500'
                      : status === 'ABORTED'
                      ? 'text-red-500'
                      : 'text-gray-500'
                  }`}
                >
                  {status}
                </span>
              </td>

              {/* Action */}
              <td className="p-2 border">
                {status === "PROCESSING" ? (
                  <button
                    onClick={() => handleAbort(sessionId)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 cursor-pointer"
                  >
                    Abort
                  </button>
                ) : (
                  <button
                    onClick={calculateTimeDifference}
                    className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 cursor-pointer"
                  >
                    Submit
                  </button>
                )}
              </td>

            </tr>
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default RnD;
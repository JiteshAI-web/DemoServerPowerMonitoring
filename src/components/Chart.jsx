import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { useMqtt } from '../store/Mqtt';

const LineCharts = () => {
  const { data, clearTopicData, publishMessage } = useMqtt();
  console.log("FULL DATA:", data); 
  const messages = data['pomon/BFL_PomonA001/rnd/status'] || [];
  console.log(messages);

  const chartRef1 = useRef(null);
  const chartRef2 = useRef(null);
  const chartInstance1 = useRef(null);
  const chartInstance2 = useRef(null);

  const [latestDev1Data, setLatestDev1Data] = useState({ R: 0, Y: 0, B: 0 });
  const [latestDev2Data, setLatestDev2Data] = useState({ R: 0, Y: 0, B: 0 });

  const [visibleDev1, setVisibleDev1] = useState({ R: true, Y: true, B: true });
  const [visibleDev2, setVisibleDev2] = useState({ R: true, Y: true, B: true });

  useEffect(() => {
    // ✅ ADD THIS HERE
  if (!messages.length) {
    setLatestDev1Data({ R: 0, Y: 0, B: 0 });
    setLatestDev2Data({ R: 0, Y: 0, B: 0 });
    return;
  }

    const parseMessage = (msg) => {
  try {
    const parsed = JSON.parse(msg.value);

    const results = [];

    if (parsed.Dev1) {
      results.push({
        device: 'Dev1',
        R: parseFloat(parsed.Dev1.R),
        Y: parseFloat(parsed.Dev1.Y),
        B: parseFloat(parsed.Dev1.B),
      });
    }

    if (parsed.Dev2) {
      results.push({
        device: 'Dev2',
        R: parseFloat(parsed.Dev2.R),
        Y: parseFloat(parsed.Dev2.Y),
        B: parseFloat(parsed.Dev2.B),
      });
    }

    return results;

  } catch (error) {
    console.error("JSON Parse Error:", error);
    return [];
  }
};

    const parsed = messages.flatMap(parseMessage);

    const latestDataDev1 = [...parsed].reverse().find((p) => p.device === 'Dev1');
    const latestDataDev2 = [...parsed].reverse().find((p) => p.device === 'Dev2');

    console.log(latestDataDev1)
    console.log(latestDataDev2)

    if (latestDataDev1) {
      setLatestDev1Data({ R: latestDataDev1.R, Y: latestDataDev1.Y, B: latestDataDev1.B });
    }

    if (latestDataDev2) {
      setLatestDev2Data({ R: latestDataDev2.R, Y: latestDataDev2.Y, B: latestDataDev2.B });
    }
  }, [messages]);

  const buildChart = (ref, instanceRef, label, values, visibilities) => {
    const labels = [];
    const data = [];
    const backgroundColors = [];

    if (visibilities.R) {
      labels.push('R');
      data.push(values.R);
      backgroundColors.push('#ef4444');
    }
    if (visibilities.Y) {
      labels.push('Y');
      data.push(values.Y);
      backgroundColors.push('#facc15');
    }
    if (visibilities.B) {
      labels.push('B');
      data.push(values.B);
      backgroundColors.push('#3b82f6');
    }

    if (instanceRef.current) instanceRef.current.destroy();

    instanceRef.current = new Chart(ref.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label,
            data,
            backgroundColor: backgroundColors,
            borderRadius: 4,
            barThickness: 30,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 800,
          easing: 'easeOutBounce',
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: { display: false },
        },
      },
    });
  };

  useEffect(() => {
    if (chartRef1.current && latestDev1Data) {
      buildChart(chartRef1, chartInstance1, 'Dev1', latestDev1Data, visibleDev1);
    }
  }, [latestDev1Data, visibleDev1]);

  useEffect(() => {
    if (chartRef2.current && latestDev2Data) {
      buildChart(chartRef2, chartInstance2, 'Dev2', latestDev2Data, visibleDev2);
    }
  }, [latestDev2Data, visibleDev2]);

  const handleReset = () => {
  // MQTT abort
  publishMessage(
    'pomon/BFL_PomonA001/rnd/abort',
    JSON.stringify({ action: "abort" })
  );

  // Clear MQTT data
  clearTopicData('pomon/BFL_PomonA001/rnd/status');

  // ✅ RESET UI manually
  setLatestDev1Data({ R: 0, Y: 0, B: 0 });
  setLatestDev2Data({ R: 0, Y: 0, B: 0 });
};

  return (
    <>
      <button
        onClick={handleReset}
        className="absolute md:top-5.5 top-48 right-1 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-xl md:me-12 me-4 shadow-md transition duration-300 ease-in-out"
      >
        Reset
      </button>

      <div className="flex flex-col md:flex-row gap-6 p-3 h-fit">
        {/* Dev1 */}
        <div className="w-full md:w-1/2 h-96 bg-white p-4 shadow rounded relative">
          <h2 className="text-lg font-semibold mb-2">Aeration Device One</h2>
          <div className="absolute top-4 right-4 flex gap-2 text-sm">
            <label className="flex items-center gap-1 text-red-600 font-medium">
              <input
                type="checkbox"
                checked={visibleDev1.R}
                style={{ accentColor: '#ef4444' }}
                onChange={() => setVisibleDev1((prev) => ({ ...prev, R: !prev.R }))}
              />
              R
            </label>
            <label className="flex items-center gap-1 text-yellow-600 font-medium">
              <input
                type="checkbox"
                checked={visibleDev1.Y}
                style={{ accentColor: '#facc15' }}
                onChange={() => setVisibleDev1((prev) => ({ ...prev, Y: !prev.Y }))}
              />
              Y
            </label>
            <label className="flex items-center gap-1 text-blue-600 font-medium">
              <input
                type="checkbox"
                checked={visibleDev1.B}
                style={{ accentColor: '#3b82f6' }}
                onChange={() => setVisibleDev1((prev) => ({ ...prev, B: !prev.B }))}
              />
              B
            </label>
          </div>
          <canvas ref={chartRef1} className="w-full h-full" />
        </div>

        {/* Dev2 */}
        <div className="w-full md:w-1/2 h-96 bg-white p-4 shadow rounded relative">
          <h2 className="text-lg font-semibold mb-2">Aeration Device Two</h2>
          <div className="absolute top-4 right-4 flex gap-2 text-sm">
            <label className="flex items-center gap-1 text-red-600 font-medium">
              <input
                type="checkbox"
                checked={visibleDev2.R}
                style={{ accentColor: '#ef4444' }}
                onChange={() => setVisibleDev2((prev) => ({ ...prev, R: !prev.R }))}
              />
              R
            </label>
            <label className="flex items-center gap-1 text-yellow-600 font-medium">
              <input
                type="checkbox"
                checked={visibleDev2.Y}
                style={{ accentColor: '#facc15' }}
                onChange={() => setVisibleDev2((prev) => ({ ...prev, Y: !prev.Y }))}
              />
              Y
            </label>
            <label className="flex items-center gap-1 text-blue-600 font-medium">
              <input
                type="checkbox"
                checked={visibleDev2.B}
                style={{ accentColor: '#3b82f6' }}
                onChange={() => setVisibleDev2((prev) => ({ ...prev, B: !prev.B }))}
              />
              B
            </label>
          </div>
          <canvas ref={chartRef2} className="w-full h-full" />
        </div>
      </div>
    </>
  );
};

export default LineCharts;

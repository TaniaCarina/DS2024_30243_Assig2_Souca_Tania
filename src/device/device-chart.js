import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import Stomp from "stompjs";

Chart.register(...registerables);

const DeviceChart = () => {
    const [measurements, setMeasurements] = useState([]);
    const [date, setDate] = useState(null);
    const [hourlyDifferences, setHourlyDifferences] = useState([]);
    const deviceUuid = window.location.href.split('/').slice(-1)[0];
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);
    const clientRef = useRef(null);
    const [connected, setConnected] = useState(false);

    const processMessage = (message) => {
        const data = JSON.parse(message.body);
        console.log("Received message:", data);
        // Handle your message here
      };

    useEffect(() => {
        if (date) {
            getNewMeasurements();
        }
    }, [date]);

    useEffect(() => {
        updateHourlyDifferences();
    }, [measurements]);

    useEffect(() => {
        return () => {
            if (clientRef.current) {
                clientRef.current.deactivate();
            }
        };
    }, []);

 
const getNewMeasurements = () => {
  const dateObj = new Date(date);
  const formattedDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;

//   const client = new Client({
//       brokerURL: "ws://localhost:8082/measurements",  // Adjust URL if necessary
//       connectHeaders: {},
//       onConnect: () => {
//           client.subscribe("/topic/measurements", (message) => {
//               const receivedMessage = JSON.parse(message.body);
//               setMeasurements(receivedMessage);
//           });

//           client.publish({
//               destination: "/app/sendMeasurement",
//               body: JSON.stringify({
//                   deviceUuid: deviceUuid,
//                   date: formattedDate,
//               }),
//           });
//       },
//       // Add handlers for other client events as needed
//   });

const client = new Client({
    brokerURL: 'ws://localhost:8082/measurements'
  });

  client.onConnect = (frame) => {
      setConnected(true);
      console.log('Connected: ' + frame);
      client.subscribe('/topic/notifications', (message) => {
          processMessage(message);
      });
      client.publish({
          destination: "/app/hello",
          body: 'test',
      });
  };

  client.onWebSocketError = (error) => {
    console.error('Error with monitoring websocket', error);
};

client.onStompError = (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
    };

  client.activate();
  clientRef.current = client;
};

    const updateHourlyDifferences = () => {
        const hourlyDiff = Array(24).fill(0).map(() => []);

        measurements.forEach((measurement) => {
            const timestamp = new Date(measurement.timestamp);
            const hour = timestamp.getHours();
            hourlyDiff[hour].push(measurement.value);
        });

        const hourlyDifferencesData = hourlyDiff.map(values => {
            return values.length >= 2 ? values[values.length - 1] - values[0] : 0;
        });

        const chartData = {
          labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
            datasets: [{
                label: 'Hourly Differences',
                data: hourlyDifferencesData,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }],
        };

        setHourlyDifferences(chartData);
    };

    useEffect(() => {
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        if (chartRef.current && hourlyDifferences.labels && hourlyDifferences.datasets) {
            const newChartInstance = new Chart(chartRef.current, {
                type: 'bar',
                data: hourlyDifferences,
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Hour',
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Hourly Differences',
                            },
                        },
                    },
                },
            });

            chartInstanceRef.current = newChartInstance;
        }
    }, [hourlyDifferences]);

    return (
        <div style={{ padding: '24px' }}>
            <label htmlFor="datePicker">Pick a date: </label>
            <input type="date" id="datePicker" value={date || ''} onChange={(e) => setDate(e.target.value)} />
            <canvas ref={chartRef} width="400" height="200"></canvas>
        </div>
    );
};

export default DeviceChart;
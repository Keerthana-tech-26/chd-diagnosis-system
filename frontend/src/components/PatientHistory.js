import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
export default function PatientHistory() {
  const [groupedHistory, setGroupedHistory] = useState({});
  const [globalChartData, setGlobalChartData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchAllHistory = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/diagnosis/");
        const data = await res.json();

        if (Array.isArray(data)) {
          const grouped = {};
          data.forEach((entry) => {
            const name = entry.patientName;
            if (!grouped[name]) grouped[name] = [];
            grouped[name].push(entry);
          });
          Object.keys(grouped).forEach((name) => {
            grouped[name].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
          });

          setGroupedHistory(grouped);
          const sortedGlobal = [...data].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
          const chartPoints = sortedGlobal.map((item) => ({
            time: new Date(item.timestamp).toLocaleString(),
            probability: Number((item.probability * 100).toFixed(2)),
            patientName: item.patientName,
            riskLabel: item.result === "1" ? "At Risk" : "Not at Risk",
            strokeColor: item.result === "1" ? "#ff4d4f" : "#28a745",
          }));
          setGlobalChartData(chartPoints);
        } else {
          console.error("Diagnosis API did not return an array");
        }
      } catch (error) {
        console.error("Failed to fetch history:", error);
      }
    };
    fetchAllHistory();
  }, []);
  const handleDelete = async (id, patientName) => {
    if (window.confirm("Delete this prediction?")) {
      try {
        await fetch(`http://localhost:4000/api/diagnosis/delete/${id}`, { method: "DELETE" });
        setGroupedHistory((prev) => {
          const updated = { ...prev };
          updated[patientName] = updated[patientName].filter((entry) => entry._id !== id);
          if (updated[patientName].length === 0) delete updated[patientName];
          return updated;
        });
        setGlobalChartData((prev) => prev.filter((entry) => entry._id !== id));
      } catch (err) {
        console.error("Failed to delete:", err);
      }
    }
  };
  const handleNext = () => {
    navigate("/chatbot");
  };
  return (
    <div style={{ padding: "20px" }}>
      <h2>Diagnosis History</h2>
      {Object.keys(groupedHistory).length === 0 ? (
        <p>No predictions found.</p>
      ) : (
        Object.entries(groupedHistory).map(([patientName, entries]) => (
          <div key={patientName} style={{ marginBottom: "30px" }}>
            <h3>Patient Name: {patientName}</h3>
            <p><strong>Total Predictions:</strong> {entries.length}</p>
            <ul>
              {entries.map((item) => (
                <li key={item._id || item.id} style={{ marginBottom: "10px" }}>
                  <strong>Timestamp:</strong> {new Date(item.timestamp).toLocaleString()} <br />
                  <strong>Prediction:</strong> {item.result === "1" ? "At Risk" : "Not at Risk"} <br />
                  <strong>Confidence:</strong> {(item.probability * 100).toFixed(2)}%
                  <button
                    onClick={() => handleDelete(item._id, patientName)}
                    style={{
                      marginTop: "5px",
                      padding: "4px 8px",
                      backgroundColor: "#ff4d4f",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
      {globalChartData.length > 1 && (
        <>
          <h3>Overall Risk Probability Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={globalChartData}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                formatter={(value, name, props) => [`${value}%`, "Confidence"]}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="probability"
                stroke="#8884d8"
                strokeWidth={2}
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  const color = payload.riskLabel === "At Risk" ? "#ff4d4f" : "#28a745"; // red or green
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={5}
                      stroke="#333"
                      strokeWidth={1}
                      fill={color}
                    />
                  );
                }}
            />
            </LineChart>
            <div style={{ display: "flex", gap: "20px", alignItems: "center", margin: "10px 0" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#ff4d4f", marginRight: 5 }}></div>
                <span>At Risk</span>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#28a745", marginRight: 5 }}></div>
                  <span>Not at Risk</span>
                </div>
              </div>

          </ResponsiveContainer>
        </>
      )}
      <button onClick={handleNext} style={{ marginTop: "20px" }}>
        Next →
      </button>
    </div>
  );
}

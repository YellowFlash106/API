import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [daily, setDaily] = useState([]);
  const [services, setServices] = useState([]);

  // protect route
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewRes, dailyRes, serviceRes] = await Promise.all([
          api.get("/analytics/overview"),
          api.get("/analytics/daily"),
          api.get("/analytics/services")
        ]);

        setOverview(overviewRes.data);
        setDaily(dailyRes.data);
        setServices(serviceRes.data);

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>APIForge Dashboard</h1>

      {/* 🔹 Overview Cards */}
      {overview && (
        <div style={{ display: "flex", gap: "20px" }}>
          <div>
            <h3>Total</h3>
            <p>{overview.totalRequests}</p>
          </div>

          <div>
            <h3>Success</h3>
            <p>{overview.successRequests}</p>
          </div>

          <div>
            <h3>Failed</h3>
            <p>{overview.failedRequests}</p>
          </div>
        </div>
      )}

      <br />

      {/* 🔹 Daily Chart */}
      <h2>Daily Requests</h2>
      <LineChart width={600} height={300} data={daily}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="totalRequests" />
      </LineChart>

      <br />

      {/* 🔹 Top Services */}
      <h2>Top Services</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Service</th>
            <th>Requests</th>
          </tr>
        </thead>

        <tbody>
          {services.map((s, i) => (
            <tr key={i}>
              <td>{s.serviceName}</td>
              <td>{s.totalRequests}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default Dashboard;
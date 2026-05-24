import { useEffect, useState } from "react";
import api from "../utils/api";

const DashBoard = () =>{
    const [overview, setOverview] = useState(null);
    const [services, setServices] = useState([]);
        const [token, setToken] = useState(() => localStorage.getItem("jwtToken") || localStorage.getItem("token") || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

    const fetchData = async () => {
        if (!token) {
            setError("Add a JWT token to load analytics.");
            return;
        }

        localStorage.setItem("jwtToken", token);
        localStorage.setItem("token", token);

        setLoading(true);
        setError("");

        try {
            const [overviewRes, servicesRes] = await Promise.all([
                api.get(`${API_BASE_URL}/analytics/overview`),
                api.get(`${API_BASE_URL}/analytics/services`),
            ]);

            setOverview(overviewRes.data);
            setServices(servicesRes.data);
        } catch (err) {
            setError(err?.response?.data?.error || err?.response?.data?.message || err.message || "Failed to load analytics");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token]);

    const handleSaveToken = () => {
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("token", token);
        fetchData();
    };

    return (
        <div className="dashboard-shell">
            <div className="dashboard-panel">
                <div className="dashboard-header">
                    <div>
                        <p className="eyebrow">Backend connected dashboard</p>
                        <h1>Analytics</h1>
                        <p className="subtle">API base: {API_BASE_URL}</p>
                    </div>
                </div>

                <div className="token-box">
                    <label htmlFor="jwtToken">JWT token</label>
                    <div className="token-row">
                        <input
                            id="jwtToken"
                            type="password"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            placeholder="Paste your Bearer token here"
                        />
                        <button onClick={handleSaveToken}>Connect</button>
                    </div>
                    <p className="subtle">The token is saved in localStorage as <span>jwtToken</span>.</p>
                </div>

                <div className="status-row">
                    <button onClick={fetchData} disabled={loading || !token}>
                        {loading ? "Loading..." : "Refresh data"}
                    </button>
                    {error && <p className="error-text">{error}</p>}
                </div>

                {overview && (
                    <div className="metrics-grid">
                        <div className="metric-card">
                            <span>Total Requests</span>
                            <strong>{overview.totalRequests}</strong>
                        </div>
                        <div className="metric-card">
                            <span>Success</span>
                            <strong>{overview.successRequests}</strong>
                        </div>
                        <div className="metric-card">
                            <span>Failed</span>
                            <strong>{overview.failedRequests}</strong>
                        </div>
                    </div>
                )}

                {services.length > 0 && (
                    <div className="services-section">
                        <h2>Service analytics</h2>
                        <div className="services-list">
                            {services.map((service) => (
                                <article key={service.id} className="service-card">
                                    <div>
                                        <h3>{service.name}</h3>
                                        <p>{service.description}</p>
                                        <small>{service.endpoint}</small>
                                    </div>
                                    <div className="service-stats">
                                        <span>Total: {service.totalRequests}</span>
                                        <span>Success: {service.successRequests}</span>
                                        <span>Failed: {service.failedRequests}</span>
                                        <span>Access requests: {service.accessRequests}</span>
                                        <span>Approved: {service.approvedAccesses}</span>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
} 
export default DashBoard;
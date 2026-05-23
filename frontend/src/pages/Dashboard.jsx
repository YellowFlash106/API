import { useEffect, useState} from "react";
import axios from "axios";

const DashBoard = () =>{
    const [overview, setOverview] = useState(null);

    useEffect(() => {
      const fetchData = async () =>{
        try {
            const res = await axios.get("http://localhost:5000/analytics/overview", {
                headers:{
                    Authorization : "Bearer YOUR_JWT_TOKEN"
                }
            });

        } catch (error) {
            console.log(error);
        }
      }
      fetchData();
    }, [])
    return (
        <div style={{padding :"20px"}}>
            <h1>Dashboard</h1>

            { overview && (
                
                <div>
                <p>Total Requests : {overview.totalRequests}</p>
                <p>Success : {overview.successRequests}</p>
                <p>Failed : {overview.failedRequests}</p>
            </div>
        )}
        </div>
    )
} 
export default DashBoard;
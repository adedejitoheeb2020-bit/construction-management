import {useEffect, useState} from "react";
import api from "../services/api";

export default function Dashboard() {
    const [projectsCount, setProjectsCount] = useState(0);

    useEffect(() => {
        const fetchprojects = async () => {
            try {
                const res = await api.get("/projects/");
                setProjectsCount(res.data.length);
            }   catch(err) {
                console.error ("Failed to fetch projects:", err);
            }
        }   
        fetchprojects();
    }, [])

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <div className="grid grid-cols-3 gap-6">
                <div className="bg-gray-100 p-6 shadow rounded-xl">
                    <h3 className="text-lg font-semibold">Total Projects</h3>
                    <p className="text-3xl font-bold mt-2">{projectsCount}</p>
                </div>
            </div>
        </div>
    )
}

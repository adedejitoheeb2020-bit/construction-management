import { useEffect, useState } from "react";
import api from "../services/api";

export default function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
      const getprojects = async () => {
          try {
              const res = await api.get("/projects/");
              setProjects(res.data);
          }   catch (err) {
          }
      }
      getprojects();
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Projects</h2>

      <div className="bg-white p-6 rounded-xl shadow">
        <table className="w-full">
          <thead className="border-b">
            <tr>
              <th className="text-left p-3">Project Name</th>
              <th className="text-left p-3">Location</th>
              <th className="text-left p-3">Start Date</th>
            </tr>
          </thead>

          <tbody>
            
            {projects.map((project) => (
              <tr key={project.id} className="border-b">
                <td className="p-3">{project.name}</td>
                <td className="p-3">{project.location}</td>
                <td className="p-3">{project.start_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}  

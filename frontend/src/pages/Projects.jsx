import { useEffect, useState } from "react";
import api from "../services/api";
import Card from "../components/Card";
import Modal from "../components/Modal";
import {Button} from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name:"", location:"", start_date:"", expected_end_date:"", latitude:"", longitude:""});
  const [activeModal, setActiveModal] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const handlechange = (e) => {
    setForm ({...form, [e.target.name]: e.target.value})
  }

  const getprojects = async () => {
          try {
              const res = await api.get("/projects/");
              setProjects(res.data);
          }   catch (err) {
          }
      }

  useEffect(() => {getprojects()}, [])

  const handlecreate = async(e) => {
    e.preventDefault();
    try {
      await api.post("/projects/", form);
      setActiveModal(null);
      setForm({name:"", location:"", start_date:"", expected_end_date:"", latitude:"", longitude:""});
      getprojects();
    } catch (err) {
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Projects</h2>
        <Button onClick={() => setActiveModal("create")}>Create project</Button>
      </div>

      <Card>
        <table className="w-full text-left">
          <thead className="text-sm text-gray-600 border-b">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Location</th>
              <th className="p-3">Start Date</th>
              <th className="p-3">Expected End Date</th>
              <th className="p-3">Details</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {projects.map(p => (
              <tr key={p.id} className="border-b hover:bg-gray-300">
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.location}</td>
                <td className="p-3">{p.start_date}</td>
                <td className="p-3">{p.expected_end_date}</td>
                <td className="p-3">
                  <a href={`/projects/${p.id}`} className="text-blue-600">Open</a>
                </td>
                <td><button onClick={() => {setSelectedProject(p); setActiveModal("delete");}} 
                className="text-red-500 hover:text-red-700"> <Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal open={activeModal === "create"} onClose={() => setActiveModal(null)} title="Create project">
        <form onSubmit={handlecreate} className="space-y-3">
          <div>
            <label className="text-gray-700 text-sm font-medium">Project Name
              <input value={form.name} type="text" name="name" autoComplete="name" onChange={handlechange} className="w-full border p-2 rounded" placeholder="Project name" />
            </label>
          </div>

          <div>
            <label className="text-gray-700 text-sm font-medium">Location
              <input value={form.location} type="text" name="location" autoComplete="location" onChange={handlechange} className="w-full border p-2 rounded" placeholder="Location" />
            </label>
          </div>

          <div>
            <label className="text-gray-700 text-sm font-medium">Start date
              <input value={form.start_date} type="date" name="start_date" autoComplete="start_date" onChange={handlechange} className="w-full border p-2 rounded" placeholder="Start Date" />
            </label>
          </div>

          <div>
            <label className="text-gray-700 text-sm font-medium">Expected end date
              <input value={form.expected_end_date} type="date" name="expected_end_date" autoComplete="expected_end_date" onChange={handlechange} className="w-full border p-2 rounded" placeholder="Expexted End Date" />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input value={form.latitude} type="number" step="any" name="latitude" autoComplete="latitude" onChange={handlechange} className="border p-2 rounded" placeholder="Latitude" />
            <input value={form.longitude} type="number" step="any" name="longitude" autoComplete="longitude" onChange={handlechange} className="border p-2 rounded" placeholder="Longitude" />
          </div>
          <div className="flex justify-end">
            <Button variant="ghost" onClick={() => setActiveModal(null)}>Cancel</Button>
            <Button type="submit" className="ml-3">Create</Button>
          </div>
        </form>
      </Modal>
      
      <Modal open={activeModal === "delete"} onClose={() => setActiveModal(null)} title="Delete" className="!w-[350px]">
        <h2 className="mb-4">Are you sure you want to delete Project?</h2>
        <div className="flex justify-end">
          <Button variant="ghost" onClick={() => setActiveModal(null)}>Cancel</Button>
          <Button onClick={async() => {
                  await api.delete(`/projects/${selectedProject.id}/`);
                  setActiveModal(null);
                  getprojects();
                }} variant="destructive">Delete</Button>
        </div>
      </Modal>
    </div>
  );
}

import { useEffect, useState } from "react";
import api from "../services/api";
import Card from "../components/Card";
import Modal from "../components/Modal";
import Button from "../components/Button";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name:"", location:"", start_date:"", latitude:"", longitude:""});
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

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
      setOpen(false);
      setForm({name:"", location:"", start_date:"", latitude:"", longitude:""});
      getprojects();
    } catch (err) {
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Projects</h2>
        <Button onClick={() => setOpen(true)}>Create project</Button>
      </div>

      <Card>
        <table className="w-full text-left">
          <thead className="text-sm text-gray-600 border-b">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Location</th>
              <th className="p-3">Start Date</th>
              <th className="p-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(p => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.location}</td>
                <td className="p-3">{p.start_date}</td>
                <td className="p-3">
                  <a href={`/projects/${p.id}`} className="text-blue-600">Open</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Create project">
        <form onSubmit={handlecreate} className="space-y-3">
          <input value={form.name} type="text" name="name" autoComplete="name" onChange={handlechange} className="w-full border p-2 rounded" placeholder="Project name" />
          <input value={form.location} type="text" name="location" autoComplete="location" onChange={handlechange} className="w-full border p-2 rounded" placeholder="Location" />
          <input value={form.start_date} type="date" name="start_date" autoComplete="start_date" onChange={handlechange} className="w-full border p-2 rounded" placeholder="Start Date" />
          <div className="grid grid-cols-2 gap-2">
            <input value={form.latitude} type="number" step="any" name="latitude" autoComplete="latitude" onChange={handlechange} className="border p-2 rounded" placeholder="Latitude" />
            <input value={form.longitude} type="number" step="any" name="longitude" autoComplete="longitude" onChange={handlechange} className="border p-2 rounded" placeholder="Longitude" />
          </div>
          <div className="flex justify-end">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" className="ml-3">Create</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

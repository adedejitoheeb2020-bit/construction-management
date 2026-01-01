import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import api from "../services/api";
import Modal from "../components/Modal";
import {Dialog, DialogTitle, DialogContent} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function ProjectMaterialsPage() {
  const [projectmaterials, setProjectMaterials] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [formMaterials, setFormMaterials] = useState({name:"", unit:"", co2_factor:""})
  const [selectedProjectMaterial, setSelectedProjectMaterial] = useState(null);
  const {id} = useParams();


  const fetchprojectmaterial = async() => {
    const res = await api.get(`/projectMaterials/?project_id=${id}`);
    setProjectMaterials(res.data);
    console.log(res.data);
  }

  useEffect(() => {fetchprojectmaterial()}, [id])

  const handlechange = (e) => {
    setFormMaterials ({...formMaterials, [e.target.name]: e.target.value})
  }

  const handleadd = async(e) => {
    e.preventDefault();
    try {
      await api.post("/materials/", formMaterials);
      setActiveModal(null);
      setFormMaterials({name:"", unit:"", co2_factor:""});
      fetchprojectmaterial();
    } catch (err) {}
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Project Materials
            </h1>
            <p className="text-gray-500 mt-1">
              Materials assigned to this project
            </p>
          </div>

          <div className="flex item-center gap-2">
            <Button onClick={() => setActiveModal("Add")} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Material
            </Button>

            <Button variant="outline" onClick={() => setActiveModal("Edit")}>Edit material</Button> 
          </div>

          <Dialog open = {activeModal === "Add"} onOpenChange = {() => setActiveModal(null)}>
            <DialogContent>
              <DialogTitle>Add Material</DialogTitle>
              <form onSubmit = {handleadd} className = "space-y-3">
                <div>
                  <label className = "text-gray-700 text-sm font-medium"> Material Name
                    <Input value={formMaterials.name} type="text" name="name" autoComplete="name" onChange={handlechange} className="w-full border p-2 rounded" placeholder="Material name"/>
                  </label>
                </div>

                <div>  
                  <label className = "text-gray-700 text-sm font-medium"> Unit
                    <Input value={formMaterials.unit} type="text" name="unit" autoComplete="unit" onChange={handlechange} className="w-full border p-2 rounded" placeholder="Unit" />
                  </label>
                </div>

                <div>  
                  <label className = "text-gray-700 text-sm font-medium"> co2_factor
                    <Input value={formMaterials.co2_factor} type="number" name="co2_factor" autoComplete="co2_factor" onChange={handlechange} className="w-full border p-2 rounded" placeholder="co2_factor"/>
                  </label>
                </div>

                <div className="flex justify-end">
                  <Button variant="ghost" onClick={() => setActiveModal(null)}>Cancel</Button>
                  <Button type="submit" className="ml-3">Add</Button>
                </div>

              </form>
            </DialogContent>

          </Dialog>
        </div>

        {/* Summary */}
        <Card className="rounded-2xl shadow-sm mb-6">
          <CardContent className="p-6 flex items-center gap-4">
            <Package className="w-6 h-6 text-gray-600" />
            <div>
              <p className="text-gray-500 text-sm">Total Material Cost</p>
              <p className="text-2xl font-bold text-gray-900">
                Total cost
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Materials Table */}
        <Card className="rounded-2xl shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="text-left px-6 py-4">Material</th>
                  <th className="text-right px-6 py-4">Quantity Required</th>
                  <th className="text-right px-6 py-4">Unit Cost (₦)</th>
                  <th className="text-right px-6 py-4">Quantity Supplied</th>
                  <th className="text-right px-6 py-4">Quantity Used</th>
                  <th className="text-right px-6 py-4">Quantity Remaining</th>
                  <th className="text-right px-6 py-4">Usage Percentage</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {projectmaterials.map((item) => (
                  <tr
                    key={item.material_name}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {item.material_name}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {item.material_required}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {item.cost_per_unit.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {item.material_supplied}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {item.quantity_used}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {item.remaining_material}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {item.usage_percentage}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-red-500 hover:text-red-700" onClick = {() => {setSelectedProjectMaterial(item); setActiveModal("delete");}}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </motion.div>

      <Modal open = {activeModal === "delete"} onClose = {() => setActiveModal(null)} title="Delete" className="!w-[350px]">
        <h2>Are you sure you want to delete?</h2>
        <div className="flex justify-end">
          <Button variant="ghost" onClick = {() => setActiveModal(null)}>Cancel</Button>
          <Button variant="destructive" onClick = {async () => {
            await api.delete(`/projects/${selectedProjectMaterial.item}/`);
            setActiveModal(null);
            fetchprojectmaterial();
          }}>Delete</Button>
        </div>

      </Modal>
    </div>
  );
}

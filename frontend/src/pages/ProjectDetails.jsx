import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { Card, CardContent } from "@/components/ui/card";
import Modal from "../components/Modal";
import Button from "../components/Button";
import { MapPin, Calendar, Users, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';


export default function ProjectDetailsPage() {
  const [project, setProject] = useState({});
  const {id} = useParams();

  const fetchproject = async () => {
          try {
              const res = await api.get(`/projects/${id}/`);
              setProject(res.data);
          }   catch (err) {
          }
      }

  useEffect(() => {fetchproject()}, [id])

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-5xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {project.name}
          </h1>
          <p className="text-gray-500 mt-2 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            {project.organization}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Location */}
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Location
              </h2>
              <div className="flex items-start gap-3 text-gray-600">
                <MapPin className="w-5 h-5 mt-1" />
                <div>
                  <p>{project.location}</p>
                  <p className="text-sm text-gray-400">
                    Latitude: {project.latitude}, Longitude: {project.longitude}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Timeline
              </h2>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Start Date:</span>
                  <span className="font-medium text-gray-800">
                    {project.start_date}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Expected End:</span>
                  <span className="font-medium text-gray-800">
                    {project.expected_end_date}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Workforce */}
          <Card className="rounded-2xl shadow-sm md:col-span-2">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Workforce
              </h2>
              <div className="flex items-center gap-3 text-gray-600">
                <Users className="w-5 h-5" />
                <p>
                  <span className="font-semibold text-gray-900">
                    {project.workers_count}
                  </span>{" "}
                  workers currently assigned to this project
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}

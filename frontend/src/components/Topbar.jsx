import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Button from "./Button";
import Modal from "./Modal";
import { useState } from "react";

export default function Topbar() {
    const navigate = useNavigate();
    const [activeModal, setActiveModal] = useState(null);

    return (
        <div className="w-full bg-gray-200 p-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold">Admin</h1>
            <Button variant="danger" onClick= {() => setActiveModal("logout")}>Logout</Button>

            <Modal open={activeModal === "logout"} onClose={() => setActiveModal(null)} title="Logout" className="!w-[350px]">
              <h2 className="mb-4">Are you sure you want to Logout?</h2>
              <div className="flex justify-end">
                <Button onClick={() => setActiveModal(null)} variant="ghost" >Cancel</Button>
                <Button onClick= {async () => {
                  await api.post("/auth/logout/");
                  setActiveModal(null);
                  localStorage.removeItem("access");
                  navigate("/");
                }}
                variant="danger">Logout</Button>
              </div>

            </Modal>
        </div>

        
    )
}
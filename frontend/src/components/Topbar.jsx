import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {Button} from "./ui/button";
import Modal from "./Modal";
import { useState } from "react";
import { LogOut} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useNavigate} from "react-router-dom";  

export default function Topbar() {
    const navigate = useNavigate();
    const [activeModal, setActiveModal] = useState(null);

    return (
        <div className="w-full p-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold">Admin</h1>
            <Button variant="secondary" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick= {() => setOpen(true)}>
              <LogOut className="w-4 h-4"/>Logout</Button>

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
                className="bg-red-50 text-red-500">Logout</Button>
              </div>

            </Modal>
        </div>

        
    )
}
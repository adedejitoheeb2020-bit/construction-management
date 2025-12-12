import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Button from "./Button";

export default function Topbar() {
    const navigate = useNavigate();

    return (
        <div className="w-full bg-white border-b p-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold">Admin</h1>
            <Button
              onClick = {async () => {
                await api.post("/auth/logout/");

                localStorage.removeItem("access");
                navigate("/");
              }}
              variant="danger"
            >
                Logout
            </Button>
        </div>
    )
}
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Topbar() {
    const navigate = useNavigate();

    return (
        <div className="w-full bg-white border-b p-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold">Admin</h1>
            <button
              onClick = {async () => {
                await api.post("/auth/logout/");

                localStorage.removeItem("access");
                navigate("/");
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-lg"
            >
                Logout
            </button>
        </div>
    )
}
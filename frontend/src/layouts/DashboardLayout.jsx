import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {Outlet} from "react-router-dom";

export default function DashboardLayout () {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />

            <div className="flex flex-col flex-1 min-h-screen">
                <Topbar />
                <div className="flex-1 p-6"><Outlet /></div>
            </div>
        </div>
    )
}
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar2";
import {Outlet} from "react-router-dom";

export default function DashboardLayout () {
    return (
        <div className="flex min-h-screen bg-white">
            <Sidebar />

            <div className="flex flex-col flex-1 min-h-screen">
                <TopBar />
                <div className="rounded-xl shadow flex-1 p-6"><Outlet /></div>
            </div>
        </div>
    )
}
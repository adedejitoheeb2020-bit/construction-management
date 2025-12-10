import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function DashboardLayout ({ children }) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />

            <div className="flex flex-col flex-1 min-h-screen">
                <Topbar />
                <div className="flex-1 p-6">{children}</div>
            </div>
        </div>
    )
}
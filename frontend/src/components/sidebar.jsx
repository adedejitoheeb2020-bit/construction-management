import {Link, useLocation} from "react-router-dom";

export default function Sidebar() {
    const { pathname } = useLocation();

    const linkClass = (path) =>
        pathname === path 
        ? "bg-blue-600 text-white p-3 rounded-lg" : "p-3 rounded-lg hover:bg-gray-200";

    return (
        <div className="w-64 min-h-screen bg-gray-200 p-5">
            <h2 className="text-2xl font-bold mb-6">Home</h2>

            <nav className="flex flex-col gap-2">
                <Link className={linkClass("/dashboard")} to="/dashboard">Dashboard</Link>
                <Link className={linkClass("/projects")} to="/projects">Projects</Link>
                <Link className={linkClass("/notifications")} to="/notifications">Notifications</Link>
            </nav>
        </div>
    )    
}

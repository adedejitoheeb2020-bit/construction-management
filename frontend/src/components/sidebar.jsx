import {Link, useLocation} from "react-router-dom";
import {LayoutDashboard, FolderKanban} from "lucide-react";


export default function Sidebar() {
    const { pathname } = useLocation();

    const linkClass = (path) =>
        pathname === path 
        ? "bg-slate-200 p-3 rounded-lg" : "p-3 rounded-lg hover:bg-slate-200";

    return (
        <div className="w-64 min-h-screen p-5">
            <h2 className="text-2xl font-bold mb-6">Home</h2>

            <nav className="flex flex-col gap-2">
                <Link className={`${linkClass("/dashboard")} flex items-center gap-2`} to="/dashboard"><LayoutDashboard className="w-4 h-4"/>Dashboard</Link>
                <Link className={`${linkClass("/projects")} flex items-center gap-2`} to="/projects"><FolderKanban className="w-4 h-4"/> Projects</Link>
               
            </nav>
        </div>
    )    
}

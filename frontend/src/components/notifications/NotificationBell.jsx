import {Bell} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {useNavigate} from "react-router-dom";
import useNotifications from "./useNotifications";

export default function NotificationBell() {
    const navigate = useNavigate();
    const {unreadCount} = useNotifications();

    return (
        <button onClick={() => navigate("/notifications")} className="relative flex">
            <Bell className="w-5 h-5"/>
            {unreadCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-4 w-4 rounder-full
                 p-0 flex items-center justify-center bg-red-700">{unreadCount}</Badge>
            )}
        </button>
    )
}
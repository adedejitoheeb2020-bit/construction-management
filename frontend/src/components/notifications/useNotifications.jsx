import { useEffect, useState } from "react";
import api from "../../services/api";

export default function useNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const res = await api.get("/notifications/");
            setNotifications(res.data);
        }   catch (err) {
            console.error("Failed to fetch notifications");
        }   finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        await api.patch(`/notifications/${id}/mark_as_read/`);
        setNotifications((prev) => 
        prev.map((n) => n.id === id ? {...n, is_read: true } : n)
        )
    }

    useEffect(() => {
        fetchNotifications();
    }, []);

    const unreadCount = notifications.filter((n) => !n.is_read).length;

    return {
        notifications,
        unreadCount,
        loading,
        markAsRead,
    }
}
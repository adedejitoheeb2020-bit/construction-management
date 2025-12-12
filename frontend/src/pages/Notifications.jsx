import {useEffect, useState } from "react";
import api from "../services/api";

export default function Notifications() {
    const [Notifications, setNotifications] = useState([]);

    useEffect(() => {
        const getnotifications = async() => {
            try {
                const res = await api.get("/notifications/");
                setNotifications(res.data);
                console.log(res.data);
            }   catch (err) {}
        }
        getnotifications();
    }, [])

    return (
        <div>
            <h2 className="text-2xl text-center font-bold mb-4 shadow-lg bg-white rounded-lg p-4 w-60">Notifications</h2>
            <div>
                {Notifications.map((notification) => (
                    <h2 className="p-3">{notification.title}</h2>
                ))}
            </div>
        </div>
    )
}
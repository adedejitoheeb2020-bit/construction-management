import useNotifications from "@/components/notifications/useNotifications";
import {Card, CardContent} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import {useNavigate} from "react-router-dom";

export default function Notifications() {
    const {notifications, markAsRead} = useNotifications();
    const navigate = useNavigate();
    const handleClick = (notification) => {
        markAsRead(notification.id);
        if (notification.url) {
            navigate(notification.url);
        }
    }

    return (
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
            <h1 className="text-2xl font-semibold">Notifications</h1>
            {notifications.length === 0 && (
                <p className="text-muted-foreground">No notifications available</p>
            )}
            {notifications.map((n) => (
                <Card key={n.id} onClick={() => handleClick(n)} className={cn(
                    "cursor-pointer transition hover:bg-muted", !n.is_read && "border-l-4 border primary"
                )}>
                    <CardContent className="p-4 space-y-1">
                        <h3 className="font-medium">{n.title}</h3>
                        <p className="text-sm text-muted-foreground">{n.message}</p>
                        <span className="text-xs text-muted-foreground">{new Date(n.created_at).toLocaleString()}</span>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
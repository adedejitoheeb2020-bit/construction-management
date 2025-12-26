import {Badge} from "@/components/ui/badge";

export default function StatusBadge({ status = "pending" }) {
    const map = {
        pending: "secondary",
        approved: "success",
        rejected: "destructive",
    }

    return (
        <Badge variant={map[status] || "secondary"}>
            {status.toUpperCase()}
        </Badge>
    )
}
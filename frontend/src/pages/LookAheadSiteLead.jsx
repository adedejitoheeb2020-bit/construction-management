import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import StatusBadge from "@/components/StatusBadge";
import { getLookAhead } from "@/api/lookahead";
import {siteLeadApprove} from "@/api/lookahead";
import {siteLeadReject} from "@/api/lookahead";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function LookAheadSiteLead() {
    const [lookahead, setLookahead] = useState({});
    const {id} = useParams();

    const fetchlookahead = async () => {
        const res = await getLookAhead(id);
        console.log(res.data);
        setLookahead(res.data);
    }

    useEffect(() => {
        fetchlookahead();
    }, [id]);

    return (
        <Card className="p-4 space-y-3">
            <div className="flex justify-between">
                <div>
                    <div className="font-semibold">
                        From {lookahead.week_start} to {lookahead.week_end}
                    </div>
                    <div className="text-sm text-gray-500">
                        Submitted by {lookahead.created_by_name}
                    </div>
                </div>
                <StatusBadge />
            </div>

            <ul className="text-sm space-y-1">
                {lookahead.items?.map(item => (
                    <li key={item.id}>
                        {item.material_name} -- {item.quantity_needed} {item.unit}
                    </li>
                ))}
            </ul>

            <div className="flex gap-2">
                <Button variant="success" onClick={async () => await siteLeadApprove(id)}>Approve</Button>
                <Button variant="destructive" onClick={async () => await siteLeadReject(id)}>Reject</Button>
            </div>
        </Card>
    )
}
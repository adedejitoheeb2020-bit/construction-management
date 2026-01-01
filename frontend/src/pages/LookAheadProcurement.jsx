import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import StatusBadge from "@/components/StatusBadge";
import { getLookAhead } from "@/api/lookahead";
import {procurementApprove} from "@/api/lookahead";
import {procurementReject} from "@/api/lookahead";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function LookAheadProcurement() {
    const navigate = useNavigate();
    const [lookahead, setLookahead] = useState({});
    const {id} = useParams();
    const [isApproved, setIsApproved] = useState(false);

    const fetchlookahead = async () => {
        const res = await getLookAhead(id);
        console.log(res.data);
        setLookahead(res.data);
    }

    useEffect(() => {
        fetchlookahead();
    }, [id]);

    return (
        <Card className="relative p-8">
            {isApproved && (
                <div className="fixed top-10 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg transition-opacity duration-500">You have approved this lookahead! </div>
            )}

            <div className="space-y-3">
                <CardHeader className="flex justify-between">
                    <div>
                        <CardTitle>
                            From {lookahead.week_start} to {lookahead.week_end}
                        </CardTitle>
                        <CardDescription>
                            Submitted by {lookahead.created_by_name}
                        </CardDescription>
                    </div>
                    <StatusBadge status= {lookahead.procurement_status}/>
                </CardHeader>

                <CardContent>
                    <ul className="text-sm space-y-1">
                        {lookahead.items?.map(item => (
                            <li key={item.id}>
                                {item.material_name} -- {item.quantity_needed} {item.unit}
                            </li>
                        ))}
                    </ul>
                </CardContent>

                <CardFooter>
                    {lookahead.procurement_status === "pending" && (
                    <div className="flex gap-2">
                        <Button variant="success" onClick={async () => {await procurementApprove(id);
                            setIsApproved(true);
                            setTimeout(() => {
                                setIsApproved(false);
                                navigate(-1);
                            }, 1000)
                        }}>Approve</Button>
                        <Button variant="destructive" onClick={async () => {await procurementReject(id); navigate('/notifications');}}>Reject</Button>
                    </div>
                    )}
                </CardFooter>
            </div>
        </Card>
    )
}
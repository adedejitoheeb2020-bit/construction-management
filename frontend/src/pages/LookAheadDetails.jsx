import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import api from "@/services/api";
import StatusBadge from "@/components/StatusBadge";
import {Calendar} from "lucide-react";
import {Card, CardHeader, CardContent} from "@/components/ui/card";

export default function LookAheadDetails () {
    const {id} = useParams();
    const [lookahead, setLookahead] = useState({});

    const fetchlookahead = async () => {
        const res = await api.get(`/lookahead/${id}/`)
        setLookahead(res.data);
    }

    useEffect(() => {
        fetchlookahead();
    }, [id])

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-2">
                        <Calendar className= "w-4 h-4 text-blue-600" />
                        <h1 className="text-sm font-semibold text-blue-900">Lookahead period:</h1>
                    </div>

                    <h1>From {lookahead.week_start} to {lookahead.week_end}</h1>

                    <StatusBadge status={lookahead.procurement_status} />
                </div>
            </CardHeader>

            <CardContent>
                <div className="rounded-lg border bg-white">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-3 text-left">Material</th>
                                <th className="p-3 text-left">Quantity</th>
                                <th className="p-3 text-left">Unit</th>
                                <th className="p-3 text-left">Remarks</th>
                            </tr>
                        </thead>

                        <tbody>
                            {lookahead.items?.map(item => (
                                <tr key={item.id} className="border-b">
                                    <td className="p-3">{item.material_name}</td>
                                    <td className="p-3">{item.quantity_needed}</td>
                                    <td className="p-3">{item.unit}</td>
                                    <td className="p-3">{item.remarks || "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>

        </Card>

        
    )
}
import {useNavigate, Link} from "react-router-dom";
import { useParams } from "react-router-dom";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import api from "@/services/api";
import {useState, useEffect} from "react"
import StatusBadge from "@/components/StatusBadge";
import { motion } from "framer-motion";

export default function LookAheadPage() {
    const navigate = useNavigate();
    const {id} = useParams();
    const [lookaheads, setlookaheads] = useState([]);

    const fetchlookahead = async() => {
        const res = await api.get("/lookahead/")
        setlookaheads(res.data);

    }

    useEffect(() => {
        fetchlookahead();
    }, [])

    return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-6xl mx-auto"
        >
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Lookahead</h1>
                        <Button asChild>
                            <Link to={`/lookahead/${id}/create-lookahead`}>Create Lookahead</Link>
                        </Button>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="rounded-lg border bg-white">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-gray-100">
                                <tr>
                                    <th className="p-3 text-left">Week</th>
                                    <th className="p-3 text-left">Status</th>
                                    <th className="p-3 text-left">Submitted By</th>
                                </tr>
                            </thead>

                            <tbody>
                                {lookaheads.map(lk => (
                                    <tr key={lk.id} onClick={() => navigate(`/lookahead/${lk.id}`)}
                                    className="cursor-pointer border-b hover:bg-gray-50 transition">
                                        <td className="p-3">{lk.week_start} to {lk.week_end}</td>
                                        <td className="p-3">
                                            <StatusBadge status={lk.procurement_status} />
                                        </td>
                                        <td className="p-3">{lk.created_by_name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
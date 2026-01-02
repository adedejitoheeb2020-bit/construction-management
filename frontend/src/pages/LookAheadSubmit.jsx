import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {createLookAhead} from "@/api/lookahead";
import { useParams } from "react-router-dom";
import {Plus, Calendar} from "lucide-react"
import { useNavigate } from "react-router-dom";

export default function LookAheadSubmit () {
    const {id} = useParams();
    const [items, setItems] = useState([{material_name: "", quantity_needed: "",
         unit: "", remarks: ""}])
    const [weekStart, setWeekStart] = useState("");
    const [weekEnd, setWeekEnd] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();

    const addRow = () => 
        setItems([...items, {material_name: "", quantity_needed: "", unit: "", remarks: "" }]);

    const updateItem = (i, field, value) => {
        const copy = [...items];
        copy[i][field] = value;
        setItems(copy)
    }

    const submit = async () => {
        await createLookAhead({
            project: id,
            week_start: weekStart,
            week_end: weekEnd,
            items,
        });
        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            navigate(-1);
        }, 2000)
    }

    return (
        <Card >
            <div className="relative p-8">
                {isSubmitted && (
                    <div className="fixed top-10 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg transition-opacity duration-500">Lookahead has been submitted successfully! </div>
                )}
                
                <div>
                    <CardHeader className="text-xl font-bold text-slate-800">Weekly Look-ahead</CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 mb-8 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                            <div className="flex gap-2">
                                <Calendar className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-900">LookAhead Period:</span>
                            </div>
                            <h1>From</h1>
                            <input type="date" value={weekStart} onChange={e => setWeekStart(e.target.value)} />
                            <h1>to</h1>
                            <input type="date" value={weekEnd} onChange={e => setWeekEnd(e.target.value)} />
                        </div>

                        {items.map((item, i) => (
                            <div key={i} className="grid grid-cols-4 gap-2">
                                <Input placeholder="Material" value={item.material_name} onChange={e => updateItem(i, "material_name", e.target.value)} />
                                <Input placeholder="Quantity" type="number" value={item.quantity_needed} onChange={e => updateItem(i, "quantity_needed", e.target.value)}/>
                                <Input placeholder="Unit" value={item.unit} onChange={e => updateItem(i, "unit", e.target.value)}/>
                                <Input placeholder="Remarks" value={item.remarks} onChange={e => updateItem(i, "remarks", e.target.value)}/>
                            </div>
                        ))}

                        <Button variant="outline" onClick={addRow}>
                            <Plus className="w-4 h-4" />
                            Add Row
                        </Button>
                        <Button onClick={submit}>Submit</Button>
                    </CardContent>
                </div>
            </div>
            
        </Card>
    )
}
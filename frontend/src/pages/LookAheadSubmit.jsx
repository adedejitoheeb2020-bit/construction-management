import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {createLookAhead} from "@/api/lookahead";
import { useParams } from "react-router-dom";

export default function LookAheadSubmit () {
    const {id} = useParams();
    const [items, setItems] = useState([{material_name: "", quantity_needed: "",
         unit: "", remarks: ""}])
    const [weekStart, setWeekStart] = useState("");
    const [weekEnd, setWeekEnd] = useState("");

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
        alert("Look-ahead submitted")
    }

    return (
        <Card>
            <CardHeader className="font-semibold">Weekly Look-ahead</CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-4">
                    <input type="date" value={weekStart} onChange={e => setWeekStart(e.target.value)} />
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

                <Button variant="outline" onClick={addRow}> + Add Row</Button>
                <Button onClick={submit}>Submit</Button>
            </CardContent>
        </Card>
    )
}
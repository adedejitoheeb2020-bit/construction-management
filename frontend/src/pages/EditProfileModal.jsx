import {useState, useEffect} from "react";
import api from "@/services/api";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import { jwtDecode } from "jwt-decode";

export default function EditProfileModal({open, onClose, user, setUser}) {
    const [form, setForm] = useState({
        username: user.username || "",
        phone: user.phone || "",
    })

    useEffect(() => {
        if (user) {
            setForm({
                username: user.username || "",
                phone: user.phone || "",
            })
        }
    }, [user])

    const handleChange = (e) => {
        setForm(prev => ({...prev, [e.target.name]: e.target.value}));
    }

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("access");
            if (token) {
                const decoded = jwtDecode(token)
                const userId = decoded.user_id
                const res = await api.patch(`/users/${userId}/`, form);
                setUser(res.data);
                onClose();
                window.location.reload();
            }
        }   catch (error) {error}
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>

                <label> Username
                    <Input 
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    />
                </label>
                
                <label> Phone Number
                    <Input 
                    name="phone"
                    type="tel"
                    placeholder="Phone number"
                    value={form.phone}
                    onChange={handleChange}
                    />
                </label>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Save Changes</Button>
                </div>

            </DialogContent>
        </Dialog>    
    )
}
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import EditProfileModal from "./EditProfileModal";
import api from "@/services/api";
import { Card } from "@/components/ui/card";
import {User, Briefcase, Phone, Building2} from "lucide-react";

export default function ProfilePage () {
    const [user, setUser] = useState({});
    const [open, setOpen] = useState(false);

    const fetchuser = async () => {
            const token = localStorage.getItem("access");
            const decoded = jwtDecode(token)
            const userId = decoded.user_id;
            const res = await api.get(`/users/${userId}`);
            console.log(res.data);
            setUser(res.data);
    }

    useEffect(() => {
        fetchuser();
    }, [])

    return (
        <Card>
            <div className="max-w-3xl p-4 space-y-6">
                <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-gray-200 text-3xl">{user.username?.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div>
                        <h2 className="text-2xl font-semibold">{user.username}</h2>
                        <p className="text-gray-500">{user.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <ProfileItem icon={<User />} label="Username" value={user.username || "-"} />
                    <ProfileItem icon={<Briefcase />} label="Role" value={user.role || "-"} />
                    <ProfileItem icon={<Phone />} label="Phone Number" value={user.phone || "-"} />
                    <ProfileItem icon={<Building2 />} label="Organization" value={user.organization_name || "-"} />
                </div>

                <Button onClick={() => setOpen(true)}>Edit Profile</Button>

                <EditProfileModal open={open} onClose={() => setOpen(false)} user={user} setUser={setUser} />
            </div>
        </Card>
    )
}

function ProfileItem({label, value, icon}) {
    return (
        <div className="flex gap-3 items-center">
            <div className="w-4 h-4">{icon}</div>
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="fony-medium">{value}</p>
            </div>
        </div>
    )
}
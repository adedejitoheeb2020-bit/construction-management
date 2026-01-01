import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useNavigate} from "react-router-dom";
import { useState,useEffect } from "react";
import { LogOut } from "lucide-react";
import {Button } from "@/components/ui/button";
import Modal from "./Modal";
import api from "@/services/api";
import { jwtDecode } from "jwt-decode";
import {Dialog, DialogTitle, DialogContent} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";

export default function TopBar() {
    const navigate = useNavigate();
    const [activeModal, setActiveModal] = useState(null);
    const [user, setUser] = useState({});
    const [form, setForm] = useState({password: "", confirmPassword: ""});
    const [errorMsg, setErrorMsg] = useState("")

    const handleChange = (e) => {
        setForm (prev => ({...prev, [e.target.name]: e.target.value}))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        
        if ( form.password !== form.confirmPassword ) {
            setErrorMsg("Password do not match!");
            return;
        }    

        try {
            const token = localStorage.getItem("access");
            if (token) {
                const decoded = jwtDecode(token);
                const userId = decoded.user_id;
                await api.patch(`/users/${userId}/`, form);
            }
            
        }   catch (error) {error}
    }

    const fetchuser = async () => {
        try {
            const token = localStorage.getItem("access");
            if (token) {
                const decoded = jwtDecode(token);
                const userId = decoded.user_id;
                console.log(userId);
                const res = await api.get(`/users/${userId}`);
                setUser(res.data);
            }
        }   catch (error) {console.error(error)}
        
    }

    useEffect(() => {
        fetchuser();
    }, [])

    return (
        <div className="flex items-center justify-between h-14 px-6">
            <h1 className="text-lg font-semibold">Hi, {user.username}</h1>

            <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.username?.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="text-left">
                        <p className="text-sm font-medium">{user.username}</p>
                        <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="bg-gray-200">
                    <DropdownMenuItem onClick={() => navigate("/profile")}>Profile</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveModal("Change password")}>Change Password</DropdownMenuItem>
                    <DropdownMenuItem onClick= {() => setActiveModal("logout")}>
                           <LogOut className="w-4 h-4"/>Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={activeModal === "Change password"} onOpenChange={() => setActiveModal(null)}>
                <DialogContent>
                    <DialogTitle>Change password</DialogTitle>
                    {errorMsg && (
                    <p className="mb-3 text-red-600 text-sm text-center"> {errorMsg} </p>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-3 ">
                        <div>
                            <label> Set new password
                                <Input 
                                name="password"
                                value={form.password}
                                placeholder="password"
                                type="password"
                                onChange={handleChange}
                                />
                            </label>
                        </div>

                        <div>
                            <label> Confirm password
                                <Input 
                                name="confirmPassword"
                                value={form.confirmPassword}
                                placeholder="Confirm password"
                                type="password"
                                onChange={handleChange}
                                />
                            </label>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button variant="ghost" onClick={() => setActiveModal(null)}>Cancel</Button>
                            <Button type="submit">Save Changes</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={activeModal === "logout"} onOpenChange={() => setActiveModal(null)}>
                <DialogContent>
                    <DialogTitle>Logout</DialogTitle>
                    <h2 className="mb-4">Are you sure you want to Logout?</h2>
                    <div className="flex justify-end gap-2">
                        <Button onClick={() => setActiveModal(null)} variant="ghost" >Cancel</Button>
                        <Button variant="destructive" onClick= {async () => {
                            await api.post("/auth/logout/");
                            setActiveModal(null);
                            localStorage.removeItem("access");
                            navigate("/");
                        }}
                        >Logout</Button>
                    </div>
                </DialogContent>
            </Dialog> 
        </div>
    )
}
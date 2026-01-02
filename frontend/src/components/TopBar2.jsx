import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useNavigate} from "react-router-dom";
import { useState,useEffect } from "react";
import { LogOut, User, KeyRound } from "lucide-react";
import {Button } from "@/components/ui/button";
import Modal from "./Modal";
import api from "@/services/api";
import { jwtDecode } from "jwt-decode";
import {Dialog, DialogTitle, DialogContent} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import NotificationBell from "./notifications/NotificationBell";

export default function TopBar() {
    const navigate = useNavigate();
    const [activeModal, setActiveModal] = useState(null);
    const [user, setUser] = useState({});
    const [form, setForm] = useState({current_password: "", new_password: "", re_new_password: ""});
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setForm (prev => ({...prev, [e.target.name]: e.target.value}))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setIsLoading(true);
        setSuccessMsg("");
        
        if ( form.new_password !== form.re_new_password ) {
            setErrorMsg("Password do not match!");
            return;
        }    

        try {
            await api.post("/auth/users/set_password/", form);
            setSuccessMsg("Password has been reset successfully!");
            setTimeout(() => {
                setActiveModal(null);
                navigate(-1);
            }, 2000)
            
        }   catch (error) {
            if (error.response && error.response.data) {
                const data = error.response.data;
                if (data.current_password) {
                    setErrorMsg("Invalid current password!")
                }
            }
        }   finally {setIsLoading(false);}
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

    useEffect(() => {
        if (errorMsg || successMsg) {
            const timer = setTimeout(() => {
                setErrorMsg("");
                setSuccessMsg("");
            }, 1000
            );
            return () => clearTimeout(timer);
        }
    }, [errorMsg, successMsg]);

    return (
        <div className="flex items-center justify-between h-14 px-6">
            <div className="flex gap-7 items-center">
                <h1 className="text-lg font-semibold">Hi, {user.username}</h1>
                <NotificationBell />
            </div>

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
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                        <User className="w-4 h-4"/>Profile</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveModal("Change password")}>
                        <KeyRound className="w-4 h-4"/>Change Password</DropdownMenuItem>
                    <DropdownMenuItem onClick= {() => setActiveModal("logout")}>
                        <LogOut className="w-4 h-4"/>Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={activeModal === "Change password"} onOpenChange={() => setActiveModal(null)}>
                    <DialogContent>
                        <div className=" relative p-8">
                            <div>
                                {errorMsg && (
                                    <div className="fixed top-1 left-1/2 -translate-x-1/2 bg-red-700 text-white
                                     px-4 py-3 rounded-lg shadow-lg transition-opacity duration-500">{errorMsg}</div>
                                )}

                                {successMsg && (
                                    <div className="fixed top-1 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg transition-opacity duration-500">{successMsg}</div>
                                )}
                            </div>

                            <div>
                                <DialogTitle>Change password</DialogTitle>
                                <form onSubmit={handleSubmit} className="space-y-3 ">
                                    <div>
                                        <label > Current Password
                                            <Input 
                                            name="current_password"
                                            value={form.current_password}
                                            type="password"
                                            onChange={handleChange}
                                            />
                                        </label>
                                    </div>

                                    <div>
                                        <label> New Password
                                            <Input 
                                            name="new_password"
                                            value={form.new_password}
                                            type="password"
                                            onChange={handleChange}
                                            />
                                        </label>
                                    </div>

                                    <div>
                                        <label> Confirm New Password
                                            <Input 
                                            name="re_new_password"
                                            value={form.re_new_password}
                                            type="password"
                                            onChange={handleChange}
                                            />
                                        </label>
                                    </div>


                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" onClick={() => setActiveModal(null)}>Cancel</Button>
                                        <Button type="submit" disabled={isLoading}>{isLoading ? "Saving...": "Save Changes"}</Button>
                                    </div>
                                </form>
                            </div>
                        </div>
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
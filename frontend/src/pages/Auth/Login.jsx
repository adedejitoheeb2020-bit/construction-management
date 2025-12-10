import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function login() {
    const [form, setForm] = useState({
        username: "",
        password: "",
    }
    );
    
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handlechange = (e) => {
        setForm ({...form, [e.target.name]: e.target.value});
    }

    const handlesubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            const res = await api.post(
                 "/auth/login/",
                 form,
            );
            if (res.data?.access) {
                localStorage.setItem("access", res.data.access);
            }
            
            navigate("/Dashboard");
        } catch (err) {
            console.log(err);
            setErrorMsg("Login failed")

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-300 p-5">
            <div className="w-full max-w-md bg-white shadow-lg rounded-4xl p-8">
                <form onSubmit={handlesubmit} className=" bg-white p-8 rounded shadow-md w-96">
                    <h1 className="text-2xl font-bold mb-4 text-center"> Login </h1>

                    <div>
                        <label className="text-gray-700 text-sm font-medium">Username</label>    
                        <input
                        type="text"
                        name="username"
                        autoComplete="username"
                        placeholder="Username"
                        className="border p-2 mb-3 w-full rounded-lg"
                        onChange={handlechange}
                        />
                    </div>

                    <div>
                        <label className="text-gray-700 text-sm font-medium"></label>    
                        <input
                        type="password"
                        name="password"
                        autoComplete="current-password"
                        placeholder="Password"
                        className="border p-2 mb-3 w-full rounded-lg"
                        onChange={handlechange}
                        />
                    </div>

                    <button
                    type="submit"
                    disabled={loading}
                    className={`text-white py-2 mt-2 w-full rounded-lg font-medium transition
                    ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-800"}`}
                    >
                    {loading ? "logging in ....": "Login"}
                    </button>
                    <h3 className="text-center text-sm mt-3">You don't have an account?{" "}
                    <Link to="/register" className="text-blue-600 underline">Register</Link>
                    </h3>
                </form>
            </div>
        </div>
    );
}


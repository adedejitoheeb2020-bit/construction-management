import { useState} from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Register() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const handlechange = (e) => {
        setForm({...form, [e.target.name]: e.target.value})
    }
    const navigate = useNavigate();

    const handlesubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        if ( form.password !== form.confirmPassword ) {
            setErrorMsg("Password do not match!");
            return;
        }

        setLoading(true);

        try {
            const res = await api.post(
                "/auth/register/",
                form,
            );

            if (res.data?.access) {
                localStorage.setItem ("access", res.data.access);
            }
            
            setSuccessMsg("Account created successfully!");

            setTimeout(() => {
                navigate("/Dashboard");
            }, 1500);

        }   catch (err) {
            console.log(err);
            setErrorMsg("Registration failed");

        }   finally {
              setLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-300 p-5">
            <div className="w-full max-w-md bg-white shadow-lg rounded-4xl p-8">
                {errorMsg && (
                    <p className="mb-3 text-red-600 text-sm text-center"> {errorMsg} </p>
                )}

                {successMsg && (
                    <p className="mb-3 text-green-600 text-sm text-center"> {successMsg} </p>
                )}

                <form onSubmit={handlesubmit} className="bg-white p-8 rounded shadow-md w-96">
                    <h2 className="text-2xl font-bold mb-4 text-center"> Create account</h2>

                    <div>
                        <label className="text-gray-700 text-sm font-medium">Username
                            <input
                            type="text"
                            name="username"
                            autoComplete="username"
                            value={form.username}
                            placeholder="Username"
                            className="border p-2 mb-3 w-full rounded-lg"
                            onChange={handlechange}
                            />
                        </label>
                    </div>

                    <div>
                        <label className="text-gray-700 text-sm font-medium">Email
                            <input
                            type="email"
                            name="email"
                            autoComplete="email"
                            value={form.email}
                            placeholder="Email"
                            className="border p-2 mb-3 w-full rounded-lg"
                            onChange={handlechange}
                            />
                        </label>
                    </div>

                    <div>
                        <label className="text-gray-700 text-sm font-medium">Password
                            <input
                            type="password"
                            name="password"
                            autoComplete="new-pasword"
                            value={form.password}
                            placeholder="Password"
                            className="border p-2 mb-3 w-full rounded-lg"
                            onChange={handlechange}
                            />
                        </label>
                    </div>

                    <div>
                        <label className="text-gray-700 text-sm font-medium">Confirm Password
                            <input
                            type="password"
                            name="confirmPassword"
                            autoComplete="new-password"
                            value={form.confirmPassword}
                            placeholder="Confirm Password"
                            className="border p-2 mb-3 w-full rounded-lg"
                            onChange={handlechange}
                            />
                        </label>
                    </div>
                    
                    <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 mt-2 rounded-lg text-white font-medium transition 
                    ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-800"}`}
                    >
                    {loading ? "Creating account..." : "Register"}
                    </button>

                    <p className="text-center text-sm mt-3">Already have an account?{" "}
                    <Link to="/" className="text-blue-600 underline">Login</Link>
                    </p>
                </form>
            </div>

        </div>
    )

}


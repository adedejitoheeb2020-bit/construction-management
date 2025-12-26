export default function Button ({children, onClick, variant = "primary", className = "", ...props}) {
    const base = "px-4 py-2 rounded-md font-medium focus:outline-none";
    const variants = {
        primary: "bg-black text-white hover:bg-black-700",
        ghost: "bg-transparent text-gray-700 hover:bg-gray-300",
        danger: "bg-red-600 text-white hover:bg-red-700",
    }
    return (
        <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`} {...props}>{children}</button>
    )
}
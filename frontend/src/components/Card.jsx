export default function Card({title, children, className=""}) {
    return (
        <div className={`bg-gray-200 rounded-xl shadow p-5 ${className}`}>
            {title && <h3 className="text-sm text-gray-500 mb-2">{title}</h3>}
            <div>{children}</div>
        </div>
    )
}
import Button from "./Button"
export default function Modal({ open, onClose, title, children }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg w-full max-w-lg p-6 relative">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <Button onClick={onClose} variant="ghost">X</Button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    )
}
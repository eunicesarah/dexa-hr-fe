const Button = ({ label, onClick, variant="red-button" || "hyperlink" || "add" }) => {
    return (
        <button onClick={onClick} className={`w-full p-2 rounded transition duration-200 ${variant === "red-button" ? "bg-red text-white hover:bg-mandarin rounded-full px-4" : variant === "hyperlink" ? "bg-transparent text-blue-500 underline" : variant === "add" ? "bg-yellow text-white hover:bg-red rounded-full w-fit px-4" : ""}`}>
            {label}
        </button>
    );
};

export default Button;
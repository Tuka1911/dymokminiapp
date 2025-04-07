export function Input({ value, onChange, placeholder, className }) {
    return (
        <input
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`px-3 py-2 rounded-xl ${className}`}
        />
    );
}

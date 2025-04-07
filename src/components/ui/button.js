export function Button({ children, className = '', onClick, size = 'base', variant = 'default' }) {
    return (
        <button
            className={`px-4 py-2 rounded-xl ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

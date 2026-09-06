import { Link } from "react-router-dom";

/**
 * Reusable Button component for VOLTIX design system.
 * Supports primary gradient, secondary, outline, and ghost variants.
 * Automatically renders as a React Router Link if 'to' prop is provided.
 */
const Button = ({
    children,
    to,
    variant = "primary",
    size = "md",
    className = "",
    onClick,
    disabled = false,
    isLoading = false,
    type = "button",
    ariaLabel,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60";

    const variantStyles = {
        primary: "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30",
        secondary: "bg-slate-900 text-white shadow-md hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-lg",
        outline: "border border-slate-300 bg-white text-slate-700 hover:border-blue-500 hover:text-blue-600 hover:-translate-y-0.5 hover:shadow-md",
        white: "bg-white text-blue-700 shadow-xl hover:-translate-y-0.5 hover:scale-105 hover:bg-blue-50",
        ghost: "bg-transparent text-slate-700 hover:bg-slate-100 hover:text-blue-600"
    };

    const sizeStyles = {
        sm: "px-4 py-2 text-xs",
        md: "px-6 py-3 text-sm",
        lg: "px-8 py-4 text-base"
    };

    const combinedClassName = `${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size] || sizeStyles.md} ${className}`.trim();

    const content = (
        <>
            {isLoading && (
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}
            {children}
        </>
    );

    if (to) {
        return (
            <Link
                to={to}
                className={combinedClassName}
                aria-label={ariaLabel}
                onClick={onClick}
                {...props}
            >
                {content}
            </Link>
        );
    }

    return (
        <button
            type={type}
            className={combinedClassName}
            onClick={onClick}
            disabled={disabled || isLoading}
            aria-label={ariaLabel}
            {...props}
        >
            {content}
        </button>
    );
};

export default Button;

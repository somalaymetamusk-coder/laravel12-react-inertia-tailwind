import { InputHTMLAttributes, forwardRef } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, Props>(
    ({ label, error, className = '', id, ...props }, ref) => {
        const inputId = id || props.name;

        return (
            <div>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={`
                        block w-full rounded-lg border-gray-300 shadow-sm
                        focus:border-indigo-500 focus:ring-indigo-500
                        disabled:bg-gray-100 disabled:cursor-not-allowed
                        text-sm px-4 py-2.5 border
                        ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                        ${className}
                    `}
                    {...props}
                />
                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;

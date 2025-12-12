interface Props {
    label?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    error?: string;
    disabled?: boolean;
}

export default function Toggle({ label, checked, onChange, error, disabled = false }: Props) {
    return (
        <div>
            <label className="flex items-center cursor-pointer">
                <div className="relative">
                    <input
                        type="checkbox"
                        className="sr-only"
                        checked={checked}
                        onChange={(e) => onChange(e.target.checked)}
                        disabled={disabled}
                    />
                    <div
                        className={`
                            w-11 h-6 rounded-full shadow-inner transition-colors duration-200
                            ${checked ? 'bg-indigo-600' : 'bg-gray-300'}
                            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                    />
                    <div
                        className={`
                            absolute w-4 h-4 bg-white rounded-full shadow top-1 left-1
                            transition-transform duration-200
                            ${checked ? 'translate-x-5' : 'translate-x-0'}
                        `}
                    />
                </div>
                {label && (
                    <span className="ml-3 text-sm font-medium text-gray-700">{label}</span>
                )}
            </label>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}

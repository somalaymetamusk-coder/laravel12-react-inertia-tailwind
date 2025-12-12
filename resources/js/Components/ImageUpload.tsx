import { ChangeEvent, useRef } from 'react';

interface Props {
    label?: string;
    onChange: (files: File | File[] | null) => void;
    error?: string;
    multiple?: boolean;
    preview?: string | null;
    accept?: string;
}

export default function ImageUpload({
    label,
    onChange,
    error,
    multiple = false,
    preview,
    accept = 'image/*',
}: Props) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            if (multiple) {
                onChange(Array.from(files));
            } else {
                onChange(files[0] || null);
            }
        }
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleRemove = () => {
        if (inputRef.current) {
            inputRef.current.value = '';
        }
        onChange(null);
    };

    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            )}

            <div className="flex items-center gap-4">
                {preview && (
                    <div className="relative">
                        <img
                            src={preview}
                            alt="Preview"
                            className="h-24 w-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}

                <div
                    onClick={handleClick}
                    className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 transition-colors"
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept={accept}
                        multiple={multiple}
                        onChange={handleChange}
                        className="hidden"
                    />
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 48 48"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">
                        {multiple ? 'Click to upload images' : 'Click to upload an image'}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                </div>
            </div>

            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}

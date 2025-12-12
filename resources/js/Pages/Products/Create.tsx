import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import TextArea from '@/Components/TextArea';
import Toggle from '@/Components/Toggle';
import ImageUpload from '@/Components/ImageUpload';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        price: '',
        stock: '0',
        sku: '',
        feature_image: null as File | null,
        is_active: true,
        gallery_images: [] as File[],
    });

    const [featurePreview, setFeaturePreview] = useState<string | null>(null);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

    const handleFeatureImageChange = (file: File | File[] | null) => {
        if (file && !Array.isArray(file)) {
            setData('feature_image', file);
            setFeaturePreview(URL.createObjectURL(file));
        } else {
            setData('feature_image', null);
            setFeaturePreview(null);
        }
    };

    const handleGalleryImagesChange = (files: File | File[] | null) => {
        if (files && Array.isArray(files)) {
            setData('gallery_images', [...data.gallery_images, ...files]);
            const newPreviews = files.map((file) => URL.createObjectURL(file));
            setGalleryPreviews([...galleryPreviews, ...newPreviews]);
        }
    };

    const removeGalleryImage = (index: number) => {
        const newGalleryImages = [...data.gallery_images];
        newGalleryImages.splice(index, 1);
        setData('gallery_images', newGalleryImages);

        const newPreviews = [...galleryPreviews];
        newPreviews.splice(index, 1);
        setGalleryPreviews(newPreviews);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/products', {
            forceFormData: true,
        });
    };

    return (
        <AppLayout title="Create Product">
            <Head title="Create Product" />

            <div className="mb-6">
                <Link
                    href="/products"
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Products
                </Link>
            </div>

            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Product Name"
                                name="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                error={errors.name}
                                required
                                placeholder="Enter product name"
                            />

                            <Input
                                label="SKU"
                                name="sku"
                                value={data.sku}
                                onChange={(e) => setData('sku', e.target.value)}
                                error={errors.sku}
                                placeholder="Enter unique SKU"
                            />
                        </div>

                        <TextArea
                            label="Description"
                            name="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            error={errors.description}
                            rows={4}
                            placeholder="Enter product description"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Price"
                                name="price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                error={errors.price}
                                required
                                placeholder="0.00"
                            />

                            <Input
                                label="Stock"
                                name="stock"
                                type="number"
                                min="0"
                                value={data.stock}
                                onChange={(e) => setData('stock', e.target.value)}
                                error={errors.stock}
                                required
                                placeholder="0"
                            />
                        </div>

                        <Toggle
                            label="Active"
                            checked={data.is_active}
                            onChange={(checked) => setData('is_active', checked)}
                            error={errors.is_active}
                        />

                        <ImageUpload
                            label="Feature Image"
                            onChange={handleFeatureImageChange}
                            error={errors.feature_image}
                            preview={featurePreview}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Gallery Images
                            </label>

                            {galleryPreviews.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                                    {galleryPreviews.map((preview, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={preview}
                                                alt={`Gallery ${index + 1}`}
                                                className="h-24 w-full object-cover rounded-lg border border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeGalleryImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <ImageUpload
                                onChange={handleGalleryImagesChange}
                                error={errors.gallery_images as unknown as string}
                                multiple
                            />
                        </div>
                    </div>

                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 rounded-b-lg">
                        <Link href="/products">
                            <Button type="button" variant="secondary">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" loading={processing}>
                            Create Product
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

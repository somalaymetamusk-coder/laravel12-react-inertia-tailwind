import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import Button from '@/Components/Button';
import Modal from '@/Components/Modal';
import { Product } from '@/types';

interface Props {
    product: Product;
}

export default function Show({ product }: Props) {
    const [deleteModal, setDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(route('products.destroy', product.id), {
            onSuccess: () => {
                setDeleteModal(false);
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    const formatPrice = (price: number | string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(Number(price));
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout title={product.name}>
            <Head title={product.name} />

            <div className="mb-6 flex justify-between items-center">
                <Link
                    href={route('products.index')}
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Products
                </Link>

                <div className="flex gap-3">
                    <Link href={route('products.edit', product.id)}>
                        <Button variant="secondary">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                        </Button>
                    </Link>
                    <Button variant="danger" onClick={() => setDeleteModal(true)}>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                        {product.feature_image ? (
                            <img
                                src={`/storage/${product.feature_image}`}
                                alt={product.name}
                                className="w-full h-80 object-cover cursor-pointer"
                                onClick={() => setSelectedImage(`/storage/${product.feature_image}`)}
                            />
                        ) : (
                            <div className="w-full h-80 bg-gray-100 flex items-center justify-center">
                                <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        )}
                    </div>

                    {product.galleries && product.galleries.length > 0 && (
                        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Gallery</h3>
                            <div className="grid grid-cols-4 gap-2">
                                {product.galleries.map((gallery) => (
                                    <img
                                        key={gallery.id}
                                        src={`/storage/${gallery.image_path}`}
                                        alt={gallery.image_name || 'Gallery image'}
                                        className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                                        onClick={() => setSelectedImage(`/storage/${gallery.image_path}`)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                                {product.sku && (
                                    <p className="text-sm text-gray-500 mt-1">SKU: {product.sku}</p>
                                )}
                            </div>
                            <span
                                className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                                    product.is_active
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                }`}
                            >
                                {product.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>

                        <div className="text-3xl font-bold text-indigo-600 mb-6">
                            {formatPrice(product.price)}
                        </div>

                        {product.description && (
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                                <p className="text-gray-600 whitespace-pre-wrap">{product.description}</p>
                            </div>
                        )}

                        <div className="border-t border-gray-200 pt-6">
                            <dl className="grid grid-cols-2 gap-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Stock</dt>
                                    <dd
                                        className={`mt-1 text-lg font-semibold ${
                                            product.stock > 10
                                                ? 'text-green-600'
                                                : product.stock > 0
                                                ? 'text-yellow-600'
                                                : 'text-red-600'
                                        }`}
                                    >
                                        {product.stock} units
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                                    <dd className="mt-1 text-lg font-semibold text-gray-900">
                                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">Timestamps</h3>
                        <dl className="space-y-3">
                            <div>
                                <dt className="text-sm text-gray-500">Created</dt>
                                <dd className="text-sm text-gray-900">{formatDate(product.created_at)}</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-gray-500">Last Updated</dt>
                                <dd className="text-sm text-gray-900">{formatDate(product.updated_at)}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={deleteModal}
                onClose={() => setDeleteModal(false)}
                title="Delete Product"
                footer={
                    <>
                        <Button variant="danger" onClick={handleDelete} loading={isDeleting}>
                            Delete
                        </Button>
                        <Button variant="secondary" onClick={() => setDeleteModal(false)}>
                            Cancel
                        </Button>
                    </>
                }
            >
                <p className="text-gray-600">
                    Are you sure you want to delete{' '}
                    <span className="font-semibold text-gray-900">{product.name}</span>?
                    This action cannot be undone.
                </p>
            </Modal>

            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 text-white hover:text-gray-300"
                        onClick={() => setSelectedImage(null)}
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <img
                        src={selectedImage}
                        alt="Full size"
                        className="max-w-full max-h-full object-contain"
                    />
                </div>
            )}
        </AppLayout>
    );
}

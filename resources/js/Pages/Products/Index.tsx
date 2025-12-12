import { Link, Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Button from '@/Components/Button';
import Pagination from '@/Components/Pagination';
import Modal from '@/Components/Modal';
import { Product, PaginatedData } from '@/types';
import { useState } from 'react';

interface Props {
    products: PaginatedData<Product>;
}

export default function Index({ products }: Props) {
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; product: Product | null }>({
        isOpen: false,
        product: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);

    const openDeleteModal = (product: Product) => {
        setDeleteModal({ isOpen: true, product });
    };

    const closeDeleteModal = () => {
        setDeleteModal({ isOpen: false, product: null });
    };

    const handleDelete = () => {
        if (!deleteModal.product) return;

        setIsDeleting(true);
        router.delete(`/products/${deleteModal.product.id}`, {
            onSuccess: () => {
                closeDeleteModal();
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

    return (
        <AppLayout title="Products">
            <Head title="Products" />

            <div className="mb-6 flex justify-between items-center">
                <p className="text-gray-600">Manage your product catalog</p>
                <Link href="/products/create">
                    <Button>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Product
                    </Button>
                </Link>
            </div>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Product
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                SKU
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Stock
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.data.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                        />
                                    </svg>
                                    <p className="mt-4 text-lg font-medium">No products found</p>
                                    <p className="mt-2">Get started by creating a new product.</p>
                                    <div className="mt-6">
                                        <Link href="/products/create">
                                            <Button>Add Product</Button>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            products.data.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-12 w-12 flex-shrink-0">
                                                {product.feature_image ? (
                                                    <img
                                                        className="h-12 w-12 rounded-lg object-cover"
                                                        src={`/storage/${product.feature_image}`}
                                                        alt={product.name}
                                                    />
                                                ) : (
                                                    <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                                        <svg
                                                            className="h-6 w-6 text-gray-400"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                            />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {product.name}
                                                </div>
                                                {product.description && (
                                                    <div className="text-sm text-gray-500 truncate max-w-xs">
                                                        {product.description}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {product.sku || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                        {formatPrice(product.price)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span
                                            className={`${
                                                product.stock > 10
                                                    ? 'text-green-600'
                                                    : product.stock > 0
                                                    ? 'text-yellow-600'
                                                    : 'text-red-600'
                                            }`}
                                        >
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                product.is_active
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}
                                        >
                                            {product.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/products/${product.id}`}
                                                className="text-gray-600 hover:text-gray-900"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </Link>
                                            <Link
                                                href={`/products/${product.id}/edit`}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </Link>
                                            <button
                                                onClick={() => openDeleteModal(product)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <Pagination
                    links={products.links}
                    from={products.from}
                    to={products.to}
                    total={products.total}
                />
            </div>

            <Modal
                isOpen={deleteModal.isOpen}
                onClose={closeDeleteModal}
                title="Delete Product"
                footer={
                    <>
                        <Button variant="danger" onClick={handleDelete} loading={isDeleting}>
                            Delete
                        </Button>
                        <Button variant="secondary" onClick={closeDeleteModal}>
                            Cancel
                        </Button>
                    </>
                }
            >
                <p className="text-gray-600">
                    Are you sure you want to delete{' '}
                    <span className="font-semibold text-gray-900">{deleteModal.product?.name}</span>?
                    This action cannot be undone.
                </p>
            </Modal>
        </AppLayout>
    );
}

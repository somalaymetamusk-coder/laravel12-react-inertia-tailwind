import { Link } from '@inertiajs/react';
import { PaginationLink } from '@/types';

interface Props {
    links: PaginationLink[];
    from: number | null;
    to: number | null;
    total: number;
}

export default function Pagination({ links, from, to, total }: Props) {
    if (links.length <= 3) return null;

    return (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-b-lg">
            <div className="flex flex-1 justify-between sm:hidden">
                {links[0].url && (
                    <Link
                        href={links[0].url}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Previous
                    </Link>
                )}
                {links[links.length - 1].url && (
                    <Link
                        href={links[links.length - 1].url}
                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Next
                    </Link>
                )}
            </div>

            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{from || 0}</span> to{' '}
                        <span className="font-medium">{to || 0}</span> of{' '}
                        <span className="font-medium">{total}</span> results
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        {links.map((link, index) => {
                            const isFirst = index === 0;
                            const isLast = index === links.length - 1;

                            if (link.url === null) {
                                return (
                                    <span
                                        key={index}
                                        className={`
                                            relative inline-flex items-center px-4 py-2 text-sm font-medium
                                            text-gray-400 bg-white border border-gray-300
                                            ${isFirst ? 'rounded-l-md' : ''}
                                            ${isLast ? 'rounded-r-md' : ''}
                                        `}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                );
                            }

                            return (
                                <Link
                                    key={index}
                                    href={link.url}
                                    className={`
                                        relative inline-flex items-center px-4 py-2 text-sm font-medium
                                        border transition-colors duration-200
                                        ${isFirst ? 'rounded-l-md' : ''}
                                        ${isLast ? 'rounded-r-md' : ''}
                                        ${
                                            link.active
                                                ? 'z-10 bg-indigo-600 border-indigo-600 text-white'
                                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }
                                    `}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            );
                        })}
                    </nav>
                </div>
            </div>
        </div>
    );
}

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { route as ziggyRoute } from 'ziggy-js';

// Make route function globally available
declare global {
    var route: typeof ziggyRoute;
}
globalThis.route = (name?: string, params?: Record<string, unknown>, absolute?: boolean) => {
    return ziggyRoute(name as string, params, absolute, window.Ziggy);
};

createInertiaApp({
    title: (title) => (title ? `${title} - Laravel` : 'Laravel'),
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.tsx', { eager: true });
        return pages[`./Pages/${name}.tsx`];
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

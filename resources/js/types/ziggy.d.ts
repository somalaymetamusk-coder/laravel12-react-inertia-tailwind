import { Config, RouteParams, Router } from 'ziggy-js';

declare global {
    function route(): Router;
    function route(name: string, params?: RouteParams<string>, absolute?: boolean, config?: Config): string;

    interface Window {
        Ziggy: Config;
    }
}

export { Config, RouteParams, Router };

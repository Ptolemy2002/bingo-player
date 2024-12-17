import clsx from 'clsx';
import { NotFoundPageProps } from './Types';

export default function NotFoundPageBase({className}: NotFoundPageProps) {
    return (
        <div id="not-found-page" className={clsx("col", className)}>
            <h1>404 Not Found</h1>
            <p>The page you are looking for does not exist. Use the sidebar to navigate to a different page.</p>
        </div>
    );
}
import {ReactNode} from 'react';

export default function Footer({children}: {children: ReactNode}) {
    return <footer>
        <p>
            {children}
        </p>
    </footer>;
}

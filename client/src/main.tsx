import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from 'src/App.tsx';
import { AlertVariant, createGlobalStyle, css } from 'styled-components';
import { NamedThemeProvider } from 'src/NamedTheme.tsx';
import { ErrorBoundary } from 'react-error-boundary';
import { EnvProvider } from 'src/Env';
import CacheProvider from "react-inlinesvg/provider";

export const GlobalStyle = createGlobalStyle`
    :root {
        font-family:
            -apple-system,
            BlinkMacSystemFont,
            'Segoe UI',
            Roboto,
            'Helvetica Neue',
            Arial,
            sans-serif
        ;
    }

    // Make sure the root takes up the full height of the screen
    #root {
        // dvh is better for mobile browsers
        height: 100dvh;

        padding: 10px;
        // Border-box here lets us ensure the padding doesn't add to the vertical space taken,
        // causing a scrollbar to appear when it shouldn't
        box-sizing: border-box;
        
        display: flex;
        flex-direction: column;

        overflow-anchor: none; // Fixes a few React bugs

        color: ${({ theme }) => theme.textColor};
        li::marker {
            color: ${({ theme }) => theme.textColor};
        }

        background-color: ${({ theme }) => theme.backgroundColor};
    }

    body {
        margin: 0;
    }

    main {
        flex-grow: 1;
    }

    footer {
        margin: 0;
        width: 100%;
    }

    // Override Bootstrap Alert styles where applicable
    ${({ theme }) => {
        if (!theme.alert) return null;

        return Object.entries(theme.alert).map(([variant, styles]) => {
            variant = variant as AlertVariant;

            return css`
                .alert-${variant} {
                    ${styles.backgroundColor && `--bs-alert-bg: ${styles.backgroundColor};`}
                    ${styles.textColor && `--bs-alert-color: ${styles.textColor};`}
                    ${(styles.borderColor) && `--bs-alert-border-color: ${styles.borderColor};`}
                    ${(styles.linkColor ?? styles.textColor) && `--bs-alert-link-color: ${styles.linkColor ?? styles.textColor};`}
                }  
            `;
        });
    }}
`;

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <CacheProvider>
            <NamedThemeProvider initial="dark">
                <GlobalStyle />

                <ErrorBoundary fallback={<p id="fatal-error">Fatal Error</p>}>
                    <EnvProvider>
                        <App />
                    </EnvProvider>
                </ErrorBoundary>
            </NamedThemeProvider>
        </CacheProvider>
    </StrictMode>,
)

import { bingoRegistry, BingoSchemas, socketRegistry, SocketSchemas } from "shared";
import escapeHTML from "escape-html";
import { getSocketConsumers } from "./socket";

// Type definitions for schema structures
interface BaseSchema {
    id: string;
    type: string;
    description?: string;
    example?: unknown;
    examples?: unknown[];
}

interface EventSchema extends BaseSchema {
    eventName?: string;
}

// Cache for the generated HTML
let cachedHTML: string | null = null;

/**
 * Generates an HTML documentation page for the Socket.IO API
 * @param createNew - If true, regenerates the documentation even if cached
 * @param excludedEventNames - Event names to exclude from the documentation
 * @returns HTML string for the documentation page
 */
export function getDocsHTML(createNew = false, excludedEventNames: string[] = []): string {
    // Return cached version if available and not forcing regeneration
    if (!createNew && cachedHTML !== null && excludedEventNames.length === 0) {
        return cachedHTML;
    }

    const consumers = getSocketConsumers();
    const excludedSet = new Set(excludedEventNames);

    // Organize socket schemas by event name and type
    const eventSchemas = new Map<string, Map<string, EventSchema[]>>();
    const otherSocketTypes: EventSchema[] = [];
    const allPropSchemas: EventSchema[] = [];

    for (const schemaKey of SocketSchemas) {
        const schema = socketRegistry.get(schemaKey) as EventSchema | undefined;
        if (!schema) continue;

        if (schema.type === 'prop') {
            allPropSchemas.push(schema);
            continue;
        }

        if (schema.eventName) {
            if (excludedSet.has(schema.eventName)) continue;

            if (!eventSchemas.has(schema.eventName)) {
                eventSchemas.set(schema.eventName, new Map());
            }
            const eventMap = eventSchemas.get(schema.eventName)!;
            if (!eventMap.has(schema.type)) {
                eventMap.set(schema.type, []);
            }
            eventMap.get(schema.type)!.push(schema);
        } else if (schema.type === 'other') {
            otherSocketTypes.push(schema);
        }
    }

    // Organize bingo schemas by type
    const bingoTypes = new Map<string, BaseSchema[]>();
    for (const schemaKey of BingoSchemas) {
        const schema = bingoRegistry.get(schemaKey) as BaseSchema | undefined;
        if (!schema) continue;

        if (schema.type === 'prop') {
            allPropSchemas.push(schema as EventSchema);
        }

        if (!bingoTypes.has(schema.type)) {
            bingoTypes.set(schema.type, []);
        }
        bingoTypes.get(schema.type)!.push(schema);
    }

    // Separate client-to-server events (have args) from server-to-client (message-data only)
    const clientToServerEvents: string[] = [];
    const serverToClientEvents: string[] = [];

    for (const [eventName, types] of eventSchemas) {
        if (types.has('args')) {
            clientToServerEvents.push(eventName);
        } else if (types.has('message-data')) {
            serverToClientEvents.push(eventName);
        }
    }

    clientToServerEvents.sort();
    serverToClientEvents.sort();

    // Build HTML
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bingo Socket.IO API Documentation</title>
    <style>
        :root {
            --primary: #3b82f6;
            --primary-dark: #2563eb;
            --success: #22c55e;
            --warning: #eab308;
            --error: #ef4444;
            --bg: #f8fafc;
            --card-bg: #ffffff;
            --text: #1e293b;
            --text-muted: #64748b;
            --border: #e2e8f0;
            --code-bg: #1e293b;
            --code-text: #e2e8f0;
        }
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: var(--bg);
            color: var(--text);
            line-height: 1.6;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        header {
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            color: white;
            padding: 3rem 2rem;
            margin-bottom: 2rem;
        }
        
        header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
        header p { opacity: 0.9; font-size: 1.1rem; }
        
        nav {
            background: var(--card-bg);
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 2rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        nav h2 { font-size: 1.25rem; margin-bottom: 1rem; color: var(--text); }
        
        .nav-section { margin-bottom: 1rem; }
        .nav-section h3 { font-size: 0.875rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.5rem; }
        .nav-links { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .nav-links a {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            padding: 0.25rem 0.75rem;
            background: var(--bg);
            border-radius: 4px;
            text-decoration: none;
            color: var(--primary);
            font-size: 0.875rem;
            transition: background 0.2s;
        }
        .nav-links a:hover { background: var(--border); }
        .nav-links a .status {
            width: 8px;
            height: 8px;
            border-radius: 50%;
        }
        .nav-links a .status.implemented { background: var(--success); }
        .nav-links a .status.not-implemented { background: var(--warning); }
        
        section {
            background: var(--card-bg);
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        section > h2 {
            font-size: 1.5rem;
            border-bottom: 2px solid var(--border);
            padding-bottom: 0.75rem;
            margin-bottom: 1.5rem;
        }
        
        .event-card {
            border: 1px solid var(--border);
            border-radius: 6px;
            margin-bottom: 1.5rem;
            overflow: hidden;
        }
        
        .event-header {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem;
            background: var(--bg);
            border-bottom: 1px solid var(--border);
        }
        
        .event-header h3 {
            font-family: 'SF Mono', Monaco, Consolas, monospace;
            font-size: 1.1rem;
            color: var(--primary-dark);
        }
        
        .badge {
            padding: 0.125rem 0.5rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 500;
        }
        .badge.implemented { background: #dcfce7; color: #166534; }
        .badge.not-implemented { background: #fef9c3; color: #854d0e; }
        .badge.type { background: #dbeafe; color: #1e40af; }
        
        .event-body { padding: 1rem; }
        .event-description { color: var(--text-muted); margin-bottom: 1rem; }
        
        .schema-section { margin-top: 1rem; }
        .schema-section h4 {
            font-size: 0.875rem;
            text-transform: uppercase;
            color: var(--text-muted);
            margin-bottom: 0.5rem;
        }
        
        .schema-item {
            background: var(--bg);
            border-radius: 4px;
            padding: 0.75rem;
            margin-bottom: 0.5rem;
        }
        
        .schema-item .schema-id {
            font-family: 'SF Mono', Monaco, Consolas, monospace;
            font-weight: 600;
            color: var(--primary-dark);
        }
        
        .schema-item .schema-desc { font-size: 0.9rem; color: var(--text-muted); margin-top: 0.25rem; }
        
        .prop-item {
            padding: 0.5rem 0.75rem;
            border-left: 3px solid var(--border);
            margin-left: 1rem;
            margin-bottom: 0.5rem;
        }
        
        .prop-name {
            font-family: 'SF Mono', Monaco, Consolas, monospace;
            font-weight: 500;
            color: var(--text);
        }
        
        pre {
            background: var(--code-bg);
            color: var(--code-text);
            padding: 1rem;
            border-radius: 6px;
            overflow-x: auto;
            font-size: 0.875rem;
            margin-top: 0.5rem;
        }
        
        code {
            font-family: 'SF Mono', Monaco, Consolas, monospace;
            font-size: 0.875rem;
        }
        
        .inline-code {
            background: var(--bg);
            padding: 0.125rem 0.375rem;
            border-radius: 3px;
            font-size: 0.85em;
        }
        
        .type-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1rem;
        }
        
        .type-card {
            border: 1px solid var(--border);
            border-radius: 6px;
            padding: 1rem;
        }
        
        .type-card h4 {
            font-family: 'SF Mono', Monaco, Consolas, monospace;
            color: var(--primary-dark);
            margin-bottom: 0.5rem;
        }
        
        .type-card p { font-size: 0.9rem; color: var(--text-muted); }

        footer {
            text-align: center;
            padding: 2rem;
            color: var(--text-muted);
            font-size: 0.875rem;
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <h1>Bingo Socket.IO API</h1>
            <p>Real-time multiplayer bingo game API documentation</p>
        </div>
    </header>
    
    <div class="container">
        <nav>
            <h2>Quick Navigation</h2>
            <div class="nav-section">
                <h3>Client → Server Events</h3>
                <div class="nav-links">
                    ${clientToServerEvents.map(name => {
                        const isImplemented = name in consumers;
                        return `<a href="#event-${escapeHTML(name)}"><span class="status ${isImplemented ? 'implemented' : 'not-implemented'}"></span>${escapeHTML(name)}</a>`;
                    }).join('\n                    ')}
                </div>
            </div>
            <div class="nav-section">
                <h3>Server → Client Events</h3>
                <div class="nav-links">
                    ${serverToClientEvents.map(name => 
                        `<a href="#event-${escapeHTML(name)}">${escapeHTML(name)}</a>`
                    ).join('\n                    ')}
                </div>
            </div>
            <div class="nav-section">
                <h3>Types</h3>
                <div class="nav-links">
                    <a href="#types-socket">Socket Types</a>
                    <a href="#types-game">Game Elements</a>
                    <a href="#types-collections">Collections</a>
                </div>
            </div>
        </nav>

        <section id="client-to-server">
            <h2>Client → Server Events</h2>
            ${clientToServerEvents.map(eventName => renderClientToServerEvent(eventName, eventSchemas.get(eventName)!, consumers, allPropSchemas)).join('\n')}
        </section>

        <section id="server-to-client">
            <h2>Server → Client Events</h2>
            ${serverToClientEvents.map(eventName => renderServerToClientEvent(eventName, eventSchemas.get(eventName)!, allPropSchemas)).join('\n')}
        </section>

        <section id="types-socket">
            <h2>Socket Types</h2>
            <div class="type-grid">
                ${otherSocketTypes.map(schema => renderTypeCard(schema)).join('\n')}
            </div>
        </section>

        <section id="types-game">
            <h2>Game Elements</h2>
            <div class="type-grid">
                ${(bingoTypes.get('game-element') || []).map(schema => renderTypeCard(schema)).join('\n')}
            </div>
        </section>

        <section id="types-collections">
            <h2>Collections</h2>
            <div class="type-grid">
                ${(bingoTypes.get('collection') || []).map(schema => renderTypeCard(schema)).join('\n')}
            </div>
        </section>
    </div>
    
    <footer>
        <p>Generated from API schemas</p>
    </footer>
</body>
</html>`;

    // Cache the result if no exclusions
    if (excludedEventNames.length === 0) {
        cachedHTML = html;
    }

    return html;
}

function renderClientToServerEvent(
    eventName: string, 
    types: Map<string, EventSchema[]>, 
    consumers: Record<string, unknown>,
    propSchemas: EventSchema[]
): string {
    const isImplemented = eventName in consumers;
    const argsSchemas = types.get('args') || [];
    const successSchemas = types.get('success-response') || [];
    const responseSchemas = types.get('response') || [];

    const mainArgs = argsSchemas[0];
    const mainSuccess = successSchemas[0];
    const mainResponse = responseSchemas[0];

    // Find property schemas for this event's schemas
    const argProps = findPropsForSchema(mainArgs?.id, propSchemas);
    const successProps = findPropsForSchema(mainSuccess?.id, propSchemas);

    return `
            <div class="event-card" id="event-${escapeHTML(eventName)}">
                <div class="event-header">
                    <h3>${escapeHTML(eventName)}</h3>
                    <span class="badge ${isImplemented ? 'implemented' : 'not-implemented'}">${isImplemented ? 'Implemented' : 'Not Implemented'}</span>
                </div>
                <div class="event-body">
                    ${mainArgs?.description ? `<p class="event-description">${escapeHTML(mainArgs.description)}</p>` : ''}
                    
                    ${mainArgs ? `
                    <div class="schema-section">
                        <h4>Arguments</h4>
                        <div class="schema-item">
                            <span class="schema-id">${escapeHTML(mainArgs.id)}</span>
                            ${argProps.length > 0 ? `
                            <div class="prop-list">
                                ${argProps.map(prop => renderProp(prop)).join('\n')}
                            </div>
                            ` : ''}
                            ${mainArgs.example !== undefined ? `<pre><code>${escapeHTML(JSON.stringify(mainArgs.example, null, 2))}</code></pre>` : ''}
                        </div>
                    </div>
                    ` : ''}
                    
                    ${mainSuccess ? `
                    <div class="schema-section">
                        <h4>Success Response</h4>
                        <div class="schema-item">
                            <span class="schema-id">${escapeHTML(mainSuccess.id)}</span>
                            <p class="schema-desc">${escapeHTML(mainSuccess.description || '')}</p>
                            ${successProps.length > 0 ? `
                            <div class="prop-list">
                                ${successProps.map(prop => renderProp(prop)).join('\n')}
                            </div>
                            
                            ${mainSuccess.example !== undefined ? `<pre><code>${escapeHTML(JSON.stringify(mainSuccess.example, null, 2))}</code></pre>` : ''}
                            ` : ''}
                        </div>
                    </div>
                    ` : ''}
                    
                    ${mainResponse ? `
                    <div class="schema-section">
                        <h4>Response Schema</h4>
                        <div class="schema-item">
                            <span class="schema-id">${escapeHTML(mainResponse.id)}</span>
                            <p class="schema-desc">${escapeHTML(mainResponse.description || '')}</p>
                            ${mainResponse.example !== undefined ? `<pre><code>${escapeHTML(JSON.stringify(mainResponse.example, null, 2))}</code></pre>` : ''}
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>`;
}

function renderServerToClientEvent(
    eventName: string, 
    types: Map<string, EventSchema[]>,
    propSchemas: EventSchema[]
): string {
    const messageDataSchemas = types.get('message-data') || [];

    return `
            <div class="event-card" id="event-${escapeHTML(eventName)}">
                <div class="event-header">
                    <h3>${escapeHTML(eventName)}</h3>
                    <span class="badge type">Server Push</span>
                </div>
                <div class="event-body">
                    ${messageDataSchemas.map(schema => {
                        const props = findPropsForSchema(schema.id, propSchemas);
                        return `
                    <div class="schema-section">
                        <div class="schema-item">
                            <span class="schema-id">${escapeHTML(schema.id)}</span>
                            <p class="schema-desc">${escapeHTML(schema.description || '')}</p>
                            ${props.length > 0 ? `
                            <div class="prop-list">
                                ${props.map(prop => renderProp(prop)).join('\n')}
                            </div>
                            ` : ''}
                            ${schema.example !== undefined ? `<pre><code>${escapeHTML(JSON.stringify(schema.example, null, 2))}</code></pre>` : ''}
                        </div>
                    </div>`;
                    }).join('\n')}
                </div>
            </div>`;
}

function renderTypeCard(schema: BaseSchema): string {
    return `
                <div class="type-card">
                    <h4>${escapeHTML(schema.id)}</h4>
                    <p>${escapeHTML(schema.description || '')}</p>
                    ${schema.example !== undefined ? `<pre><code>${escapeHTML(JSON.stringify(schema.example, null, 2))}</code></pre>` : ''}
                </div>`;
}

function renderProp(prop: EventSchema): string {
    const propName = prop.id.split('.').pop() || prop.id;
    return `
                                <div class="prop-item">
                                    <span class="prop-name">${escapeHTML(propName)}</span>
                                    <p class="schema-desc">${escapeHTML(prop.description || '')}</p>
                                    ${prop.example !== undefined ? `<code class="inline-code">${escapeHTML(JSON.stringify(prop.example))}</code>` : ''}
                                    ${prop.examples !== undefined ? `<code class="inline-code">${escapeHTML(JSON.stringify(prop.examples))}</code>` : ''}
                                </div>`;
}

function findPropsForSchema(schemaId: string | undefined, propSchemas: EventSchema[]): EventSchema[] {
    if (!schemaId) return [];
    const prefix = schemaId + '.';
    return propSchemas.filter(prop => prop.id.startsWith(prefix));
}
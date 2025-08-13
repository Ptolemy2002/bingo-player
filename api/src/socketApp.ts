// Registers all socket consumers
import "socket-consumers";
import { startSocket } from 'services/socket';
import express, { Response } from 'express';
import getEnv from "env";
import { bingoRegistry, BingoSchemas, socketRegistry, SocketSchemas } from "shared";
import escapeHTML from "escape-html";

const env = getEnv();
const socketApp = express();

let DocsHTML: string | null = null;

export function getDocsHTML(createNew=false) {
    if (DocsHTML !== null && !createNew) return DocsHTML;

    type Endpoint = {
        id: string,
        args: { description: string, examples: string[], props: { id: string, description: string, examples: string[] }[] },
        response: { description: string, examples: string[], props: { id: string, description: string, examples: string[] }[] }
    };

    type Miscellaneous = {
        description: string,
        examples: string[],
        props: { id: string, description: string, examples: string[] }[]
    };

    const endpoints: Map<string, Endpoint> = new Map();
    const misc: Map<string, Miscellaneous> = new Map();

    SocketSchemas.forEach((schema) => {
        const meta = socketRegistry.get(schema)!;

        if (meta.type === "args") {
            if (!endpoints.has(meta.id) && meta.eventName) {
                endpoints.set(meta.id, {
                    id: meta.eventName,
                    args: { description: "No args", examples: [], props: [] },
                    response: { description: "No response", examples: [], props: [] }
                });
            }

            endpoints.get(meta.id)!.args.description = meta.description || "No description";
            if (meta.example) endpoints.get(meta.id)!.args.examples.push(JSON.stringify(meta.example, null, 2));
            if (meta.examples) endpoints.get(meta.id)!.args.examples.push(...meta.examples.map(e => JSON.stringify(e, null, 2)));
        }

        if (meta.type === "other") {
            if (!misc.has(meta.id)) {
                misc.set(meta.id, {
                    description: meta.description || "No description",
                    examples: [],
                    props: []
                });
            }

            const miscItem = misc.get(meta.id)!;
            miscItem.description = meta.description || "No description";
            if (meta.example) miscItem.examples.push(JSON.stringify(meta.example, null, 2));
            if (meta.examples) miscItem.examples.push(...meta.examples.map(e => JSON.stringify(e, null, 2)));
        }
    });

    // Populate Responses
    SocketSchemas.forEach((schema) => {
        const meta = socketRegistry.get(schema)!;

        if (meta.type === "success-response") {
            const endpoint = endpoints.values().find((e) => e.id === meta.eventName);
            if (!endpoint) return;

            endpoint.response.description = meta.description || "No description";
            if (meta.example) endpoint.response.examples.push(JSON.stringify(meta.example, null, 2));
            if (meta.examples) endpoint.response.examples.push(...meta.examples.map(e => JSON.stringify(e, null, 2)));
        }
    });

    // Populate Props
    SocketSchemas.forEach((schema) => {
        const meta = socketRegistry.get(schema)!;

        if (meta.type === "prop") {
            const endpointEntry = endpoints.entries().find(([key]) => {
                key = key.replace(/(Args|(Success)?Response)$/, "");
                return meta.id.startsWith(key);
            });
            
            if (endpointEntry) {
                const endpoint = endpointEntry[1];
                const [root] = meta.id.split(".");

                const examples = [];
                if (meta.example) examples.push(JSON.stringify(meta.example, null, 2));
                if (meta.examples) examples.push(...meta.examples.map(e => JSON.stringify(e, null, 2)));

                if (root.endsWith("Response")) {
                    endpoint.response.props.push({
                        id: meta.id,
                        description: meta.description || "No description",
                        examples
                    });
                } else if (root.endsWith("Args")) {

                    endpoint.args.props.push({
                        id: meta.id,
                        description: meta.description || "No description",
                        examples
                    });
                }

                return;
            }

            const miscEntry = misc.entries().find(([key]) => meta.id.startsWith(key));

            if (miscEntry) {
                const miscItem = miscEntry[1];
                miscItem.description = meta.description || "No description";
                if (meta.example) miscItem.examples.push(JSON.stringify(meta.example, null, 2));
                if (meta.examples) miscItem.examples.push(...meta.examples.map(e => JSON.stringify(e, null, 2)));
            }
        }
    });

    // Add all BingoSchemas as Miscellaneous
    BingoSchemas.forEach((schema) => {
        const meta = bingoRegistry.get(schema)!;


        if (meta.type !== "prop") {
            const examples = [];
            if (meta.example) examples.push(JSON.stringify(meta.example, null, 2));
            if (meta.examples) examples.push(...meta.examples.map(e => JSON.stringify(e, null, 2)));

            misc.set(meta.id, {
                description: meta.description || "No description",
                props: [],
                examples
            });
        }
    });

    // Populate BingoSchema Props
    BingoSchemas.forEach((schema) => {
        const meta = bingoRegistry.get(schema)!;

        if (meta.type === "prop") {
            const miscEntry = misc.entries().find(([key]) => meta.id.startsWith(key));
            if (!miscEntry) return;

            const miscItem = miscEntry[1];
            const examples = [];
            if (meta.example) examples.push(JSON.stringify(meta.example, null, 2));
            if (meta.examples) examples.push(...meta.examples.map(e => JSON.stringify(e, null, 2)));

            miscItem.props.push({
                id: meta.id,
                description: meta.description || "No description",
                examples
            });
        }
    });

    DocsHTML = `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Bingo Player API | Socket Documentation</title>
            </head>
            <body>
                <h1>Bingo Player API - Socket Documentation</h1>
                <p>This document provides an overview of the socket functionality in the Bingo Player API.</p>

                ${
                    endpoints.size === 0 ? `<p>No socket endpoints registered.</p>` :
                    [...endpoints.values().map((endpoint) => {
                        const argPropElements = endpoint.args.props.length === 0 ? `<p>No args properties.</p>` :
                            endpoint.args.props.map(prop => `
                                <h5>${escapeHTML(prop.id)}</h5>
                                <p>${escapeHTML(prop.description)}</p>
                                <h6>Examples</h6>
                                <ul>${
                                    prop.examples.length === 0 ? "<li>No examples available.</li>" :
                                    prop.examples.map(e => `<li><pre>${e}</pre></li>`).join("")
                                }</ul>
                            `).join("");

                        const responseElements = `
                            <p>${escapeHTML(endpoint.response.description)}</p>
                            <h5>Examples</h5>
                            <ul>${
                                endpoint.response.examples.length === 0 ? "<li>No examples available.</li>" :
                                endpoint.response.examples.map(e => `<li><pre>${e}</pre></li>`).join("")
                            }</ul>
                        `;

                        const responsePropsElements = endpoint.response.props.length === 0 ? `<p>No response properties.</p>` :
                            endpoint.response.props.map(prop => `
                                <h6>${escapeHTML(prop.id)}</h6>
                                <p>${escapeHTML(prop.description)}</p>
                                <h6>Examples</h6>
                                <ul>${
                                    prop.examples.length === 0 ? "<li>No examples available.</li>" :
                                    prop.examples.map(e => `<li><pre>${e}</pre></li>`).join("")
                                }</ul>
                            `).join("");

                        return `
                            <h2 id="${endpoint.id}">${escapeHTML(endpoint.id)}</h2>
                            <h3>Args</h3>
                            <p>${escapeHTML(endpoint.args.description)}</p>
                            <h4>Props</h4>
                            ${argPropElements}

                            <h4>Response</h4>
                            ${responseElements}

                            <h5>Props</h5>
                            ${responsePropsElements}
                        `;
                    })].join("")
                }

                <h2>Miscellaneous Types</h2>
                <p>This section describes miscellaneous types used in the API.</p>

                ${[
                    ...misc.entries().map(([key, miscItem]) => {
                        return `
                            <h3>${escapeHTML(key)}</h3>
                            <p>${escapeHTML(miscItem.description)}</p>
                            <h4>Examples</h4>
                            <ul>${miscItem.examples.length === 0 ? "<li>No examples available.</li>" :
                                miscItem.examples.map(e => `<li><pre>${e}</pre></li>`).join("")}
                            </ul>
                            <h4>Properties</h4>
                            ${miscItem.props.length === 0 ? "<p>No properties available.</p>" :
                                miscItem.props.map(p => {
                                    return `
                                        <h5>${escapeHTML(p.id)}</h5>
                                        <p>${escapeHTML(p.description)}</p>
                                        <h6>Examples</h6>
                                        <ul>${p.examples.length === 0 ? "<li>No examples available.</li>" :
                                            p.examples.map(e => `<li><pre>${e}</pre></li>`).join("")}
                                        </ul>
                                    `;
                                })
                            }
                        `;
                    })].join("")
                }
            </body>
        </html>    
    `;

    return DocsHTML;
}

socketApp.get('/', function(_, res) {
    res.send("Root route for Socket Server. For docs, go <a href='/docs'>here</a>.");
});

socketApp.get("/docs", (_, res: Response) => {
    res.send(getDocsHTML());
});

startSocket(env.socketPort, socketApp);

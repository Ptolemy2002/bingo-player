import { bingoRegistry, BingoSchemas, socketRegistry, SocketSchemas } from "shared";
import escapeHTML from "escape-html";
import { getSocketConsumers } from "./socket";

interface Property {
    id: string;
    description: string;
    examples: string[];
}

interface Miscellaneous {
    description: string;
    examples: string[];
    props: Property[];
}

interface EndpointSection {
    description: string;
    examples: string[];
    props: Property[];
}

interface Endpoint {
    id: string;
    args: EndpointSection;
    response: EndpointSection;
}

interface ProcessedData {
    endpoints: Map<string, Endpoint>;
    misc: Map<string, Miscellaneous>;
}

class SchemaProcessor {
    private endpoints = new Map<string, Endpoint>();
    private misc = new Map<string, Miscellaneous>();
    private excludedEventNames: Set<string>;

    constructor(excludedEventNames: string[] = []) {
        this.excludedEventNames = new Set(excludedEventNames);
    }

    process(): ProcessedData {
        this.processSocketSchemas();
        this.processBingoSchemas();
        return {
            endpoints: this.endpoints,
            misc: this.misc
        };
    }

    private processSocketSchemas(): void {
        // Process args first to establish endpoint structure
        SocketSchemas.forEach((schema) => {
            const meta = socketRegistry.get(schema)!;
            if (meta.type === "args") {
                this.processArgsSchema(meta);
            }
        });

        // Process other types after endpoints are established
        SocketSchemas.forEach((schema) => {
            const meta = socketRegistry.get(schema)!;
            if (meta.type === "other") {
                this.processOtherSchema(meta);
            }
        });

        // Process responses
        SocketSchemas.forEach((schema) => {
            const meta = socketRegistry.get(schema)!;
            if (meta.type === "success-response") {
                this.processResponseSchema(meta);
            }
        });

        // Process props last
        SocketSchemas.forEach((schema) => {
            const meta = socketRegistry.get(schema)!;
            if (meta.type === "prop") {
                this.processSocketPropSchema(meta);
            }
        });
    }

    private processArgsSchema(meta: any): void {
        if (!meta.eventName || this.excludedEventNames.has(meta.eventName)) return;

        if (!this.endpoints.has(meta.id)) {
            this.endpoints.set(meta.id, {
                id: meta.eventName,
                args: { description: "No args", examples: [], props: [] },
                response: { description: "No response", examples: [], props: [] }
            });
        }

        const endpoint = this.endpoints.get(meta.id)!;
        endpoint.args.description = meta.description || "No description";
        this.addExamples(endpoint.args, meta);
    }

    private processResponseSchema(meta: any): void {
        if (this.excludedEventNames.has(meta.eventName)) return;
        
        const endpoint = Array.from(this.endpoints.values()).find((e) => e.id === meta.eventName);
        if (!endpoint) return;

        endpoint.response.description = meta.description || "No description";
        this.addExamples(endpoint.response, meta);
    }

    private processSocketPropSchema(meta: any): void {
        const endpointEntry = Array.from(this.endpoints.entries()).find(([key]) => {
            const cleanKey = key.replace(/(Args|(Success)?Response)$/, "");
            return meta.id.startsWith(cleanKey);
        });

        if (endpointEntry) {
            this.addPropertyToEndpoint(endpointEntry[1], meta);
        } else {
            this.addPropertyToMisc(meta);
        }
    }

    private processOtherSchema(meta: any): void {
        if (!this.misc.has(meta.id)) {
            this.misc.set(meta.id, {
                description: meta.description || "No description",
                examples: [],
                props: []
            });
        }

        const miscItem = this.misc.get(meta.id)!;
        miscItem.description = meta.description || "No description";
        this.addExamples(miscItem, meta);
    }

    private processBingoSchemas(): void {
        // Process non-prop schemas first
        BingoSchemas.forEach((schema) => {
            const meta = bingoRegistry.get(schema)!;

            if (meta.type !== "prop") {
                this.processBingoOtherSchema(meta);
            }
        });

        BingoSchemas.forEach((schema) => {
            const meta = bingoRegistry.get(schema)!;

            if (meta.type === "prop") {
                this.processBingoPropSchema(meta);
            }
        });
    }

    private processBingoPropSchema(meta: any): void {
        const miscEntry = Array.from(this.misc.entries()).find(([key]) => meta.id.startsWith(key));
        if (!miscEntry) return;

        const miscItem = miscEntry[1];
        const examples = this.extractExamples(meta);

        miscItem.props.push({
            id: meta.id,
            description: meta.description || "No description",
            examples
        });
    }

    private processBingoOtherSchema(meta: any): void {
        const examples = this.extractExamples(meta);

        this.misc.set(meta.id, {
            description: meta.description || "No description",
            props: [],
            examples
        });
    }

    private addPropertyToEndpoint(endpoint: Endpoint, meta: any): void {
        const [root] = meta.id.split(".");
        const examples = this.extractExamples(meta);

        const property = {
            id: meta.id,
            description: meta.description || "No description",
            examples
        };

        if (root.endsWith("Response")) {
            endpoint.response.props.push(property);
        } else if (root.endsWith("Args")) {
            endpoint.args.props.push(property);
        }
    }

    private addPropertyToMisc(meta: any): void {
        const miscEntry = Array.from(this.misc.entries()).find(([key]) => meta.id.startsWith(key));
        if (!miscEntry) return;

        const miscItem = miscEntry[1];
        const examples = this.extractExamples(meta);

        miscItem.props.push({
            id: meta.id,
            description: meta.description || "No description",
            examples
        });
    }

    private addExamples(target: { examples: string[] }, meta: any): void {
        if (meta.example) target.examples.push(JSON.stringify(meta.example, null, 2));
        if (meta.examples) target.examples.push(...meta.examples.map((e: any) => JSON.stringify(e, null, 2)));
    }

    private extractExamples(meta: any): string[] {
        const examples: string[] = [];
        if (meta.example) examples.push(JSON.stringify(meta.example, null, 2));
        if (meta.examples) examples.push(...meta.examples.map((e: any) => JSON.stringify(e, null, 2)));
        return examples;
    }
}

class HTMLRenderer {
    private renderProperty(prop: Property): string {
        const examplesSection = prop.examples.length > 0 ? `
            <h6>Examples</h6>
            <ul>${prop.examples.map(e => `<li><pre>${e}</pre></li>`).join("")}</ul>
        ` : '';

        return `
            <h5>${escapeHTML(prop.id)}</h5>
            <p>${escapeHTML(prop.description)}</p>${examplesSection}
        `;
    }

    private renderEndpointSection(section: EndpointSection, sectionTitle: string): string {
        const examplesHtml = section.examples.length > 0 && sectionTitle === "Response" ? `
            <h5>Examples</h5>
            <ul>${section.examples.map(e => `<li><pre>${e}</pre></li>`).join("")}</ul>
        ` : '';

        const propsHtml = section.props.length > 0 ? `
            <h${sectionTitle === "Response" ? "5" : "4"}>Props</h${sectionTitle === "Response" ? "5" : "4"}>
            ${section.props.sort((a, b) => a.id.localeCompare(b.id)).map(prop => this.renderProperty(prop)).join("")}
        ` : '';

        return `
            <p>${escapeHTML(section.description)}</p>${examplesHtml}${propsHtml}
        `;
    }

    private renderEndpoint(endpoint: Endpoint): string {

        return `
            <h2 id="${endpoint.id}">${escapeHTML(endpoint.id)}</h2>
            ${this.renderImplementation(endpoint)}

            <h3>Args</h3>
            ${this.renderEndpointSection(endpoint.args, "Args")}

            <h4>Response</h4>
            ${this.renderEndpointSection(endpoint.response, "Response")}
        `;
    }

    private renderEndpoints(endpoints: Map<string, Endpoint>): string {
        if (endpoints.size === 0) {
            return `<p>No socket endpoints registered.</p>`;
        }

        return Array.from(endpoints.values())
            .sort((a, b) => a.id.localeCompare(b.id))
            .map(endpoint => this.renderEndpoint(endpoint))
            .join("");
    }

    private renderMiscellaneous(misc: Map<string, Miscellaneous>): string {
        return Array.from(misc.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, miscItem]) => {
            const examplesSection = miscItem.examples.length > 0 ? `
                <h4>Examples</h4>
                <ul>${miscItem.examples.map(e => `<li><pre>${e}</pre></li>`).join("")}</ul>
            ` : '';

            const propsSection = miscItem.props.length > 0 ? `
                <h4>Properties</h4>
                ${miscItem.props.sort((a, b) => a.id.localeCompare(b.id)).map(p => {
                    const propExamples = p.examples.length > 0 ? `
                        <h6>Examples</h6>
                        <ul>${p.examples.map(e => `<li><pre>${e}</pre></li>`).join("")}</ul>
                    ` : '';
                    
                    return `
                        <h5>${escapeHTML(p.id)}</h5>
                        <p>${escapeHTML(p.description)}</p>${propExamples}
                    `;
                }).join("")}
            ` : '';

            return `
                <h3>${escapeHTML(key)}</h3>
                <p>${escapeHTML(miscItem.description)}</p>${examplesSection}${propsSection}
            `;
        }).join("");
    }

    private renderImplementation(endpoint: Endpoint): string {
        if (endpoint.id in getSocketConsumers()) {
            return `<p style="color: green;">Implemented</p>`;
        } else {
            return `<p style="color: red;">Not Implemented</p>`;
        }
    }

    render(data: ProcessedData): string {
        return `
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

                    ${this.renderEndpoints(data.endpoints)}

                    <h2>Miscellaneous Types</h2>
                    <p>This section describes miscellaneous types used in the API.</p>

                    ${this.renderMiscellaneous(data.misc)}
                </body>
            </html>    
        `;
    }
}

class SocketDocumentationService {
    private processor: SchemaProcessor;
    private renderer = new HTMLRenderer();
    private cachedHTML: string | null = null;
    private excludedEventNames: string[];

    constructor(excludedEventNames: string[] = []) {
        this.excludedEventNames = excludedEventNames;
        this.processor = new SchemaProcessor(this.excludedEventNames);
    }

    generateHTML(createNew = false): string {
        if (this.cachedHTML !== null && !createNew) {
            return this.cachedHTML;
        }

        const processedData = this.processor.process();
        this.cachedHTML = this.renderer.render(processedData);
        
        return this.cachedHTML;
    }

    clearCache(): void {
        this.cachedHTML = null;
    }

    updateExcludedEventNames(excludedEventNames: string[]): void {
        this.excludedEventNames = excludedEventNames;
        this.reinitializeSchemaProcessor();
        this.clearCache();
    }

    reinitializeSchemaProcessor(): void {
        this.processor = new SchemaProcessor(this.excludedEventNames);
    }
}

let documentationService: SocketDocumentationService | null = null;

export function getDocsHTML(createNew = false, excludedEventNames: string[] = []): string {
    if (!documentationService || excludedEventNames.length > 0) {
        documentationService = new SocketDocumentationService(excludedEventNames);
    }

    return documentationService.generateHTML(createNew);
}

export function setExcludedEventNames(excludedEventNames: string[]): void {
    if (!documentationService) {
        documentationService = new SocketDocumentationService(excludedEventNames);
    } else {
        documentationService.updateExcludedEventNames(excludedEventNames);
    }
}
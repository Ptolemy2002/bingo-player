import Markdown, { Options as MarkdownOptions, ExtraProps} from 'react-markdown';
import { clamp } from '@ptolemy2002/js-math-utils';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Link } from 'react-router-dom';
import { ReactNode } from 'react';

export type MarkdownRendererProps = MarkdownOptions & {
    baseHLevel?: number;
    components?: Record<string, React.ComponentType>;
};

export type MarkdownLinkProps = ExtraProps & {
    href?: string;
    children?: ReactNode;
};

export function omitNode<T extends ExtraProps>(props: T): Omit<T, 'node'> {
    const newProps = {...props};
    delete newProps.node;
    return newProps;
}

export function MarkdownLink({ href, children }: MarkdownLinkProps) {
    return (
        <Link to={href ?? "#"} target="_blank" rel="noopener noreferrer">{children}</Link>
    );
}

export function MarkdownRenderer({ baseHLevel=1, children, components, ...props }: MarkdownRendererProps) {
    const hLevelOverride: Record<string, string> = {};
    
    baseHLevel = clamp(baseHLevel, {min: 1, max: 6});

    for (let i = 1; i <= 6; i++) {
        if (i + baseHLevel - 1 > 6) {
            hLevelOverride[`h${i}`] = `h6`;
        } else {
            hLevelOverride[`h${i}`] = `h${i + baseHLevel - 1}`;
        }
    }

    return (
        <Markdown
            {...props}
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
                a: MarkdownLink,
                ...hLevelOverride,
                ...components
            }}
        >
            {children}
        </Markdown>
    );
}
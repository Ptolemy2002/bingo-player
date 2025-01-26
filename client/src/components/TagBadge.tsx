import { StyledComponentPropsWithCSS } from "@ptolemy2002/react-styled-component-utils";
import clsx from "clsx";
import { evaluateTagBadgeStyles, tagBadgeStyles } from "src/lib/Styles";
import styled, { TagBadgeStyles } from "styled-components";

export type TagBadgeProps = StyledComponentPropsWithCSS<{
    tag: string,
    className?: string,
    pill?: boolean
}, TagBadgeStyles>;

export function TagBadgeBase({ className, tag, pill=true }: TagBadgeProps["functional"]) {
    const isCollection = tag.startsWith("in:");

    return (
        <span className={clsx("badge tag-badge", className, pill && "rounded-pill")}>{
            isCollection
                ? "#" + tag.slice(3)
                : tag
        }</span>
    );
}

export const UnstyledTagBadge = TagBadgeBase;

export default Object.assign(
    styled(TagBadgeBase).attrs<TagBadgeProps["style"]>(
        ({theme, tag, ...props}) => ({
            ...evaluateTagBadgeStyles(theme, props, tag),
            $css: props.$css ?? null
        })
    )`
        ${(props) => tagBadgeStyles(props)}

        ${({$css}) => $css}
    `,
    {
        displayName: "styled(TagBadge)"
    }
);

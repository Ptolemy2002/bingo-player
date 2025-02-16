import { StyledComponentPropsWithCSS } from "@ptolemy2002/react-styled-component-utils";
import { Override } from "@ptolemy2002/ts-utils";
import clsx from "clsx";
import { HTMLProps, RefObject } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { evaluateTagBadgeStyles, tagBadgeStyles } from "src/lib/Styles";
import styled, { TagBadgeStyles } from "styled-components";

export type TagBadgeProps = StyledComponentPropsWithCSS<Override<HTMLProps<HTMLSpanElement>, {
    tag: string,
    className?: string,
    pill?: boolean,
    ref?: RefObject<HTMLSpanElement>
}>, TagBadgeStyles>;

export function TagBadgeBase({ className, tag, pill=true, ...props }: TagBadgeProps["functional"]) {
    const isCollection = tag.startsWith("in:");

    return (
        <LinkContainer to={{
            pathname: "/space-gallery",
            search: `cat=tag&q=${encodeURIComponent(tag)}&sb=name&so=asc&mw=t&cs=t&as=t`
        }}>
            <span className={clsx("badge tag-badge", className, pill && "rounded-pill")} {...props}>{
                isCollection
                    ? "#" + tag.slice(3)
                    : tag
            }</span>
        </LinkContainer>
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
        cursor: pointer;

        ${({$css}) => $css}
    `,
    {
        displayName: "styled(TagBadge)"
    }
);

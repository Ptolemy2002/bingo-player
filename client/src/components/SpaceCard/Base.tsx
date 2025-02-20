import SpaceData from "src/data/SpaceData";
import { SpaceCardProps } from "./Types";
import { Card } from "react-bootstrap";
import clsx from "clsx";
import { listInPlainEnglish } from "@ptolemy2002/js-utils";
import { MarkdownRenderer, omitNode } from "src/lib/Markdown";
import DefaultTagBadge from "src/components/TagBadge";
import { Spacer } from "@ptolemy2002/react-utils";
import { useMemo } from "react";
import { LinkContainer } from "react-router-bootstrap";
import StyledButton from "src/components/StyledButton";

function SpaceCardBase({
    className,
    TagBadge=DefaultTagBadge,
    ...props
}: SpaceCardProps["functional"]) {
    const [space] = SpaceData.useContextNonNullable();

    const aliasesText = useMemo(() => {
            if (space.aliases.size > 0) {
                return "AKA" + listInPlainEnglish(
                    Array.from(space.aliases).map((i) => `"${i}"`), {max: space.aliases.size, conjunction: "or"}
                )
            } else {
                return "";
            }
    }, [space.aliases]);

    return (
        <Card className={clsx("space-card", className)} {...props}>
            <Card.Body>
                <Card.Title>{space.name}</Card.Title>
                {aliasesText && <Card.Subtitle>{aliasesText}</Card.Subtitle>}

                <Card.Text as="div">
                    {
                        Array.from(space.tags).map(
                            (tag) => {
                                return <TagBadge className="me-1" key={`tag-${tag}`} tag={tag} pill />;
                            }
                        )
                    }

                    <Spacer />

                    <b>Description:</b>
                    {
                        (space.description?.length ?? 0) > 0 ?
                            <>
                                <br />
                                <MarkdownRenderer
                                    baseHLevel={4}
                                    components={{
                                        p: ({ className, ...props }) =>
                                            <p className={clsx(className, "md-p")} {...omitNode(props)} />
                                    }}
                                >
                                    {space.description}
                                </MarkdownRenderer>
                            </>
                        :
                            <>
                                {" "}
                                None Provided
                                <br />
                            </>
                    }

                    <b>Examples:</b> <br />
                    {
                        space.examples.size === 0 ?
                            "None Provided"
                        :
                            <ul>
                                {
                                    Array.from(space.examples).map(
                                        (i) => <li key={`example-${i}`}>{i}</li>
                                    )
                                }
                            </ul>
                    }
                </Card.Text>

                <LinkContainer to={`/space/${encodeURIComponent(space.name)}`}>
                    <StyledButton
                        $variant="cardViewDetails"
                    >
                        View Details
                    </StyledButton>
                </LinkContainer>
            </Card.Body>
        </Card>
    )
}

export function applySubComponents<
    T extends typeof SpaceCardBase
>(C: T) {
    return Object.assign(C, {
        TagBadge: DefaultTagBadge
    });
}

export default applySubComponents(SpaceCardBase);
import SpaceData from "src/data/SpaceData";
import { SpaceCardProps } from "./Types";
import { Card } from "react-bootstrap";
import clsx from "clsx";
import { listInPlainEnglish } from "@ptolemy2002/js-utils";
import { MarkdownRenderer, omitNode } from "src/lib/Markdown";
import TagBadge from "../TagBadge";
import { Spacer } from "@ptolemy2002/react-utils";
import { useMemo } from "react";
import { LinkContainer } from "react-router-bootstrap";

export default function SpaceCardBase({ className, ...props}: SpaceCardProps["functional"]) {
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
                            (tag) => <TagBadge className="me-1" key={`tag-${tag}`} tag={tag} pill />
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
                    <Card.Link>View Details</Card.Link>
                </LinkContainer>
            </Card.Body>
        </Card>
    )
}
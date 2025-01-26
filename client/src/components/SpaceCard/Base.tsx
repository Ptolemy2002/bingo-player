import SpaceData from "src/data/SpaceData";
import { SpaceCardProps } from "./Types";
import { Card } from "react-bootstrap";
import clsx from "clsx";
import { listInPlainEnglish } from "@ptolemy2002/js-utils";
import { MarkdownRenderer, omitNode } from "src/lib/Markdown";

export default function SpaceCardBase({ className, ...props}: SpaceCardProps["functional"]) {
    // Re-render on every change
    const [_space] = SpaceData.useContext(); 
    const space = _space!;

    const aliasesText =
            space.aliases.size > 0 ?
                "AKA" + listInPlainEnglish(
                    Array.from(space.aliases).map((i) => `"${i}"`), {max: space.aliases.size, conjunction: "or"}
                )
            : ""
        ;

    return (
        <Card className={clsx("space-card", className)} {...props}>
            <Card.Body>
                <Card.Title>{space.name}</Card.Title>
                <Card.Subtitle>{aliasesText}</Card.Subtitle>

                <Card.Text>
                    <b>Description:</b>

                    {
                        (space.description?.length ?? 0) > 0 ?
                            <>
                                <br />
                                <MarkdownRenderer
                                    baseHLevel={4}
                                    components={{
                                        p: ({ className, ...props }) => <p className={clsx(className, "md-p")} {...omitNode(props)} />
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
            </Card.Body>
        </Card>
    )
}
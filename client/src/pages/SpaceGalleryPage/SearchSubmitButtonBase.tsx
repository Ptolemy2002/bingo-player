import { Button } from "react-bootstrap";
import { SpaceGallerySearchSubmitButtonProps } from "./Types";
import DefaultMagnifyingGlassIcon from "src/components/icons/MagnifyingGlassIcon";
import clsx from "clsx";
import { useSpaceGallerySearchContext } from "./Context";
import useSpaceGallerySearchParamState from "./SearchParams";
import { useMountEffect } from "@ptolemy2002/react-mount-effects";

export default function SpaceGallerySearchSubmitButtonBase({
    className,
    MagnifyingGlassIcon=DefaultMagnifyingGlassIcon,
    onClick,
    ...props
}: SpaceGallerySearchSubmitButtonProps["functional"]) {
    const { q } = useSpaceGallerySearchParamState();
    const [search] = useSpaceGallerySearchContext();

    useMountEffect(() => {
        // Slightly delay this so that we can make sure dependent
        // components have had a chance to initialize their subscriptions
        // to the hasPressed property
        setTimeout(() => {
            if (q.length !== 0 && !search.hasPressed) {
                // Perform search if there is initially a query
                search.hasPressed = true;
            }
        }, 0);
    });

    return <>
        <Button
            className={clsx("space-gallery-search-submit-button", className)}
            onClick={(e) => {
                if (q. length !== 0) {
                    search.hasPressed = true;
                }
                onClick?.(e);
            }}
            {...props}
        >
            <MagnifyingGlassIcon />
        </Button>
    </>;
}
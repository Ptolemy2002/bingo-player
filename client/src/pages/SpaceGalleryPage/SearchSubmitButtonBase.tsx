import { Button } from "react-bootstrap";
import { SpaceGallerySearchSubmitButtonProps } from "./Types";
import DefaultMagnifyingGlassIcon from "src/components/icons/MagnifyingGlassIcon";
import clsx from "clsx";

export default function SpaceGallerySearchSubmitButtonBase({
    className,
    MagnifyingGlassIcon=DefaultMagnifyingGlassIcon,
    ...props
}: SpaceGallerySearchSubmitButtonProps["functional"]) {
    return <>
        <Button
            className={clsx("space-gallery-search-submit-button", className)}
            {...props}
        >
            <MagnifyingGlassIcon />
        </Button>
    </>;
}
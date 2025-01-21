import { Button } from "react-bootstrap";
import { SpaceGallerySearchSubmitButtonProps } from "./Types";
import DefaultMagnifyingGlassIcon from "src/components/icons/MagnifyingGlassIcon";
import clsx from "clsx";
import { useSpaceGallerySearchSubmitButtonController } from "./Controllers";

export default function SpaceGallerySearchSubmitButtonBase({
    className,
    MagnifyingGlassIcon=DefaultMagnifyingGlassIcon,
    onClick,
    ...props
}: SpaceGallerySearchSubmitButtonProps["functional"]) {
    const { handleClick } = useSpaceGallerySearchSubmitButtonController(onClick);

    return <>
        <Button
            className={clsx("space-gallery-search-submit-button", className)}
            onClick={handleClick}
            {...props}
        >
            <MagnifyingGlassIcon />
        </Button>
    </>;
}
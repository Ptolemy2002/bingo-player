import { Button } from "react-bootstrap";
import { SpaceGallerySearchSubmitButtonProps } from "./Types";
import DefaultMagnifyingGlassIcon from "src/components/icons/MagnifyingGlassIcon";

export default function SpaceGallerySearchSubmitButtonBase({
    className,
    MagnifyingGlassIcon=DefaultMagnifyingGlassIcon,
    ...props
}: SpaceGallerySearchSubmitButtonProps["functional"]) {
    return <>
        <Button
            className={className}
            {...props}
        >
            <MagnifyingGlassIcon />
        </Button>
    </>;
}
import { SpaceGallerySearchSubmitButtonProps } from "./Types";
import DefaultMagnifyingGlassIcon from "src/components/icons/MagnifyingGlassIcon";
import clsx from "clsx";
import { useSpaceGallerySearchSubmitButtonController } from "./Controllers";
import StyledButton from "src/components/StyledButton";

export default function SpaceGallerySearchSubmitButtonBase({
    className,
    MagnifyingGlassIcon=DefaultMagnifyingGlassIcon,
    onClick,
    ...props
}: SpaceGallerySearchSubmitButtonProps["functional"]) {
    const { handleClick } = useSpaceGallerySearchSubmitButtonController(onClick);

    return <>
        <StyledButton
            $variant="searchSubmit"
            className={clsx("space-gallery-search-submit-button", className)}
            onClick={handleClick}
            {...props}
        >
            <MagnifyingGlassIcon />
        </StyledButton>
    </>;
}
import { SpaceGallerySearchSubmitButtonProps } from "./Types";
import DefaultMagnifyingGlassIcon from "src/components/icons/MagnifyingGlassIcon";
import clsx from "clsx";
import { useSpaceGallerySearchSubmitButtonController } from "./Controllers";
import StyledButton from "src/components/StyledButton";

function SpaceGallerySearchSubmitButton({
    className,
    MagnifyingGlassIcon=DefaultMagnifyingGlassIcon,
    onClick,
    ...props
}: SpaceGallerySearchSubmitButtonProps["all"]) {
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

export function applySubComponents<
    T extends typeof SpaceGallerySearchSubmitButton
>(C: T) {
    return Object.assign(C, {
        MagnifyingGlassIcon: DefaultMagnifyingGlassIcon
    });
}

export default applySubComponents(SpaceGallerySearchSubmitButton);
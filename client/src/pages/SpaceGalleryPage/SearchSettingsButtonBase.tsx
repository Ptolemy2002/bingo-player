import { Button } from "react-bootstrap";
import { SpaceGallerySearchSettingsButtonProps } from "./Types";
import DefaultGearIcon from "src/components/icons/GearIcon";

export default function SpaceGallerySearchSettingsButtonBase({
    className,
    tooltipId="search-settings-tooltip",
    GearIcon=DefaultGearIcon,
    ...props
}: SpaceGallerySearchSettingsButtonProps["functional"]) {
    return <>
        <Button
            className={className}
            {...props}
            data-tooltip-id={tooltipId}
        >
            <GearIcon />
        </Button>
    </>;
}
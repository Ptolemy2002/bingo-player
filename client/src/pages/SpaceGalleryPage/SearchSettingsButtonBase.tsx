import { Button } from "react-bootstrap";
import { SpaceGallerySearchSettingsButtonProps } from "./Types";
import DefaultGearIcon from "src/components/icons/GearIcon";
import DefaultSearchSettingsTooltip from "./SearchSettingsTooltipStyled";
import { useState } from "react";
import clsx from "clsx";

export default function SpaceGallerySearchSettingsButtonBase({
    className,
    tooltipId="search-settings-tooltip",
    GearIcon=DefaultGearIcon,
    SearchSettingsTooltip=DefaultSearchSettingsTooltip,
    ...props
}: SpaceGallerySearchSettingsButtonProps["functional"]) {
    const [open, setOpen] = useState(false);

    return <>
        <SearchSettingsTooltip
            id={tooltipId}
            // Use this tooltip in a controlled fashion
            // to allow the button to toggle its
            // visibility
            isOpen={open}
        />
        
        <Button
            className={clsx("space-gallery-search-settings-button", className)}
            {...props}
            data-tooltip-id={tooltipId}
            onClick={() => setOpen((v) => !v)}
        >
            <GearIcon />
        </Button>
    </>;
}
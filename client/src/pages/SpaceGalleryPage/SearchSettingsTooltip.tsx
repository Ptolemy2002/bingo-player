import { Tooltip } from "react-tooltip";
import { SearchSettingsTooltipProps } from "./Types";

export default function SpaceGallerySearchSettingsTooltipBase({
    id="search-settings-tooltip",
    className,
    ...props
}: SearchSettingsTooltipProps["functional"]) {
    return (
        <Tooltip
            id={id}
            place={"bottom"}
            delayHide={100}
            clickable
            {...props}
            className={className}
        >
            Test
        </Tooltip>
    )
}
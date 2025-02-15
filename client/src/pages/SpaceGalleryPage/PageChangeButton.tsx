import clsx from "clsx";
import { useSpaceGallerySearchContext } from "./Context";
import { calcPagination } from "./Other";
import useSpaceGallerySearchParamState from "./SearchParams";
import { SpaceGalleryPageChangeButtonProps } from "./Types";
import StyledButton from "src/components/StyledButton";
import { MouseEvent } from "react";

export default function SpaceGalleryPageChangeButtonBase({
    type,
    className,
    disabled,
    onClick,
    children,
    ...props
}: SpaceGalleryPageChangeButtonProps["all"]) {
    const { p, setP, ps } = useSpaceGallerySearchParamState();
    const [search] = useSpaceGallerySearchContext(["totalCount"]);

    const offset = type === "next" ? 1 : -1;
    const {
        currentPage,
        totalPages
    } = calcPagination(p, ps, search.totalCount);

    return (
        <StyledButton
            $variant="pageChange"
            className={clsx(`space-gallery-page-${type}-button`, className)}
            disabled={
                disabled 
                    ||
                (type === "next" && currentPage === totalPages)
                    ||
                (type === "prev" && currentPage === 1)
            }
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
                setP(currentPage + offset);
                onClick?.(e);
            }}
            {...props}
        >
            {children}
        </StyledButton>
    );
}
import clsx from "clsx";
import { useSpaceGallerySearchContext } from "./Context";
import { calcPagination } from "./Other";
import useSpaceGallerySearchParamState from "./SearchParams";
import { SpaceGalleryPageChangeButtonProps } from "./Types";
import { Button } from "react-bootstrap";

export default function SpaceGalleryPageChangeButtonBase({
    type,
    className,
    disabled,
    onClick,
    children,
    ...props
}: SpaceGalleryPageChangeButtonProps["functional"]) {
    const { p, setP, ps } = useSpaceGallerySearchParamState();
    const [search] = useSpaceGallerySearchContext(["totalCount"]);

    const offset = type === "next" ? 1 : -1;
    const {
        currentPage,
        totalPages
    } = calcPagination(p, ps, search.totalCount);

    return (
        <Button
            className={clsx(`space-gallery-page-${type}-button`, className)}
            disabled={
                disabled 
                    ||
                (type === "next" && currentPage === totalPages)
                    ||
                (type === "prev" && currentPage === 1)
            }
            onClick={(e) => {
                setP(currentPage + offset);
                onClick?.(e);
            }}
            {...props}
        >
            {children}
        </Button>
    );
}
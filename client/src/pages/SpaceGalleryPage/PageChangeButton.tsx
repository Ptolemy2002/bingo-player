import clsx from "clsx";
import { useSpaceGallerySearchContext } from "./Context";
import { calcPagination } from "./Other";
import useSpaceGallerySearchParamState from "./SearchParams";
import { SpaceGalleryPageChangeButtonProps } from "./Types";
import StyledButton from "src/components/StyledButton";
import { MouseEvent } from "react";
import { wrapNumber } from "@ptolemy2002/js-math-utils";

function SpaceGalleryPageChangeButton({
    type="next",
    className,
    disabled,
    onClick,
    loop=true,
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
                !loop && (
                    disabled 
                        ||
                    (type === "next" && currentPage === totalPages)
                        ||
                    (type === "prev" && currentPage === 1)
                )
            }
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
                const nextPage = currentPage + offset;
                setP(loop ? wrapNumber(nextPage, 1, totalPages) : nextPage, { replace: false });
                onClick?.(e);
            }}

            {...props}
        >
            {children}
        </StyledButton>
    );
}

export function applySubComponents<
    T extends typeof SpaceGalleryPageChangeButton
>(C: T) {
    return Object.assign(C, {});
}

export default applySubComponents(SpaceGalleryPageChangeButton);
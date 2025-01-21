import { useMountEffect } from "@ptolemy2002/react-mount-effects";
import { useSpaceGallerySearchContext } from "./Context";
import useSpaceGallerySearchParamState from "./SearchParams";
import { useCallback, MouseEventHandler } from "react";

export function useSpaceGallerySearchSubmitButtonController(
    onClick?: MouseEventHandler<HTMLButtonElement>
) {
    const { q } = useSpaceGallerySearchParamState();
    const [search] = useSpaceGallerySearchContext();

    const runSearch = useCallback(async () => {
        search.hasPressed = true;
        // Will implement more fully later
    }, [search]);

    useMountEffect(() => {
        // Slightly delay this so that we can make sure dependent
        // components have had a chance to initialize their subscriptions
        // to the hasPressed property
        setTimeout(() => {
            if (q.length !== 0 && !search.hasPressed) {
                // Perform search if there is initially a query
                runSearch();
            }
        }, 0);
    });

    const handleClick = useCallback<MouseEventHandler<HTMLButtonElement>>((e) => {
        if (q.length !== 0) {
            runSearch();
        }
        onClick?.(e);
    }, [q, onClick, runSearch]);

    return {
        runSearch,
        handleClick
    };
}
import { useMountEffect } from "@ptolemy2002/react-mount-effects";
import { useSpaceGallerySearchContext } from "./Context";
import useSpaceGallerySearchParamState from "./SearchParams";
import { useCallback, MouseEventHandler } from "react";
import useManualErrorHandling from "@ptolemy2002/react-manual-error-handling";
import getApi from "src/Api";
import { useSuspenseController } from "@ptolemy2002/react-suspense";

export function useSpaceGallerySearchSubmitButtonController(
    onClick?: MouseEventHandler<HTMLButtonElement>
) {
    const {
        q,
        cat, as, cs, mw, sb, so, i
    } = useSpaceGallerySearchParamState();
    const [search] = useSpaceGallerySearchContext();
    const { _try } = useManualErrorHandling();
    const [{ suspend }] = useSuspenseController();

    const runSearch = useCallback(async () => {
        const api = getApi();
        search.hasPressed = true;
        if (cat === "general") {
            throw new Error("Not implemented yet");
        } else if (sb === "score" || sb === "_score") {
            throw new Error("Not implemented yet");
        } else {
            const { data } = await api.get(`/spaces/get/by-prop/${cat}/${q}`, {
                params: {
                    as: as ? "y" : "n",
                    cs: cs ? "y" : "n",
                    mw: mw ? "y" : "n",
                    i: i ? "y" : "n",
                    sb, so
                }
            });

            if (data.ok) {
                search.results = data.spaces;
            }
        }
    }, [search, q, cat, as, cs, mw, sb, so, i]);

    const runGetAll = useCallback(async () => {
        const api = getApi();
        search.hasPressed = true;
        
        // Since there is no "score" when getting all spaces, we need to
        // convert it to a supported operation before sending the request
        const _sb = sb === "score" || sb === "_score" ? "name" : sb;

        const { data } = await api.get("/spaces/get/all", {
            params: {
                sb: _sb, so
            }
        });

        if (data.ok) {
            search.results = data.spaces;
        }
    }, [search, sb, so]);

    useMountEffect(() => {
        // Slightly delay this so that we can make sure dependent
        // components have had a chance to initialize their subscriptions
        // to the hasPressed property
        setTimeout(() => {
            if (q.length !== 0 && !search.hasPressed) {
                // Perform search if there is initially a query
                _try(() => suspend(runSearch));
            } else {
                _try(() => suspend(runGetAll));
            }
        }, 0);
    });

    const handleClick = useCallback<MouseEventHandler<HTMLButtonElement>>((e) => {
        if (q.length !== 0) {
            _try(() => suspend(runSearch));
        } else {
            _try(() => suspend(runGetAll));
        }
        onClick?.(e);
    }, [q, _try, suspend, runSearch, onClick, runGetAll]);

    return {
        runSearch,
        runGetAll,
        handleClick
    };
}
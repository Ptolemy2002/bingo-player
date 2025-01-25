import { useDelayedEffect, useMountEffect } from "@ptolemy2002/react-mount-effects";
import { useSpaceGallerySearchContext } from "./Context";
import useSpaceGallerySearchParamState from "./SearchParams";
import { useCallback, MouseEventHandler } from "react";
import useManualErrorHandling from "@ptolemy2002/react-manual-error-handling";
import getApi from "src/Api";
import { useSuspenseController } from "@ptolemy2002/react-suspense";
import { calcPagination } from "./Other";

export function useSpaceGallerySearchSubmitButtonController(
    onClick?: MouseEventHandler<HTMLButtonElement>
) {
    const {
        q,
        cat, as, cs, mw, sb, so, i,
        p, setP,
        ps
    } = useSpaceGallerySearchParamState();
    const [search] = useSpaceGallerySearchContext();
    const { _try } = useManualErrorHandling();
    const [{ suspend }] = useSuspenseController();

    const runSearch = useCallback(async (resetP=true) => {
        const api = getApi();
        search.hasPressed = true;
        if (cat === "general") {
            throw new Error("Not implemented yet");
        } else if (sb === "score" || sb === "_score") {
            throw new Error("Not implemented yet");
        } else {
            const { data: countData } = await api.get(`/spaces/count/by-prop/${cat}/${q}`, {
                params: {
                    as: as ? "y" : "n",
                    cs: cs ? "y" : "n",
                    mw: mw ? "y" : "n",
                    i: i ? "y" : "n"
                }
            });

            if (countData.ok) {
                search.totalCount = countData.count;
            } else {
                return;
            }

            const { offset, limit } = calcPagination(p, ps, search.totalCount);

            const { data: spacesData } = await api.get(`/spaces/get/by-prop/${cat}/${q}`, {
                params: {
                    as: as ? "y" : "n",
                    cs: cs ? "y" : "n",
                    mw: mw ? "y" : "n",
                    i: i ? "y" : "n",
                    o: offset,
                    l: limit,
                    sb, so,
                }
            });

            if (resetP) setP(1);
            if (spacesData.ok) {
                search.results = spacesData.spaces;
            }
        }
    }, [search, q, cat, as, cs, mw, sb, so, i, p, ps, setP]);

    const runGetAll = useCallback(async (resetP=true) => {
        const api = getApi();
        search.hasPressed = true;

        const { data: countData } = await api.get("/spaces/count/all");

        if (countData.ok) {
            search.totalCount = countData.count;
        } else {
            return;
        }
        
        // Since there is no "score" when getting all spaces, we need to
        // convert it to a supported operation before sending the request
        const _sb = sb === "score" || sb === "_score" ? "name" : sb;

        const { offset, limit } = calcPagination(p, ps, search.totalCount);

        const { data: spacesData } = await api.get("/spaces/get/all", {
            params: {
                sb: _sb, so,
                o: offset,
                l: limit
            }
        });

        if (resetP) setP(1);
        if (spacesData.ok) {
            search.results = spacesData.spaces;
        }
    }, [search, sb, so, p, ps, setP]);

    useMountEffect(() => {
        // Slightly delay this so that we can make sure dependent
        // components have had a chance to initialize their subscriptions
        // to the hasPressed property
        setTimeout(() => {
            if (q.length !== 0 && !search.hasPressed) {
                // Perform search if there is initially a query
                _try(() => suspend(() => runSearch(false)));
            } else {
                _try(() => suspend(() => runGetAll(false)));
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

    useDelayedEffect(() => {
        // Perform a new search when the page number changes
        if (q.length !== 0) {
            _try(() => suspend(() => runSearch(false)));
        } else {
            _try(() => suspend(() => runGetAll(false)));
        }
    }, [p], 1);

    return {
        runSearch,
        runGetAll,
        handleClick
    };
}
import { useDelayedEffect, useMountEffect } from "@ptolemy2002/react-mount-effects";
import { useSpaceGallerySearchContext } from "./Context";
import useSpaceGallerySearchParamState from "./SearchParams";
import { useCallback, MouseEventHandler } from "react";
import useManualErrorHandling from "@ptolemy2002/react-manual-error-handling";
import getApi from "src/Api";
import { useSuspenseController } from "@ptolemy2002/react-suspense";
import { calcPagination } from "./Other";
import { omit } from "@ptolemy2002/ts-utils";
import { AxiosError } from "axios";

export function useSpaceGallerySearchSubmitButtonController(
    onClick?: MouseEventHandler<HTMLButtonElement>
) {
    const {
        q, p, ps
    } = useSpaceGallerySearchParamState();
    const [search] = useSpaceGallerySearchContext();
    const { _try } = useManualErrorHandling();
    const [{ suspend }] = useSuspenseController();

    const { runSearch, runGetAll } = useSpaceGallerySearchFunctions();

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

    // Because this is a delayed effect, it will not run on mount. Only
    // when the page number changes
    useDelayedEffect(() => {
        // Perform a new search when the page number changes
        if (q.length !== 0) {
            _try(() => suspend(() => runSearch(false)));
        } else {
            _try(() => suspend(() => runGetAll(false)));
        }
    }, [p, ps], 1);

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

export function useSpaceGallerySearchFunctions() {
    const {
        q,
        cat, as, cs, mw, sb, so, i,
        p, setP,
        ps
    } = useSpaceGallerySearchParamState();
    const [search] = useSpaceGallerySearchContext();

    const runSearch = useCallback(async (resetP=true) => {
        const api = getApi();
        search.hasPressed = true;
        if (cat === "general") {
            const { data: countData } = await api.get(`/spaces/search/${encodeURIComponent(q)}/count`)
                .catch((e: AxiosError) => {
                    if (e.status === 404) {
                        return { data: { ok: true, count: 0 } };
                    }

                    throw e;
                });

            if (countData.ok) {
                search.totalCount = countData.count;
            } else {
                return;
            }
            
            if (search.totalCount === 0) {
                search.results = [];
                return;
            }

            const { offset, limit } = calcPagination(p, ps, search.totalCount);
            const { data: spacesData } = await api.get(`/spaces/search/${encodeURIComponent(q)}`, {
                params: {
                    o: offset,
                    l: limit,
                    sb,
                    so
                }
            });

            if (resetP) setP(1);
            if (spacesData.ok) {
                search.results = spacesData.spaces.map((v) => omit(v, "_score"));
            }
        } else {
            // Since there is no "score" when getting in a non-general category, we need to
            // convert it to a supported operation before sending the request
            const _sb = sb === "score" || sb === "_score" ? "name" : sb;

            const { data: countData } = await api.get(`/spaces/count/by-prop/${cat}/${q}`, {
                params: {
                    as: as ? "y" : "n",
                    cs: cs ? "y" : "n",
                    mw: mw ? "y" : "n",
                    i: i ? "y" : "n"
                }
            })
            .catch((e: AxiosError) => {
                if (e.status === 404) {
                    return { data: { ok: true, count: 0 } };
                }

                throw e;
            });

            if (countData.ok) {
                search.totalCount = countData.count;
            } else {
                return;
            }

            if (search.totalCount === 0) {
                search.results = [];
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
                    sb: _sb,
                    so,
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

    return {
        runSearch,
        runGetAll
    };
}
import { useSpaceGallerySearchContext } from "./Context";
import useSpaceGallerySearchParamState from "./SearchParams";
import { useCallback, MouseEventHandler, useEffect } from "react";
import useManualErrorHandling from "@ptolemy2002/react-manual-error-handling";
import getApi, { RouteTags } from "src/Api";
import { useSuspenseController } from "@ptolemy2002/react-suspense";
import { calcPagination } from "./Other";
import { omit } from "@ptolemy2002/ts-utils";
import { AxiosError } from "axios";
import { MongoSpaceWithScore } from "shared";

export function useSpaceGallerySearchSubmitButtonController(
    onClick?: MouseEventHandler<HTMLButtonElement>
) {
    const {
        q, p, ps
    } = useSpaceGallerySearchParamState();
    const { _try } = useManualErrorHandling();
    const [{ suspend }] = useSuspenseController();

    const { runSearch, runGetAll } = useSpaceGallerySearchFunctions();

    useEffect(() => {
        // Perform a new search when the page number changes and on mount
        if (q.length !== 0) {
            _try(() => suspend(() => runSearch(false)));
        } else {
            _try(() => suspend(() => runGetAll(false)));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [p, ps]);

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
            const { data: countData } = await api.get(`/spaces/search/[query]/count`, {
                params: {
                    query: q
                },
                
                id: RouteTags.searchSpacesCount
            })
                .catch((e: AxiosError) => {
                    if (e.status === 404) {
                        return { data: { ok: true, count: 0 } };
                    }

                    throw e;
                });

            if (countData.ok) {
                // This should never happen. It's here because the way the Axios typing works
                // makes the search count path ambiguous with the regular search path, so
                // it thinks that the count might not be there.
                if (!('count' in countData)) return;
                
                search.totalCount = countData.count;
            } else {
                return;
            }
            
            if (search.totalCount === 0) {
                search.results = [];
                return;
            }

            const { offset, limit } = calcPagination(p, ps, search.totalCount);
            const { data: spacesData } = await api.get(`/spaces/search/[query]`, {
                id: RouteTags.searchSpaces,
                params: {
                    query: q,

                    o: offset,
                    l: limit,
                    sb,
                    so
                }
            });

            if (resetP) setP(1);
            if (spacesData.ok) {
                search.results = spacesData.spaces.map((v: MongoSpaceWithScore) => omit(v, "_score"));
            }
        } else {
            // Since there is no "score" when getting in a non-general category, we need to
            // convert it to a supported operation before sending the request
            const _sb = sb === "score" || sb === "_score" ? "name" : sb;

            const { data: countData } = await api.get(`/spaces/count/by-prop/[prop]/[query]`, {
                id: RouteTags.countSpacesByProp,
                params: {
                    prop: cat,
                    query: q,

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

            const { data: spacesData } = await api.get(`/spaces/get/by-prop/[prop]/[query]`, {
                id: RouteTags.searchSpaces,
                params: {
                    prop: cat,
                    query: q,

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
            id: RouteTags.getAllSpaces,
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
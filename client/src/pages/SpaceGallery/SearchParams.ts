import useSearchParamState, { ConvertFunctions, SetSearchParamAction, SetSearchParamFunction } from "@ptolemy2002/react-search-param-state";
import { useCallback } from "react";
import { ZodGetSpacesByPropURLParamsSchema } from "shared";
import { SpaceGallerySearchParams, UseSpaceGallerySearchParamResult } from "./Types";
import { ZodCoercedBoolean } from "@ptolemy2002/regex-utils";
import z from "zod";

export const converts: ConvertFunctions<SpaceGallerySearchParams> = {
    cat: (value) => {
        if (value === "general") return "general";

        const { success, data } = ZodGetSpacesByPropURLParamsSchema.shape.prop.safeParse(value);
        return success ? data : "general";
    },

    cs: {
        fromURL: (value) => ZodCoercedBoolean.catch(false).parse(value),
        toURL: (value) => value ? "y" : "n"
    },
    
    mw: {
        fromURL: (value) => ZodCoercedBoolean.catch(false).parse(value),
        toURL: (value) => value ? "y" : "n"
    },

    as: {
        fromURL: (value) => ZodCoercedBoolean.catch(false).parse(value),
        toURL: (value) => value ? "y" : "n"
    },

    i: {
        fromURL: (value) => ZodCoercedBoolean.catch(false).parse(value),
        toURL: (value) => value ? "y" : "n"
    },

    ps: (value) => z.number().int().positive().catch(10).parse(value),
    p: (value) => z.number().int().positive().catch(1).parse(value),
};

export const defaultValues: Partial<SpaceGallerySearchParams> = {
    cat: "general",
    cs: false,
    mw: false,
    as: false,
    i: false,
    ps: 10,
    p: 1
};

function useSearchParamSetter<K extends keyof SpaceGallerySearchParams>(key: K, set: SetSearchParamFunction<SpaceGallerySearchParams>) {
    return useCallback(
        (value: SetSearchParamAction<SpaceGallerySearchParams, K>) => set({[key]: value}),
        [key, set]
    );
}

export default function useAppSearchParamState(): UseSpaceGallerySearchParamResult {
    const [{
        q, cat, cs,
        mw, as, i,
        ps, p
    }, setSearchParams] = useSearchParamState(defaultValues, converts);

    // Because the hooks will still be called in the same order,
    // using them this way will not break the rules of hooks
    return {
        q, setQ: useSearchParamSetter("q", setSearchParams),
        cat, setCat: useSearchParamSetter("cat", setSearchParams),
        cs, setCs: useSearchParamSetter("cs", setSearchParams),
        mw, setMw: useSearchParamSetter("mw", setSearchParams),
        as, setAs: useSearchParamSetter("as", setSearchParams),
        i, setI: useSearchParamSetter("i", setSearchParams),
        ps, setPs: useSearchParamSetter("ps", setSearchParams),
        p, setP: useSearchParamSetter("p", setSearchParams)
    };
}
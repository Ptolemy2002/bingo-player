import useSearchParamState, { ConvertFunctions, SetSearchParamAction, SetSearchParamFunction } from "@ptolemy2002/react-search-param-state";
import { SpaceGallerySearchParams, UseSpaceGallerySearchParamResult } from "./Types";
import { useCallback } from "react";
import { ZodGetSpacesByPropURLParamsSchema, ZodSearchSpacesQueryParamsSchema } from "shared";
import { ZodCoercedBoolean } from "@ptolemy2002/regex-utils";
import { z } from "zod";

export const converts: ConvertFunctions<SpaceGallerySearchParams> = {
    q: (value) => value?? "",
    
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

    so: (value) => {
        const { success, data } = ZodSearchSpacesQueryParamsSchema.safeParse({sortOrder: value});
        const result = success ? data.sortOrder : "asc";
        return result ?? "asc";
    },

    sb: (value) => {
        const { success, data } = ZodSearchSpacesQueryParamsSchema.safeParse({sortBy: value});
        const result = success ? data.sortBy : "name";
        return result ?? "name";
    }
};

export const defaultValues: Partial<SpaceGallerySearchParams> = {
    q: "",
    cat: "general",
    cs: false,
    mw: false,
    as: false,
    i: false,
    ps: 10,
    p: 1,
    so: "asc",
    sb: "name"
};

function useSearchParamSetter<K extends keyof SpaceGallerySearchParams>(key: K, set: SetSearchParamFunction<SpaceGallerySearchParams>) {
    return useCallback(
        (value: SetSearchParamAction<SpaceGallerySearchParams, K>) => set({[key]: value}),
        [key, set]
    );
}

export default function useSpaceGallerySearchParamState(): UseSpaceGallerySearchParamResult {
    const [{
        q, cat, cs,
        mw, as, i,
        ps, p,
        so, sb
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
        p, setP: useSearchParamSetter("p", setSearchParams),
        so, setSo: useSearchParamSetter("so", setSearchParams),
        sb, setSb: useSearchParamSetter("sb", setSearchParams)
    };
}
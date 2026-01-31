import { createProxyContext, createProxyContextProvider, ProxyContextProviderProps, useProxyContext, UseProxyContextArgsNoClass } from "@ptolemy2002/react-proxy-context";
import { MaybeTransformer } from "@ptolemy2002/ts-utils";
import { useCallback } from "react";
import { BingoGameData, BingoGameInit } from "shared";

// Don't use ProxyContext Here, because it's just a simple value.
export type BingoGameDataContextValue = {
    value: BingoGameData;
    set: (v: MaybeTransformer<BingoGameInit | BingoGameData, [BingoGameData]>) => BingoGameData;
    reset: () => BingoGameData;
};

export type BingoGameDataProviderProps = ProxyContextProviderProps<BingoGameData, BingoGameData | BingoGameInit> & {
    // Required so that the provider can receive this value and determine
    // exactly when to re-render, since it's memoized using the partialMemo function
    // from @ptolemy2002/react-utils
    renderDeps?: unknown[];
};

export const BingoGameDataContext = createProxyContext<BingoGameData>("BingoGameDataContext");

export function BingoGameDataProvider({
    value,
    ...props
}: BingoGameDataProviderProps) {
    const P = createProxyContextProvider<BingoGameData, BingoGameData | BingoGameInit>(
        BingoGameDataContext, (v) => v instanceof BingoGameData ? v : new BingoGameData(v)
    );
    return <P value={value} {...props}></P>
}

export function useBingoGameDataContext(...[deps=[], ...args]: UseProxyContextArgsNoClass<BingoGameData>) {
    const [context, setContext] = useProxyContext(BingoGameDataContext, deps, ...args);

    const set = useCallback<(v: MaybeTransformer<BingoGameInit | BingoGameData, [BingoGameData]>) => BingoGameData>((v) => {
        let newValue = typeof v === "function" ? v(context) : v;

        if (!(newValue instanceof BingoGameData)) {
            newValue = new BingoGameData(newValue);
        }

        setContext(newValue);

        return newValue;
    }, [context, setContext]);

    const reset = useCallback<() => BingoGameData>(() => {
        return set(() => new BingoGameData({id: context.id}));
    }, [context, set]);

    return [context, set, reset] as const;
}
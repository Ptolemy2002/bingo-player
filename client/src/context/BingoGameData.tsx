import { createProxyContext, createProxyContextProvider, ProxyContextProviderProps, useProxyContext, UseProxyContextArgsNoClass } from "@ptolemy2002/react-proxy-context";
import { MaybeTransformer } from "@ptolemy2002/ts-utils";
import isCallable from "is-callable";
import { useCallback } from "react";
import { BingoGameData, BingoGameInit } from "shared";

export type BingoGameDataProviderProps = ProxyContextProviderProps<BingoGameData | null, BingoGameData | BingoGameInit | null> & {
    // Required so that the provider can receive this value and determine
    // exactly when to re-render, since it's memoized using the partialMemo function
    // from @ptolemy2002/react-utils
    renderDeps?: unknown[];
};

export const BingoGameDataContext = createProxyContext<BingoGameData | null>("BingoGameDataContext");

export function BingoGameDataProvider({
    value,
    ...props
}: BingoGameDataProviderProps) {
    const P = createProxyContextProvider<BingoGameData | null, BingoGameData | BingoGameInit | null>(
        BingoGameDataContext, (v) => v instanceof BingoGameData || v === null ? v : new BingoGameData(v)
    );
    return <P value={value} {...props}></P>
}

type SetFunction = (v: MaybeTransformer<BingoGameInit | BingoGameData | null, [BingoGameData | null]>, immutable?: boolean) => BingoGameData | null;

export function useBingoGameDataContext(...[deps=["id", "players", "boards", "boardTemplates"], ...args]: UseProxyContextArgsNoClass<BingoGameData | null>) {
    const [context, setContext] = useProxyContext(BingoGameDataContext, deps, ...args);

    const set = useCallback<SetFunction>((v, i) => {
        let newValue = isCallable(v) ? v(context) : v;

        if (!(newValue instanceof BingoGameData) && newValue !== null) {
            newValue = new BingoGameData(newValue);
        }

        if (i && newValue !== null) newValue = newValue.clone();

        setContext(newValue);

        return newValue;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context]);

    const reset = useCallback<() => BingoGameData | null>(() => {
        if (context === null) {
            return null;
        }
        
        return set(() => new BingoGameData({id: context.id}));
    }, [context, set]);

    return [context, set, reset] as const;
}
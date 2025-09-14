import { MaybeTransformer } from "@ptolemy2002/ts-utils";
import isCallable from "is-callable";
import { createContext, ReactNode, useCallback, useContext, useRef } from "react";
import useForceRerender from "@ptolemy2002/react-force-rerender";
import { BingoGameCollection, BingoGameData, BingoGameInit } from "shared";


// Don't use ProxyContext Here, because it's just a simple value.
export type BingoGameCollectionContextValue = {
    value: BingoGameCollection;
    set: (v: MaybeTransformer<BingoGameInit[] | BingoGameCollection, [BingoGameCollection]>) => BingoGameCollection;
    reset: () => BingoGameCollection;
};

export type BingoGameCollectionProviderProps = {
    value: BingoGameCollection | BingoGameData[];
    children: ReactNode;
};

export const BingoGameCollectionContext = createContext<BingoGameCollectionContextValue | null>(null);

export function BingoGameCollectionProvider({
    value,
    children
}: BingoGameCollectionProviderProps) {
    const valueRef = useRef(new BingoGameCollection(value));
    const forceRerender = useForceRerender();

    const set = useCallback<BingoGameCollectionContextValue["set"]>((v) => {
        let newValue = isCallable(v) ? v(valueRef.current) : v;

        if (Array.isArray(newValue)) {
            newValue = new BingoGameCollection(newValue);
        }

        if (valueRef.current !== newValue) {
            valueRef.current = newValue;
            forceRerender();
        }

        return newValue;
    }, [valueRef, forceRerender]);

    const reset = useCallback<BingoGameCollectionContextValue["reset"]>(() => {
        return set(() => new BingoGameCollection());
    }, [set]);

    return (
        <BingoGameCollectionContext.Provider
            value={{
                value: valueRef.current,
                set,
                reset
            }}

            children={children}
        />
    );
}

export function useBingoGameCollectionContext() {
    const value = useContext(BingoGameCollectionContext);
    if (value === null) throw new Error("useBingoGameCollectionContext must be used within a BingoGameCollectionProvider");
    return [value.value, value.set, value.reset] as const;
}
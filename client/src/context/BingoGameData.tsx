import useForceRerender from "@ptolemy2002/react-force-rerender";
import { MaybeTransformer } from "@ptolemy2002/ts-utils";
import isCallable from "is-callable";
import { createContext, useCallback, useContext, useRef } from "react";
import { BingoGameData, BingoGameInit } from "shared";

// Don't use ProxyContext Here, because it's just a simple value.
export type BingoGameDataContextValue = {
    value: BingoGameData;
    set: (v: MaybeTransformer<BingoGameInit | BingoGameData, [BingoGameData]>) => BingoGameData;
    reset: () => BingoGameData;
};

export type BingoGameDataProviderProps = {
    value: BingoGameData | BingoGameInit;
    children: React.ReactNode;
};

export const BingoGameDataContext = createContext<BingoGameDataContextValue | null>(null);

export function BingoGameDataProvider({
    value,
    children
}: BingoGameDataProviderProps) {
    const valueRef = useRef(
        value instanceof BingoGameData ?
            value
        :
            new BingoGameData(value)
    );

    const forceRerender = useForceRerender();

    const set = useCallback<BingoGameDataContextValue["set"]>((v) => {
        let newValue = isCallable(v) ? v(valueRef.current) : v;

        if (!(newValue instanceof BingoGameData)) {
            newValue = new BingoGameData(newValue);
        }

        if (valueRef.current !== newValue) {
            valueRef.current = newValue;
            forceRerender();
        }

        return newValue;
    }, [valueRef, forceRerender]);

    const reset = useCallback<BingoGameDataContextValue["reset"]>(() => {
        return set(() => new BingoGameData({id: valueRef.current.id}));
    }, [set]);

    return (
        <BingoGameDataContext.Provider
            value={{
                value: valueRef.current,
                set,
                reset
            }}
        >
            {children}
        </BingoGameDataContext.Provider>
    );
}

export function useBingoGameDataContext() {
    const context = useContext(BingoGameDataContext);
    if (context === null) {
        throw new Error("useBingoGameDataContext must be used within a BingoGameDataProvider");
    }
    return [context.value, context.set, context.reset] as const;
}
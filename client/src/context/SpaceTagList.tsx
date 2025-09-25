import {
    createProxyContext,
    createProxyContextProvider,
    Dependency,
    OnChangePropCallback,
    OnChangeReinitCallback,
    ProxyContextProviderProps,
    useProxyContext,
} from '@ptolemy2002/react-proxy-context';
import HookResult, { HookResultData } from '@ptolemy2002/react-hook-result';
import getApi from 'src/Api';
import { useCallback } from 'react';
import { PartialBy } from '@ptolemy2002/ts-utils';
import { ListSpacePropQueryParamsInput } from 'shared';

export type SpaceTagListProviderProps = PartialBy<
    ProxyContextProviderProps<SpaceTagList>,
    'value'
> & {
    // Required so that the provider can receive this value and determine
    // exactly when to re-render, since it's memoized using the partialMemo function
    // from @ptolemy2002/react-utils
    renderDeps?: unknown[];
};

export default class SpaceTagList {
    tags: string[] | null = null;
    requstInProgress = false;

    static defaultDependencies: Dependency<SpaceTagList>[] = ['tags'];

    static Context = createProxyContext<SpaceTagList>('SpaceTagListContext');
    static Provider = ({ value, ...props }: SpaceTagListProviderProps) => {
        const P = createProxyContextProvider(SpaceTagList.Context);

        return <P value={value ?? new SpaceTagList()} {...props} />;
    };

    static useContext(
        deps:
            | Dependency<SpaceTagList>[]
            | null = SpaceTagList.defaultDependencies,
        onChangeProp?: OnChangePropCallback<SpaceTagList>,
        onChangeReinit?: OnChangeReinitCallback<SpaceTagList>,
        listenReinit = true,
    ) {
        // Disabling rules of hooks because this is a direct hook and not a nested one
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [value, setValue] = useProxyContext(
            SpaceTagList.Context,
            deps,
            onChangeProp,
            onChangeReinit,
            listenReinit,
        );

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const resetValue = useCallback(() => {
            return setValue(new SpaceTagList());
        }, [setValue]);

        // HookResult is used so that we can access the valuethrough both object and array destructuring
        return new HookResult(
            {
                value,
                setValue,
                resetValue,
            },
            ['value', 'setValue', 'resetValue'],
        ) as HookResultData<
            {
                value: typeof value;
                setValue: typeof setValue;
                resetValue: typeof resetValue;
            },
            readonly [typeof value, typeof setValue, typeof resetValue]
        >;
    }

    async tagsRequest(
        createNew = false,
        params: ListSpacePropQueryParamsInput = {},
    ) {
        if (this.requstInProgress) throw new Error('Cannot start another request while one is in progress');

        if (!createNew && this.hasTags()) return this.tags;
        const api = getApi();

        this.requstInProgress = true;

        const { data } = await api.get('/spaces/get/all/list/tags', {
            params,
        });

        this.requstInProgress = false;

        if (data.ok) {
            // null should not be possible when we are getting tags, but just in case
            // we filter out these values
            this.tags = data.values.filter((s: string) => s !== null);
        }
        
        return this.tags;
    }

    getTags() {
        if (this.requstInProgress) throw new Error('Cannot get tags while a request is in progress');
        if (this.tags === null) return [];
        return this.tags;
    }

    sortTags() {
        if (this.requstInProgress) throw new Error('Cannot sort tags while a request is in progress');
        if (this.tags === null) return [];
        this.tags.sort((a, b) => a.localeCompare(b));
        return this.tags;
    }

    clearTags() {
        this.tags = null;
    }

    hasTags() {
        return this.tags !== null && !this.requstInProgress;
    }

    hasInProgressRequest() {
        return this.requstInProgress;
    }
}

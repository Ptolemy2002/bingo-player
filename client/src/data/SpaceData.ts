import { Override } from "@ptolemy2002/ts-utils";
import { CleanMongoSpace, CleanSpace, GetSpaceByExactIDResponseBody, GetSpacesByPropResponseBody } from "shared";
import MongoData, { CompletedMongoData } from "@ptolemy2002/react-mongo-data";
import { createProxyContext, Dependency, OnChangePropCallback, OnChangeReinitCallback } from "@ptolemy2002/react-proxy-context";
import getApi from "src/Api";

export type SpaceRequests = {
    pull: (force?: boolean) => Promise<void>;
    push: () => Promise<void>;
};

export type CompletedSpaceData = Override<SpaceData, CompletedMongoData<
    CleanSpace,
    CleanMongoSpace,
    SpaceRequests
>>;

export default class SpaceData extends MongoData<
    CleanSpace,
    CleanMongoSpace,
    SpaceRequests
> {
    static defaultDependencies: Dependency<CompletedSpaceData>[] = [
        ...MongoData._defaultDependencies,
        "id",
        "name",
        "description",
        "examples",
        "aliases",
        "tags"
    ];

    static Context = createProxyContext<CompletedSpaceData | null>("SpaceContext");
    static Provider = MongoData.createProvider<
        CleanSpace, CleanMongoSpace, SpaceRequests, CompletedSpaceData
    >(
        SpaceData.Context,
        SpaceData as unknown as new () => CompletedSpaceData
    );

    static useContext(
        deps: Dependency<CompletedSpaceData>[] | null = SpaceData.defaultDependencies,
        onChangeProp?: OnChangePropCallback<CompletedSpaceData | null>,
        onChangeReinit?: OnChangeReinitCallback<CompletedSpaceData | null>,
        listenReinit = true
    ) {
        return MongoData._useContext<
            CleanSpace, CleanMongoSpace, SpaceRequests, CompletedSpaceData
        >(
            SpaceData.Context,
            SpaceData as unknown as new () => CompletedSpaceData,
            deps,
            onChangeProp,
            onChangeReinit,
            listenReinit
        )
    }

    static useContextNonNullable(
        deps: Dependency<CompletedSpaceData>[] = SpaceData.defaultDependencies,
        onChangeProp?: OnChangePropCallback<CompletedSpaceData | null>,
        onChangeReinit?: OnChangeReinitCallback<CompletedSpaceData | null>,
        listenReinit = true
    ) {
        return MongoData._useContextNonNullable<
            CleanSpace, CleanMongoSpace, SpaceRequests, CompletedSpaceData
        >(
            SpaceData.Context,
            SpaceData as unknown as new () => CompletedSpaceData,
            deps,
            onChangeProp,
            onChangeReinit,
            listenReinit
        )
    }

    // We use this create method instead of a constructor to allow for
    // adding the properties and request types in a fluent way.
    // constructors don't allow for different return types.
    static create() {
        return new SpaceData() as CompletedSpaceData;
    }

    constructor() {
        super();

        this.defineProperty("id", {
            mongoName: "_id",
            toMongo: (id) => id,
            fromMongo: (id) => id,
            initial: ""
        });

        this.defineProperty("name", {
            mongoName: "name",
            toMongo: (name) => name,
            fromMongo: (name) => name,
            initial: ""
        });

        this.defineProperty("description", {
            mongoName: "description",
            toMongo: (description) => description,
            fromMongo: (description) => description,
            initial: null
        });

        this.defineProperty("examples", {
            mongoName: "examples",
            toMongo: (examples) => [...examples],
            fromMongo: (examples) => new Set(examples),
            initial: new Set()
        });

        this.defineProperty("aliases", {
            mongoName: "aliases",
            toMongo: (aliases) => [...aliases],
            fromMongo: (aliases) => new Set(aliases),
            initial: new Set()
        });

        this.defineProperty("tags", {
            mongoName: "tags",
            toMongo: (tags) => [...tags],
            fromMongo: (tags) => new Set(tags),
            initial: new Set()
        });

        this.defineRequestType("pull", async function(this: CompletedSpaceData, ac, force = false) {
            const api = getApi();

            if (!this.id && !this.name) {
                throw new Error("Space ID or name must be set before pulling");
            }

            const cacheOptions: {cache: false} | {} = force ? { cache: false } : {};

            let data: GetSpaceByExactIDResponseBody | GetSpacesByPropResponseBody;
            if (this.id) {
                data = (
                    await api.get(`/spaces/get/by-id/${this.id}`, {
                        signal: ac.signal,
                        ...cacheOptions
                    })
                ).data;
            } else {
                data = (
                    await api.get(
                        `/spaces/get/by-prop/name/${encodeURIComponent(this.name)}`,
                        {
                            params: {
                                limit: 1,
                                caseSensitive: "t",
                                accentSensitive: "t",
                                matchWhole: "t"
                            },
                            signal: ac.signal,
                            ...cacheOptions
                        }
                    )
                ).data;
            }
            
            if (data.ok) {
                if ("space" in data) {
                    this.fromJSON(data.space, true);
                } else if ("spaces" in data) {
                    this.fromJSON(data.spaces[0], true);
                }
            }
        }, {
            undoOnFail: false
        });

        this.defineRequestType("push", async function(this: CompletedSpaceData, ac) {
            const api = getApi();

            if (!this.id && !this.name) {
                throw new Error("Space ID or name must be set before pushing");
            }

            let data;
            if (this.id) {
                data = (await api.post(
                    `/spaces/update/by-id/${this.id || encodeURIComponent(this.id)}`,
                    {
                        difference: this.difference({type: ["push", "pull"]}),
                    },
                    { signal: ac.signal }
                )).data;
            } else {
                data = (await api.post(
                    `/spaces/update/by-name/${encodeURIComponent(this.name)}`,
                    {
                        difference: this.difference({type: ["push", "pull"]}),
                    },
                    { signal: ac.signal }
                )).data;
            }

            if (data.ok) {
                // Ensure the most up-to-date data is loaded
                this.fromJSON(data.space, true);
            }

        }, {
            undoOnFail: false
        });
    }

    hasNewEdits() {
        const lastPreEditCheckpointIndex = this.lastCheckpointIndex("pre-edit", {includeCurrent: true});
        if (lastPreEditCheckpointIndex === -1) return false;
        const lastPushOrPullCheckpointIndex = this.lastCheckpointIndex(["push", "pull"], {includeCurrent: true});
        if (lastPushOrPullCheckpointIndex === -1) return true;
        if (lastPushOrPullCheckpointIndex > lastPreEditCheckpointIndex) return false;
        return this.isDirty("pre-edit");
    }

    allowRefresh() {
        return !this.hasInProgressRequest() && !this.hasNewEdits();
    }

    allowPush() {
        return !this.hasInProgressRequest() && this.isDirty(["push", "pull"]);
    }

    allowUndo() {
        return this.hasNewEdits();
    }
}
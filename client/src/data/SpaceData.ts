import { Override } from "@ptolemy2002/ts-utils";
import { CleanMongoSpace, CleanSpace, GetSpaceByExactIDResponseBody, GetSpacesByPropResponseBody } from "shared";
import MongoData, { CompletedMongoData } from "@ptolemy2002/react-mongo-data";
import { createProxyContext, Dependency, OnChangePropCallback, OnChangeReinitCallback } from "@ptolemy2002/react-proxy-context";
import getApi from "src/Api";

export type SpaceRequests = {
    pull: () => Promise<void>;
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

        this.defineRequestType("pull", async function(this: CompletedSpaceData, ac) {
            const api = getApi();

            if (!this.id && !this.name) {
                throw new Error("Space ID or name must be set before pulling");
            }

            let data: GetSpaceByExactIDResponseBody | GetSpacesByPropResponseBody;
            if (this.id) {
                data = (
                    await api.get(`/spaces/get/by-id/${this.id}`, {
                        signal: ac.signal
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
                            signal: ac.signal
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
    }
}
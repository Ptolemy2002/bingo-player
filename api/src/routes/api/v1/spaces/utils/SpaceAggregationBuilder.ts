import { transformRegex } from "@ptolemy2002/regex-utils";
import AggregationBuilder, { StageGeneration } from "lib/mongo/AggregationBuilder";
import { PipelineStage } from "mongoose";
import { SpaceQueryProp } from "shared";
import { SortOrder, interpretSpaceQueryProp, interpretSortOrder } from "shared";

export type SpaceAggregationStageType = 
    "add-known-as" | "sort" | "pagination" | "match" | "cleanup"
    | "unwind-all" | "unwind-list-prop" | "group-list-prop"
;

export default class SpaceAggregationBuilder extends AggregationBuilder<SpaceAggregationStageType> {
    constructor(protected options: {
        sortBy?: SpaceQueryProp;
        sortOrder?: SortOrder;
        limit?: number;
        offset?: number;
        
        queryProp?: SpaceQueryProp;
        queryString?: string;
        caseSensitive?: boolean;
        accentSensitive?: boolean;
        matchWhole?: boolean;

        listProp?: SpaceQueryProp;
    }) {
        super();
    }

    hasKnownAs(): boolean {
        // Look through the pipeline to see if an add-known-as stage exists
        // with no cleanup stage after it.
        let hasKnownAs = false;
        this.pipeline.forEach((stage) => {
            if (stage.type === "add-known-as") {
                hasKnownAs = true;
            } else if (stage.type === "cleanup") {
                hasKnownAs = false;
            }
        });

        return hasKnownAs;
    }

    generateStage(stage: SpaceAggregationStageType): StageGeneration<SpaceAggregationStageType> {
        switch (stage) {
            case "add-known-as": {
                return {
                    type: "add-known-as",
                    stages: [{
                        $addFields: {
                            "known-as": { $concatArrays: [[ "$name" ], "$aliases"] }
                        }
                    }]
                };
            }

            case "sort": {
                const sortBy = interpretSpaceQueryProp(this.options.sortBy ?? 'id');
                const sortOrder = interpretSortOrder(this.options.sortOrder ?? 'asc');
                const sortObject: Record<string, 1 | -1> = {};

                if (sortBy === "known-as" && !this.hasKnownAs()) {
                    throw new TypeError("Cannot sort by known-as without adding it first.");
                }

                sortObject[sortBy] = sortOrder;
                if (sortBy !== '_id') sortObject._id = sortOrder;

                return {
                    type: "sort",
                    stages: [{
                        $sort: sortObject
                    }]
                };
            }

            case "cleanup": {
                return {
                    type: "cleanup",
                    stages: [{
                        $unset: ["known-as", "__v"]
                    }]
                };
            }

            case "match": {
                let {
                    queryProp,
                    queryString,
                    caseSensitive,
                    accentSensitive,
                    matchWhole
                } = this.options;

                if (queryString === undefined) {
                    throw new TypeError("A queryString is required for match stage.");
                }

                if (queryProp === undefined) {
                    throw new TypeError("A queryProp is required for match stage.");
                }

                if (queryProp === "known-as" && !this.hasKnownAs()) {
                    throw new TypeError("Cannot match known-as without adding it first.");
                }

                queryProp = interpretSpaceQueryProp(queryProp);
                const pattern = transformRegex(queryString, {
                    caseInsensitive: !caseSensitive,
                    accentInsensitive: !accentSensitive,
                    matchWhole: matchWhole
                })

                return {
                    type: "match",
                    stages: [{
                        $match: {
                            [queryProp]: pattern
                        }
                    }]
                };
            }

            case "pagination": {
                const result: PipelineStage[] = [];
                if (this.options.offset) {
                    result.push({
                        $skip: this.options.offset
                    });
                }

                if (this.options.limit) {
                    result.push({
                        $limit: this.options.limit
                    });
                }

                return {
                    type: "pagination",
                    stages: result
                };
            }

            case "unwind-list-prop": {
                const listProp = interpretSpaceQueryProp(this.options.listProp ?? 'id');
                if (listProp === "known-as" && !this.hasKnownAs()) {
                    throw new TypeError("Cannot unwind known-as without adding it first.");
                }

                return {
                    type: "unwind-list-prop",
                    stages: [{
                        $unwind: `$${listProp}`
                    }]
                };
            }

            case "group-list-prop": {
                const listProp = interpretSpaceQueryProp(this.options.listProp ?? 'id');
                if (listProp === "known-as" && !this.hasKnownAs()) {
                    throw new TypeError("Cannot group by known-as without adding it first.");
                }

                return {
                    type: "group-list-prop",
                    stages: [{
                        $group: {
                            _id: `$${listProp}`
                        }
                    }]
                };
            }

            case "unwind-all": {
                const propsToUnwind: SpaceQueryProp[] = [];

                if (this.hasKnownAs()) {
                    propsToUnwind.push("known-as");
                }

                propsToUnwind.push(
                    "examples",
                    "aliases",
                    "tags"
                );

                return {
                    type: "unwind-all",
                    stages: propsToUnwind.map(prop => ({
                        $unwind: `$${prop}`
                    }))
                }
            }
        }
    }
}
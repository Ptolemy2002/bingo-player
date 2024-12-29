import { transformRegex } from '@ptolemy2002/regex-utils';
import AggregationBuilder, {
    StageGeneration,
} from 'lib/mongo/AggregationBuilder';
import { PipelineStage } from 'mongoose';
import { SpaceQueryProp } from 'shared';
import { SortOrder, interpretSpaceQueryProp, interpretSortOrder } from 'shared';

export type SpaceAggregationStageType =
    | 'add-known-as'
    | 'sort'
    | 'pagination'
    | 'match'
    | 'cleanup'
    | 'unwind-all'
    | 'unwind-list-prop'
    | 'group-list-prop';

export type SortOptions = {
    sortBy?: SpaceQueryProp;
    sortOrder?: SortOrder;
};

export type MatchOptions = {
    queryProp: SpaceQueryProp;
    queryString: string;
    caseSensitive?: boolean;
    accentSensitive?: boolean;
    matchWhole?: boolean;
};

export type ListOptions = {
    listProp: SpaceQueryProp;
};

export type PaginationOptions = {
    limit?: number;
    offset?: number;
};

export default class SpaceAggregationBuilder extends AggregationBuilder<SpaceAggregationStageType> {
    options: Partial<
        SortOptions & MatchOptions & ListOptions & PaginationOptions
    >;

    constructor(
        options: Partial<SortOptions & MatchOptions & ListOptions> = {},
    ) {
        super();
        this.options = options;
    }

    hasKnownAs(): boolean {
        let hasKnownAs = false;
        this.pipeline.forEach((stage) => {
            if (stage.type === 'add-known-as') {
                hasKnownAs = true;
            } else if (stage.type === 'cleanup') {
                hasKnownAs = false;
            }
        });
        return hasKnownAs;
    }

    thenSort(options?: Partial<SortOptions>) {
        this.options = { ...this.options, ...(options ?? {}) };
        return this.then('sort');
    }

    thenMatch(options?: Partial<MatchOptions>) {
        this.options = { ...this.options, ...(options ?? {}) };
        return this.then('match');
    }

    thenPagination(options?: Partial<PaginationOptions>) {
        if (options) {
            this.options = { ...this.options, ...(options ?? {}) };
        }
        return this.then('pagination');
    }

    thenUnwindListProp(options?: Partial<ListOptions>) {
        this.options = { ...this.options, ...(options ?? {}) };
        return this.then('unwind-list-prop');
    }

    thenGroupListProp(options?: Partial<ListOptions>) {
        this.options = { ...this.options, ...(options ?? {}) };
        return this.then('group-list-prop');
    }

    generateStage(
        stage: SpaceAggregationStageType,
    ): StageGeneration<SpaceAggregationStageType> {
        switch (stage) {
            case 'add-known-as': {
                return {
                    type: 'add-known-as',
                    stages: [
                        {
                            $addFields: {
                                'known-as': {
                                    $concatArrays: [['$name'], '$aliases'],
                                },
                            },
                        },
                    ],
                };
            }

            case 'sort': {
                const sortBy = interpretSpaceQueryProp(
                    this.options.sortBy ?? 'id',
                );
                const sortOrder = interpretSortOrder(
                    this.options.sortOrder ?? 'asc',
                );
                const sortObject: Record<string, 1 | -1> = {};

                if (sortBy === 'known-as' && !this.hasKnownAs()) {
                    throw new TypeError(
                        'Cannot sort by known-as without adding it first.',
                    );
                }

                sortObject[sortBy] = sortOrder;
                if (sortBy !== '_id') sortObject._id = sortOrder;

                return {
                    type: 'sort',
                    stages: [
                        {
                            $sort: sortObject,
                        },
                    ],
                };
            }

            case 'cleanup': {
                return {
                    type: 'cleanup',
                    stages: [
                        {
                            $unset: ['known-as', '__v'],
                        },
                    ],
                };
            }

            case 'match': {
                const {
                    queryProp,
                    queryString,
                    caseSensitive,
                    accentSensitive,
                    matchWhole,
                } = this.options;

                if (queryString === undefined) {
                    throw new TypeError(
                        'A queryString is required for match stage.',
                    );
                }

                if (queryProp === undefined) {
                    throw new TypeError(
                        'A queryProp is required for match stage.',
                    );
                }

                if (queryProp === 'known-as' && !this.hasKnownAs()) {
                    throw new TypeError(
                        'Cannot match known-as without adding it first.',
                    );
                }

                const interpretedProp = interpretSpaceQueryProp(queryProp);
                const pattern = transformRegex(queryString, {
                    caseInsensitive: !caseSensitive,
                    accentInsensitive: !accentSensitive,
                    matchWhole: matchWhole,
                });

                return {
                    type: 'match',
                    stages: [
                        {
                            $match: {
                                [interpretedProp]: pattern,
                            },
                        },
                    ],
                };
            }

            case 'pagination': {
                const result: PipelineStage[] = [];
                if (this.options.offset) {
                    result.push({
                        $skip: this.options.offset,
                    });
                }

                if (this.options.limit) {
                    result.push({
                        $limit: this.options.limit,
                    });
                }

                return {
                    type: 'pagination',
                    stages: result,
                };
            }

            case 'unwind-list-prop': {
                const { listProp } = this.options;
                if (!listProp) {
                    throw new TypeError(
                        'listProp is required for unwind-list-prop stage.',
                    );
                }

                const interpretedProp = interpretSpaceQueryProp(listProp);
                if (interpretedProp === 'known-as' && !this.hasKnownAs()) {
                    throw new TypeError(
                        'Cannot unwind known-as without adding it first.',
                    );
                }

                return {
                    type: 'unwind-list-prop',
                    stages: [
                        {
                            $unwind: `$${interpretedProp}`,
                        },
                    ],
                };
            }

            case 'group-list-prop': {
                const { listProp } = this.options;
                if (!listProp) {
                    throw new TypeError(
                        'listProp is required for group-list-prop stage.',
                    );
                }

                const interpretedProp = interpretSpaceQueryProp(listProp);
                if (interpretedProp === 'known-as' && !this.hasKnownAs()) {
                    throw new TypeError(
                        'Cannot group by known-as without adding it first.',
                    );
                }

                return {
                    type: 'group-list-prop',
                    stages: [
                        {
                            $group: {
                                _id: `$${interpretedProp}`,
                            },
                        },
                    ],
                };
            }

            case 'unwind-all': {
                const propsToUnwind: SpaceQueryProp[] = [];

                if (this.hasKnownAs()) {
                    propsToUnwind.push('known-as');
                }

                propsToUnwind.push('examples', 'aliases', 'tags');

                return {
                    type: 'unwind-all',
                    stages: propsToUnwind.map((prop) => ({
                        $unwind: `$${prop}`,
                    })),
                };
            }
        }
    }
}

import { transformRegex } from '@ptolemy2002/regex-utils';
import { ValueOf, ValuesIntersection } from '@ptolemy2002/ts-utils';
import AggregationBuilder, {
    StageGeneration,
} from 'lib/mongo/AggregationBuilder';
import { SpaceQueryProp, SortOrder, interpretSpaceQueryProp, interpretSortOrder } from 'shared';

export type SpaceAggregationStageType =
    | 'add-known-as'
    | 'sort'
    | 'skip'
    | 'limit'
    | 'pagination'
    | 'match'
    | 'cleanup'
    | 'unwind-all'
    | 'unwind-list-prop'
    | 'group-list-prop'
    | 'count';

export type SpaceAggregationOptions = {
    sort: {
        sortBy: SpaceQueryProp;
        sortOrder: SortOrder;
    },

    match: {
        queryProp: SpaceQueryProp;
        queryString: string;
        caseSensitive: boolean;
        accentSensitive: boolean;
        matchWhole: boolean;
    },

    list: {
        listProp: SpaceQueryProp;
    },

    skip: {
        offset: number;
    },

    limit: {
        limit: number;
    },

    pagination: SpaceAggregationOptions['skip'] & SpaceAggregationOptions['limit'],

    count: {
        countFieldName: string;
    }
};

export type AllSpaceAggregationOptions = ValuesIntersection<SpaceAggregationOptions>;

export default class SpaceAggregationBuilder extends AggregationBuilder<SpaceAggregationStageType> {
    options: Partial<AllSpaceAggregationOptions>;

    constructor(
        options: Partial<AllSpaceAggregationOptions> = {},
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

    thenSort(options?: Partial<SpaceAggregationOptions['sort']>) {
        this.options = { ...this.options, ...(options ?? {}) };
        return this.then('sort');
    }

    thenMatch(options?: Partial<SpaceAggregationOptions['match']>) {
        this.options = { ...this.options, ...(options ?? {}) };
        return this.then('match');
    }

    thenSkip(options?: Partial<SpaceAggregationOptions['skip']>) {
        this.options = { ...this.options, ...(options ?? {}) };
        return this.then('skip');
    }

    thenLimit(options?: Partial<SpaceAggregationOptions['limit']>) {
        this.options = { ...this.options, ...(options ?? {}) };
        return this.then('limit');
    }

    thenPagination(options?: Partial<SpaceAggregationOptions['pagination']>) {
        this.options = { ...this.options, ...(options ?? {}) };
        return this.then('pagination');
    }

    thenUnwindListProp(options?: Partial<SpaceAggregationOptions['list']>) {
        this.options = { ...this.options, ...(options ?? {}) };
        return this.then('unwind-list-prop');
    }

    thenGroupListProp(options?: Partial<SpaceAggregationOptions['list']>) {
        this.options = { ...this.options, ...(options ?? {}) };
        return this.then('group-list-prop');
    }

    thenCount(options?: Partial<SpaceAggregationOptions['count']>) {
        this.options = { ...this.options, ...(options ?? {}) };
        return this.then('count');
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

            case 'skip': {
                const { offset } = this.options;
                if (offset === undefined) {
                    throw new TypeError('An offset is required for skip stage.');
                }

                return {
                    type: 'skip',
                    stages: [
                        {
                            $skip: offset,
                        },
                    ],
                };
            }

            case 'limit': {
                const { limit } = this.options;
                if (limit === undefined) {
                    throw new TypeError('A limit is required for limit stage.');
                }

                return {
                    type: 'limit',
                    stages: [
                        {
                            $limit: limit,
                        },
                    ],
                };
            }

            case 'pagination': {
                // Shortcut for skip and then limit
                return {
                    type: 'pagination',
                    stages: [
                        ...this.generateStage('skip').stages,
                        ...this.generateStage('limit').stages
                    ]
                }
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

            case 'count': {
                const { countFieldName='count' } = this.options;

                return {
                    type: 'count',
                    stages: [
                        {
                            $count: countFieldName
                        },
                    ],
                };
            }
        }
    }
}

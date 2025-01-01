import { transformRegex } from '@ptolemy2002/regex-utils';
import { ValuesIntersection } from '@ptolemy2002/ts-utils';
import {
    AggregationBuilder,
    StageGeneration,
} from '@ptolemy2002/mongoose-utils';
import { SpaceQueryProp, SortOrder, interpretSortOrder, SpaceQueryPropWithScore, interpretSpaceQueryPropWithScore } from 'shared';
import SpaceModel from 'models/SpaceModel';

export type SpaceAggregationStageType =
    | 'add-known-as'
    | 'sort'
    | 'sort-desc-default'
    | 'skip'
    | 'limit'
    | 'pagination'
    | 'match'
    | 'cleanup'
    | 'unwind-all'
    | 'unwind-list-prop'
    | 'group-list-prop'
    | 'count'
    | 'search';

export type SpaceAggregationOptions = {
    sort: {
        sortBy: SpaceQueryPropWithScore;
        sortOrder: SortOrder;
    },

    match: {
        queryProp: SpaceQueryPropWithScore;
        queryString: string;
        caseSensitive: boolean;
        accentSensitive: boolean;
        matchWhole: boolean;
    },

    list: {
        listProp: SpaceQueryPropWithScore;
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
    },

    search: {
        searchQuery: string;
    }
};

export type AllSpaceAggregationOptions = ValuesIntersection<SpaceAggregationOptions>;

export default class SpaceAggregationBuilder extends AggregationBuilder<SpaceAggregationStageType, AllSpaceAggregationOptions> {
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

    hasScore(): boolean {
        let hasScore = false;
        this.pipeline.forEach((stage) => {
            if (stage.type === 'search') {
                hasScore = true;
            }
        });
        return hasScore;
    }

    thenSort(options?: Partial<SpaceAggregationOptions['sort']>) {
        return this.setOptions(options).then('sort');
    }

    thenMatch(options?: Partial<SpaceAggregationOptions['match']>) {
        return this.setOptions(options).then('match');
    }

    thenSkip(options?: Partial<SpaceAggregationOptions['skip']>) {
        return this.setOptions(options).then('skip');
    }

    thenLimit(options?: Partial<SpaceAggregationOptions['limit']>) {
        return this.setOptions(options).then('limit');
    }

    thenPagination(options?: Partial<SpaceAggregationOptions['pagination']>) {
        return this.setOptions(options).then('pagination');
    }

    thenUnwindListProp(options?: Partial<SpaceAggregationOptions['list']>) {
        return this.setOptions(options).then('unwind-list-prop');
    }

    thenGroupListProp(options?: Partial<SpaceAggregationOptions['list']>) {
        return this.setOptions(options).then('group-list-prop');
    }

    thenCount(options?: Partial<SpaceAggregationOptions['count']>) {
        return this.setOptions(options).then('count');
    }

    thenSearch(options?: Partial<SpaceAggregationOptions['search']>) {
        return this.setOptions(options).then('search');
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
                const sortBy = interpretSpaceQueryPropWithScore(
                    this.options.sortBy ?? '_id',
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

            case 'sort-desc-default': {
                const wasMissing = this.options.sortOrder === undefined;
                if (wasMissing) this.options.sortOrder = 'desc';
                const { stages } = this.generateStage('sort');
                if (wasMissing) this.options.sortOrder = undefined;

                return {
                    type: 'sort-desc-default',
                    stages
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
                } = this.requireOptions(
                    ['queryProp', 'queryString', 'caseSensitive', 'accentSensitive', 'matchWhole'],
                    'queryProp, queryString, caseSensitive, accentSensitive, and matchWhole are required for match stage.',
                );

                if (queryProp === 'known-as' && !this.hasKnownAs()) {
                    throw new TypeError(
                        'Cannot match known-as without adding it first.',
                    );
                }

                const interpretedProp = interpretSpaceQueryPropWithScore(queryProp);
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
                const { offset=0 } = this.options;
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
                    // Don't do anything
                    return {
                        type: 'limit',
                        stages: [],
                    };
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
                const { listProp } =
                    this.requireOptions(
                        ['listProp'], 'listProp is required for unwind-list-prop stage.'
                    );

                const interpretedProp = interpretSpaceQueryPropWithScore(listProp);
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
                const { listProp } = this.requireOptions(
                    ['listProp'],
                    'listProp is required for group-list-prop stage.',
                );

                const interpretedProp = interpretSpaceQueryPropWithScore(listProp);
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

            case 'search': {
                const { searchQuery } = this.requireOptions(
                    ['searchQuery'],
                    'searchQuery is required for search stage.'
                );

                if (searchQuery === "_score" && !this.hasScore()) {
                    throw new TypeError(
                        'Cannot sort by score without adding it first.'
                    );
                }

                const includeMap = SpaceModel.getPaths().reduce((acc, path) => {
                    acc[path] = 1;
                    return acc;
                }, {} as Record<string, 1>);

                return {
                    type: 'search',
                    stages: [
                        {
                            $search: {
                                index: 'default_spaces',
                                text: {
                                    query: searchQuery,
                                    path: {
                                        wildcard: '*',
                                    }
                                },
                            },
                        },
                        {
                            $project: {
                                ...includeMap,
                                _score: {
                                    $meta: 'searchScore',
                                },
                            }
                        }
                    ],
                };
            }

        }
    }
}

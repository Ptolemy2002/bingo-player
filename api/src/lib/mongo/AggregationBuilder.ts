import { MaybeTransformer } from "@ptolemy2002/ts-utils";
import { PipelineStage } from "mongoose";
import isCallable from "is-callable";

export type ThenValue<StageType extends string> =
    MaybeTransformer<
        StageType | PipelineStage | (PipelineStage | StageType)[], [AggregationBuilder<StageType>]
    >
;
export type StageGeneration<StageType extends string> = {
    type: StageType | "unknown",
    stages: PipelineStage[]
};

export default class AggregationBuilder<StageType extends string> {
    protected pipeline: StageGeneration<StageType>[] = [];

    generateStage(stage: StageType): StageGeneration<StageType> {
        return {
            type: stage,
            stages: []
        };
    }

    then(stage: ThenValue<StageType>) {
        if (isCallable(stage)) stage = stage(this);
        if (!Array.isArray(stage)) stage = [stage];

        this.pipeline.push(...(
            stage.reduce((acc, val) => {
                if (typeof val === "string") {
                    acc.push(this.generateStage(val));
                } else {
                    acc.push({
                        type: "unknown",
                        stages: [val]
                    });
                }

                return acc;
            }, [] as StageGeneration<StageType>[])
        ));
        return this;
    }

    build(): PipelineStage[] {
        return this.pipeline.reduce((acc, val) => {
            acc.push(...val.stages);
            return acc;
        }, [] as PipelineStage[]);
    }

    compose(other: AggregationBuilder<StageType>): this {
        this.pipeline.push(...other.pipeline);
        return this;
    }
}
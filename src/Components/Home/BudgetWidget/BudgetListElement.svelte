<script lang="ts">
    import ProgressBar from "./ProgressBar.svelte";
    import Budget from "../../../Models/Budget";
    import { currentTimePeriod } from "../../../scripts/app-state";
    import { afterUpdate } from "svelte";
    import { getProgressBarColor } from "../../../scripts/utils";
    import type { ProgressColors } from "./ProgressBar/progress-bar-colors";

    export let budget: Budget;

    let progressBarColor: ProgressColors = getProgressBarColor(budget);
    let progressBarProgress: number = budget.calculatePctValue();

    afterUpdate(() => {
        budget.calculateCurrentSpent(currentTimePeriod);
        progressBarColor = getProgressBarColor(budget);
        progressBarProgress = budget.calculatePctValue();
    });
</script>

<div class="px-8 flex flex-row justify-between items-center">
    <span class="inline-block font-medium text-lg">{budget.getName()}</span>
    <div class="w-72">
        <div class="flex flex-row justify-between items-center">
            <span>{budget.calculateCurrentSpent(currentTimePeriod).toString()}</span>
            <span class="opacity-75 text-sm">{budget.calculateRemainingSpend().toString()} remaining</span>
            <span>{budget.getMax().toString()}</span>
        </div>
        <ProgressBar color={progressBarColor} progress={progressBarProgress}></ProgressBar>
    </div>
</div>
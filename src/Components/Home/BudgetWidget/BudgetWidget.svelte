<script lang="ts">
    import type Budget from '../../../Models/Budget';
    import { currentTimePeriod } from '../../../scripts/app-state';
    import { formatDate } from '../../../scripts/utils';
    import GlassContainer from '../../GlassContainer.svelte';
    import WidgetTitle from '../../WidgetTitle.svelte';
    import BudgetListElement from './BudgetListElement.svelte';

    export let budgets: Array<Budget> = [];
</script>

<GlassContainer extraClasses="py-8 w-full min-w-[450px] h-fit">
    <div class="px-8 flex flex-row justify-between mb-8">
        <div>
            <WidgetTitle>Budgets</WidgetTitle>
            <span class="font-light text-text-secondary">{formatDate(currentTimePeriod.getStartDate())} -> {formatDate(currentTimePeriod.getEndDate())}</span>
        </div>
        <button class="bg-none text-text-secondary underline">Close period</button>
    </div>
    <div class="flex flex-col gap-4 max-h-[272px] overflow-y-scroll no-scroll">
        {#if budgets.length >= 1}
        {#each budgets as budget}
            <svelte:component this={BudgetListElement} {budget}></svelte:component>
        {/each}
        {:else}
            <span class="px-8 text-xl text-text font-medium text-center">There are no budgets yet. Head over to the "Budgets" tab to manage your budgets.</span>
        {/if}
    </div>
</GlassContainer>
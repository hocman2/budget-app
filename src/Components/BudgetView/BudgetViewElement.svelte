<script lang="ts">
    import '../../app.css'
    import Budget from "../../Models/Budget";
    import GlassContainer from "../GlassContainer.svelte";
    import GlassButton from "../Buttons/GlassButton.svelte";
    import { today } from "../../scripts/constants";
    import { currentTimePeriod } from "../../scripts/app-state";
    import ProgressBar from "../Home/BudgetWidget/ProgressBar.svelte";
    import { getProgressBarColor } from "../../scripts/utils";
    import { formatDate } from "../../scripts/utils";
    import MoneyValue from "../../Models/MoneyValue";
    import DeleteBudgetModal from "../Modals/DeleteBudgetModal.svelte";
    import BudgetModal from "../Modals/BudgetModal.svelte";
    import { afterUpdate, createEventDispatcher, onMount } from 'svelte';
    import type { ProgressColors } from '../Home/BudgetWidget/ProgressBar/progress-bar-colors';
    import WidgetTitle from '../WidgetTitle.svelte';

    const dispatch = createEventDispatcher();

    export let budget: Budget;

    let deleteModal: DeleteBudgetModal;
    let editModal: BudgetModal;
    let budgetExpenses: HTMLElement;
    let progressBarColor: ProgressColors = getProgressBarColor(budget);
    let progressBarProgress: number = budget.calculatePctValue();

    function openEditForm()
    {
        editModal.toggleOpen();
    }

    function openDeleteModal()
    {
        deleteModal.toggleOpen();
    }

    function showRelatedExpenses()
    {
        let expendableList = budgetExpenses;

        if (expendableList?.classList.contains('reveal-related-expenses'))
        {
            // Close menu
            expendableList.classList.remove('reveal-related-expenses');
            expendableList.classList.add('hide-related-expenses');

            expendableList.addEventListener('animationend', () => {
                expendableList?.classList.remove('hide-related-expenses');

            }, {once: true});
        }
        else
        {
            expendableList?.classList.add('reveal-related-expenses');
        }
    }

    function budgetOverflowTime(): string
    {
        let daysOverflow = budget.calculateDaysBeforeOverflow(budget.calculateAverageSpent(currentTimePeriod.getStartDate(), today));

        return (daysOverflow > 1) ? daysOverflow.toFixed(0) + " days" : daysOverflow.toFixed(0) + " day";
    }
    
    afterUpdate(() => {
        progressBarColor = getProgressBarColor(budget);
        progressBarProgress = budget.calculatePctValue();
    })
</script>
<DeleteBudgetModal budget={budget} bind:this={deleteModal} on:modalClosed={() => dispatch("budgetEditOrDelete")}></DeleteBudgetModal>
<BudgetModal budget={budget} bind:this={editModal} on:modalClosed={() => dispatch("budgetEditOrDelete")}></BudgetModal>
<GlassContainer extraClasses="min-w-full px-10 py-8">
    <div class="flex justify-between mb-12">
        <div>
            <WidgetTitle>{budget.getName()}</WidgetTitle>
            <span class="opacity-75">{budget.getRemainingDays(today, currentTimePeriod).toFixed(0)} days remaining</span>
        </div>
        <div>
            <span class="block text-right"><span class="opacity-75">Avg spending – </span><span class="font-medium">{new MoneyValue(budget.calculateAverageSpent(currentTimePeriod.getStartDate(), today)).toString()}/day</span></span>
            {#if budget.isOverspent()}
                <span class="block text-right text-text-error font-medium">Overspent budget</span>
            {:else if budget.getCurrentSpent().value() > 0}
                <span class="block text-right"><span class="opacity-75">Will overflow ~ </span><span class="font-medium">{budgetOverflowTime()}</span></span>
            {/if}
        </div>
    </div>
    <div class="flex justify-between mb-2">
        <div>
            <span>{budget.getCurrentSpent().toString()}</span>
            <span class="text-sm opacity-75">{budget.calculatePctValue().toFixed(2)}%</span>
        </div>
        <span class="{budget.isOverspent() ? "text-text-error" : ""}">{budget.calculateRemainingSpend().toString()} remaining</span>
        <span>{budget.getMax().toString()}</span>
    </div>
    <ProgressBar height="large" bind:color={progressBarColor} bind:progress={progressBarProgress}></ProgressBar>
    <div class="relative w-full text-right mt-8">
        <div class="absolute position-0 text-center">
            <button on:click={() => showRelatedExpenses()} class="underline">View related expenses</button>
        </div>
        <div class="mx-auto">
            <GlassButton on:click={() => openEditForm()} extraClasses="px-8 py-2">Edit</GlassButton>
            <button on:click={() => openDeleteModal()} class="ml-6 underline opacity-75">Delete</button>
        </div>
    </div>
    <div style="--height: 128px; --margin-top: 16px" bind:this={budgetExpenses} class="bg-dark bg-opacity-50 rounded-xl max-h-0 overflow-y-scroll no-scroll">
        {#each budget.findRelatedExpenses(currentTimePeriod).entries() as [k, expense]}
            <div class="px-4 py-2 w-full flex justify-between items-center {(k % 2 == 1)? 'bg-white bg-opacity-10' : ''}">
                <div>
                    <span class="block font-medium">{expense.name}</span>
                    <span class="block opacity-75 text-sm">{formatDate(expense.date)}</span>
                </div>
                <span class="font-mono font-medium text-accent-light ml-auto">-{expense.getAmount().toString()}</span>
            </div>
        {/each}
    </div>
</GlassContainer>

<style>
    @keyframes reveal-related-expenses {
        from {
            max-height: 0;
            margin-top: 0;
        }
        to {
            /* these are defined in the component's inline styling */
            max-height: var(--height);
            margin-top: var(--margin-top);
        }
    }

    /* it don't work with animation reverse 😢 */
    @keyframes hide-related-expenses {
        from {
            max-height: var(--height);
            margin-top: var(--margin-top);
        }
        to {
            max-height: 0;
            margin-top: 0;
        }
    }

    /* global bcause svelte doesn't include unused css */
    :global(.reveal-related-expenses) {
        animation: 200ms linear 0s reveal-related-expenses;
        animation-fill-mode: forwards;
    }

    :global(.hide-related-expenses) {
        animation: 200ms linear 0s hide-related-expenses;
        animation-fill-mode: forwards;
    }
</style>
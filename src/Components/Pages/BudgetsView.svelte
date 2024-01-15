<script lang="ts">
    import Budget from '../../Models/Budget';
    import { budgets, currentTimePeriod } from "../../scripts/app-state";
    import GradientButton from '../Buttons/GradientButton.svelte';
    import BudgetModal from '../Modals/BudgetModal.svelte';
    import DeleteBudgetModal from '../Modals/DeleteBudgetModal.svelte';
    import { onMount } from 'svelte';
    import BudgetViewElement from '../BudgetView/BudgetViewElement.svelte';

    function openCreateForm()
    {
        budgetModal.toggleOpen();
    }

    let budgetModal: BudgetModal;
    // just so we can do allBudgets = budgets to trigger an update when a change is made
    let allBudgets: Budget[] = budgets;

    onMount(() => allBudgets.forEach((b) => b.calculateCurrentSpent(currentTimePeriod)))

</script>
<BudgetModal on:modalClosed={() => allBudgets=budgets} bind:this={budgetModal}></BudgetModal>
{#if allBudgets.length > 0}
<div class="w-full text-right mb-8">
    <GradientButton on:click={openCreateForm} extraClasses="font-bold px-6 py-4">Create new budget</GradientButton>
</div>
<div class="w-full flex flex-col gap-8">
    {#each allBudgets as budget }
        <BudgetViewElement on:budgetEditOrDelete={() => allBudgets=budgets} budget={budget}></BudgetViewElement>
    {/each}
</div>
{:else}
<div class="flex flex-col items-center justify-center h-full my-auto gap-8">
    <h1 class="text-2xl text-text font-semibold text-center">It looks like you don't have any budget yet.<br>Create a budget to have a better view of your expenses. 📊</h1>
    <GradientButton on:click={openCreateForm} extraClasses="font-bold px-6 py-4">Create new budget</GradientButton>
</div>
{/if}
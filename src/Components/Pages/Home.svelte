<script lang="ts">
    import AccountWidget from '../Home/AccountsWidget/AccountWidget.svelte';
    import RecentTransactionsWidget from '../Home/RecentTransactionsWidget/RecentTransactionsWidget.svelte';
    import BudgetWidget from '../Home/BudgetWidget/BudgetWidget.svelte';
    import ChartWidget from '../Home/ChartWidget.svelte';
    import { userAccounts, budgets, currentTimePeriod } from '../../scripts/app-state';

    let allBudgets = budgets;
    let allSpendingAccounts = userAccounts.getSpendingAccounts();
    let allSavingAccounts = userAccounts.getSavingAccounts();
    
    // Svelte only re-renders when variables are reassigned.
    // Here we trigger an update of widgets that use budgets and/or accounts when their respective events
    // are fired
    currentTimePeriod.onTransactionsUpdated(() => {
        allBudgets=budgets
    });
    userAccounts.onAccountsUpdated(() => {
        allSpendingAccounts = userAccounts.getSpendingAccounts();
        allSavingAccounts = userAccounts.getSavingAccounts();
    });

    function shouldDisplayGraph(): boolean
    {
        let atLeastOneBudget = allBudgets.length > 0
        let atLeastOneBudgetExpense = allBudgets.map((b) => b.findRelatedExpenses(currentTimePeriod)).flat().length > 0;
        return atLeastOneBudget && atLeastOneBudgetExpense
    }

</script>

<div class="grid grid-cols-2 grid-rows-2 gap-8">
    <div class="w-[80%] mx-auto min-w-[300px]">
        <AccountWidget spendingAccounts={allSpendingAccounts} savingAccounts={allSavingAccounts}></AccountWidget>
    </div>
    <div>
        <BudgetWidget budgets={allBudgets}></BudgetWidget>
    </div>
    <div class="m-auto max-w-[440px] w-full">
        <RecentTransactionsWidget></RecentTransactionsWidget>
    </div>
    {#if shouldDisplayGraph()}
    <div class="my-auto min-w-[512px]">
        <ChartWidget budgets={allBudgets}></ChartWidget>
    </div>
    {/if}
</div>
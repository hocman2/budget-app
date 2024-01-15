<script lang="ts">
    import { afterUpdate, onMount } from "svelte";
    import { formatDate } from "../../../scripts/utils";
    import Transaction from "../../../Models/Transaction";
    import Expense from "../../../Models/Expense";
    import Budget from "../../../Models/Budget";
    import { Categories, budgets } from "../../../scripts/app-state";
    import Income from "../../../Models/Income";
    import Transfer from "../../../Models/Transfer";

    export let transaction: Transaction;
    
    let amountElement: HTMLElement;
    let amountStr: string = "";

    afterUpdate(() => {
        amountElement.classList.remove('text-accent-light', 'text-valid');

        if (transaction instanceof Expense)
        {
            amountStr = `-${transaction.getAmount().toString()}`;
            amountElement.classList.add("text-accent-light");
        }
        else if (transaction instanceof Income)
        {
            amountStr = `+${transaction.getAmount().toString()}`;
            amountElement.classList.add("text-valid");
        }
        else
        {
            amountStr = `${transaction.getAmount().toString()}`;
            amountElement.classList.add("text-text-secondary");
        }
    });
</script>

<div class="flex flex-row justify-between">
    <div class="flex flex-col">
        <div>
            <span class="font-medium">{transaction.name}</span>
            <span class="text-sm text-text-secondary">{formatDate(transaction.date)}</span>
        </div>
        {#if !(transaction instanceof Transfer)}
        <span class="block opacity-75">
            {transaction.account.getName()}
        </span>
        {/if}
        {#if transaction instanceof Expense && transaction.category !== Categories.None && transaction.getRelatedBudget(budgets)}
        <span class="block">
            {transaction.getRelatedBudget(budgets)?.getName()}
        </span>
        {/if}
    </div>
    <div bind:this={amountElement} class="font-medium font-mono my-auto">
        {amountStr}
    </div>
</div>
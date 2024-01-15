<script lang="ts">
    import { onMount } from "svelte";
    import Income from "../../../Models/Income";
    import Transaction from "../../../Models/Transaction";

    export let transaction: Transaction;
    let income: Income|undefined;
    if (transaction instanceof Income)
    {
        income = <Income>transaction;
    }
    else
    {
        console.error("Failed to cast transaction as Income. Make sure the prop is of type Income");
    }

    function getSpendingFontWeight(): string
    {
        let incomeSure: Income = income!;

        if (incomeSure.savingAccount === undefined) return "font-bold";

        if (incomeSure.percentSavings > 0.75) return "font-thin"
        else if (incomeSure.percentSavings > 0.5) return "font-normal"
        else if (incomeSure.percentSavings > 0.25) return "font-medium"
        else return "font-bold";
    }

    function getSavingFontWeight(): string
    {
        let incomeSure: Income = income!;

        if (incomeSure.savingAccount === undefined) return "font-thin";

        if (incomeSure.percentSavings > 0.75) return "font-bold"
        else if (incomeSure.percentSavings > 0.5) return "font-medium"
        else if (incomeSure.percentSavings > 0.25) return "font-normal"
        else return "font-thin";
    }
</script>

{#if income !== undefined}
<li class="flex justify-between items-center my-2">
    <div class="w-full">
        <div class="w-full flex justify-between items-center">
            <span class="block font-medium">{income.name}</span>
            {#if income.savingAccount !== undefined}
            <span class="font-mono">+{income.getTotalAmount().toString()}</span>
            {/if}
        </div>
        <div class="px-2 w-full flex justify-between items-center">
            <span class="block opacity-75">{income.account.getName()}</span>
            <span class="font-mono text-valid {getSpendingFontWeight()}">+{income.getAmount().toString()}</span>
        </div>
        {#if income.savingAccount !== undefined}
        <div class="px-2 w-full flex justify-between items-center">
            <span class="block opacity-50">{income.savingAccount.getName()}</span>
            <span class="font-mono text-valid {getSavingFontWeight()}">+{income.getSavedAmount().toString()} ({income.percentSavings * 100}%)</span>
        </div>
        {/if}
    </div>
</li>
{/if}
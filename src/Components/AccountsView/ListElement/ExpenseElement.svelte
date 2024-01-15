<script lang="ts">
    import Transaction from "../../../Models/Transaction";
    import Expense from "../../../Models/Expense";

    export let transaction: Transaction;

    // All of that hastle to make sure type is safe, we could've silentely cast transaction as Expense directly
    let expense: Expense|undefined;
    if (transaction instanceof Expense)
    {
        expense = <Expense>transaction;
    }
    else
    {
        console.error("Failed to cast transaction as Expense. Make sure the prop is of type Expense");
    }
</script>

{#if expense !== undefined}
<li class="flex justify-between items-center my-2">
    <div>
        <span class="block font-medium">{expense.name}</span>
        <div class="flex items-center">
            <svg class="h-4 -rotate-90 fill-text-secondary" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z"></path>
            </svg>
            <span class="text-text-secondary">{expense.account.getName()}</span>
        </div>
        {#if expense.category}
            <span class="block text-sm opacity-75">{expense.category.label}</span>
        {/if}
    </div>
    <span class="text-accent-light font-mono font-medium">-{expense.getAmount().toString()}</span>
</li>
{/if}
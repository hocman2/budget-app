<script lang="ts">
    import '../../../app.css'
    import GlassContainer from "../../GlassContainer.svelte";
    import RecentTransactionElement from "./RecentTransactionElement.svelte";

    import { currentTimePeriod, userAccounts } from "../../../scripts/app-state";
    import Transaction from "../../../Models/Expense";
    import NewTransactionModal from '../../Modals/NewTransactionModal.svelte';
    import { onMount } from 'svelte';
    import TransactionButton from '../../Buttons/TransactionButton.svelte';
    import WidgetTitle from '../../WidgetTitle.svelte';

    let transactions: Array<Transaction> = fetchTransactions();
    let button: TransactionButton

    function fetchTransactions(): Array<Transaction>
    {
        return currentTimePeriod.getTransactions()
        .sort((a, b) => b.date.getTime() - a.date.getTime()) as Transaction[]; // Sorted by decreasing date
    }

    function openForm()
    {
        if (userAccounts.getAllAccounts().length > 0)
        {
            modal.toggleOpen();
        }
        else
        {
            button.triggerTooltip();
        }
    }

    onMount(() => {
        currentTimePeriod.onTransactionsUpdated(() => transactions=fetchTransactions());
    });

    let modal: NewTransactionModal;
</script>

<NewTransactionModal bind:this={modal}></NewTransactionModal>
<GlassContainer extraClasses="p-8">
    <div class="flex flex-row">
        <div class="flex-grow mr-10 font-bold leading-none separator">
            <WidgetTitle>
                Last transactions
            </WidgetTitle>
        </div>
        <TransactionButton bind:this={button} on:click={openForm} extraClasses="aspect-square h-10 w-10">
            <span class="text-lg font-bold">+</span>
        </TransactionButton>
    </div>
    <div class="pt-4 gap-8 flex flex-col w-full">
        {#if transactions.length > 0}
        {#each transactions as transaction}
            <RecentTransactionElement transaction={transaction}></RecentTransactionElement>
        {/each}
        {:else}
            <h2 class="text-lg text-text font-semibold text-center">There are no recent transactions for this period.</h2>
        {/if}
    </div>
</GlassContainer>
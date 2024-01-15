<script lang="ts">
    import GlassContainer from "../GlassContainer.svelte";
    import Transaction from "../../Models/Transaction";
    import { formatDate } from "../../scripts/utils";
    import ChevronButton from "../Buttons/ChevronButton.svelte";
    import WidgetTitle from '../WidgetTitle.svelte';
    import { createEventDispatcher, type ComponentType, afterUpdate, tick } from "svelte";
    import TransactionButton from "../Buttons/TransactionButton.svelte";
    import { currentTimePeriod, userAccounts } from "../../scripts/app-state";

    const dispatch = createEventDispatcher();

    export let emptyMessage: string = "";
    export let emptyButtonMessage: string = "+";
    export let title: string;
    export let transactions:Map<Date, Transaction[]>;
    export let listElement: ComponentType;
    // a bit verbose but it works
    export let width: string = "";
    export let minWidth: string = "";
    export let maxWidth: string = "";
    export let height: string = "";
    export let minHeight: string = "";
    export let maxHeight: string = "";

    let container: HTMLElement;
    let transactionButton: TransactionButton;
    
    let dateSortFn = (a: Date, b: Date) => { return b.getTime() - a.getTime()};
    let dateList = getDateList();

    export function triggerTooltip()
    {
        transactionButton.triggerTooltip();
    }

    function getTransactions(date: Date): Array<Transaction>
    {
        return transactions.get(date)!;
    }

    function chevronClicked(dateIndex: number, e: CustomEvent)
    {
        let relatedList = container.querySelectorAll('.transaction-list').item(dateIndex);
        switch (e.detail.newState)
        {
        case "open":
            relatedList.classList.remove("collapsed");
            relatedList.classList.add("uncollapsed");
            break;
        case "close":
            (relatedList as HTMLElement).style.setProperty("--list-height", `${relatedList.getBoundingClientRect().height}px`);
            relatedList.classList.remove("uncollapsed");
            relatedList.classList.add("collapsed");
            break;
        default:
            break;
        }
    }

    function getDateList()
    {
        return Array.from(transactions.keys()).sort(dateSortFn);
    }
    
    afterUpdate(async () => {
        dateList = getDateList();

        // Wait for the lists to appear
        await tick();

        // Populate transactions manually to make it reactive
        let transactionLists = container.querySelectorAll(".transaction-list");
        // Loop through every list (1 list = 1 date)
        transactionLists.forEach((list) => {
            
            // First clean up the list
            while (list.firstChild)
            {
                list.removeChild(list.firstChild);
            }

            // Find the date object from the given transactions map
            let dateIndex = Number.parseInt((<HTMLElement>list).dataset.dateIndex!);
            let dateObject = getDateList()[dateIndex];

            // Populate list with transactions
            getTransactions(dateObject).forEach((tr) => {
                new listElement({target: list, props: {transaction: tr}});
            });
        });
    });
</script>

<GlassContainer extraClasses="{width} {minWidth} {maxWidth} {height} {minHeight} {maxHeight} 
    py-6 px-6 flex flex-col">
    {#if transactions.size > 0}
    <div class="flex justify-between items-center">
        <WidgetTitle>{title}</WidgetTitle>
        <TransactionButton bind:this={transactionButton} on:click={() => dispatch("buttonClicked")} extraClasses="aspect-square w-10">
            <span class="text-lg font-bold">+</span>
        </TransactionButton>
        </div>
    <div bind:this={container} class="flex-grow overflow-y-scroll no-scroll">
        {#each dateList.entries() as [i, date]}
            <div class="my-2">
                <div class="flex justify-between items-center">
                    <span class="text-lg font-medium">{formatDate(date)}</span>
                    <ChevronButton on:click={(e) => {chevronClicked(i, e)}}></ChevronButton>
                </div>
                <ol data-date-index={i} class="px-4 transaction-list">
                </ol>
            </div>
        {/each}
        <slot name="list-end"></slot>
    </div>
    {:else}
    <WidgetTitle>{title}</WidgetTitle>
    <div bind:this={container} class="flex-grow flex flex-col text-center gap-8 justify-center items-center">
        <h1 class="text-lg text-text font-medium">{emptyMessage}</h1>
        <TransactionButton bind:this={transactionButton} on:click={() => dispatch("buttonClicked")} extraClasses="w-fit py-4 px-8">
            <span class="font-medium">{emptyButtonMessage}</span>
        </TransactionButton>
    </div>
    {/if}
</GlassContainer>

<style>

    @keyframes transaction-list-disappear
    {
        from
        {
            height: var(--list-height);
        }
        99.99%
        {
            position: static;
        }
        to
        {
            height: 0px;
            opacity: 0;
            transform: translateY(-10%);
            filter: blur(4px);
            position: absolute;
        }
    }

    @keyframes transaction-list-appear
    {
        from
        {
            height: 0px;
            opacity: 0;
            transform: translateY(-25%);
        }
        99.99%
        {
            position: static;
        }
        to
        {
            height: var(--list-height);
            opacity: 1;
            transform: none;
        }
    }

    :global(.transaction-list.collapsed)
    {
        animation: forwards 300ms ease-in-out 0s transaction-list-disappear;
    }
    /* 
    a special class is used for uncollapsing list so the animation doesn't play when the page 
    is first loaded
    */
    :global(.transaction-list.uncollapsed)
    {
        animation: forwards 300ms ease-in-out 0s transaction-list-appear;
    }

</style>
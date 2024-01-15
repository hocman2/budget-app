<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import Expense from "../../Models/Expense";
    import Income from "../../Models/Income";
    import { currentTimePeriod, userAccounts } from "../../scripts/app-state";
    import ExpenseElement from "../AccountsView/ListElement/ExpenseElement.svelte";
    import IncomeElement from "../AccountsView/ListElement/IncomeElement.svelte";
    import TransactionList from "../AccountsView/TransactionList.svelte";
    import AccountContainer from "../Home/AccountsWidget/AccountContainer.svelte";
    import TransferButton from "../Buttons/TransferButton.svelte";
    import SpendingAccount from "../../Models/SpendingAccount";
    import SavingAccount from "../../Models/SavingAccount";
    import NewTransactionModal from "../Modals/NewTransactionModal.svelte";
    import LinkElement from "../AccountsView/LinkElement.svelte";

    let expenseModal: NewTransactionModal;
    let incomeModal: NewTransactionModal;

    let incomeListContainer: HTMLElement;
    let incomeList: TransactionList
    let expenseList: TransactionList
    let spendingAccountsContainer: HTMLElement;
    let savingAccountsContainer: HTMLElement;
    let expenseListContainer: HTMLElement;
    let topLinkContainer: HTMLElement;

    let accountsLink: LinkElement;
    let incomeAccountsLink: LinkElement;
    let expenseAccountsLink: LinkElement;

    let allSpendingAccounts: SpendingAccount[] = userAccounts.getSpendingAccounts();
    let allSavingAccounts: SavingAccount[] = userAccounts.getSavingAccounts();
    let allIncomes: Map<Date, Income[]> = Income.getIncomesByDate([currentTimePeriod]);
    let allExpenses: Map<Date, Expense[]> = Expense.getExpensesByDate([currentTimePeriod]);

    // Resize the top link area to keep the distance between income list and spending accounts constant
    let previousHeight: number = NaN;
    let incomeListResizeObserver = new ResizeObserver((entries) => {
        if (Number.isNaN(previousHeight))
        {
            previousHeight = incomeListContainer.clientHeight;
        }

        let listHeight = entries[0].target.clientHeight;
        let deltaHeight = previousHeight - listHeight;

        topLinkContainer.style.height = Number.parseInt(getComputedStyle(topLinkContainer).height) + deltaHeight + "px";
        
        // Reposition lines
        incomeAccountsLink.positionLine(incomeListContainer, spendingAccountsContainer);
        accountsLink.positionLine(spendingAccountsContainer, savingAccountsContainer);

        previousHeight = listHeight;
    });

    let mainResizeObserver = new ResizeObserver((entries) => {
        expenseAccountsLink.positionLine(spendingAccountsContainer, expenseListContainer);
    });

    currentTimePeriod.onTransactionsUpdated(() => {
        allIncomes = Income.getIncomesByDate([currentTimePeriod]);
        allExpenses = Expense.getExpensesByDate([currentTimePeriod]);
    });

    userAccounts.onAccountsUpdated(() => {
        allSpendingAccounts = userAccounts.getSpendingAccounts();
        allSavingAccounts = userAccounts.getSavingAccounts();
    });

    function openModal(list: TransactionList, modalToOpen: NewTransactionModal)
    {
        if (userAccounts.getAllAccounts().length > 0)
        {
            modalToOpen.toggleOpen();
        }
        else
        {
            list.triggerTooltip();
        }
    }

    function transferClicked(e: CustomEvent)
    {
        let link = document.querySelector(".bottom-link-element")!;
        if (e.detail as boolean)
        {
            link.classList.remove("opacity-100");
            link.classList.add("opacity-0");
        }
        else
        {
            setTimeout(() => {
                link.classList.remove("opacity-0");
                link.classList.add("opacity-100");
            }, 200);
        }
    }

    onMount(() => {
        incomeListResizeObserver.observe(incomeListContainer);
        mainResizeObserver.observe(document.querySelector("main")!);

        expenseAccountsLink.positionLine(spendingAccountsContainer, expenseListContainer);
    });

    onDestroy(() => {
        incomeListResizeObserver.disconnect();
        mainResizeObserver.disconnect();
    });

</script>

<NewTransactionModal bind:this={expenseModal} type="expense"></NewTransactionModal>
<NewTransactionModal bind:this={incomeModal} type="income"></NewTransactionModal>
<div class="flex justify-between h-full gap-16">
    
    <div class="flex-1">
        <div bind:this={incomeListContainer}>
            <TransactionList title="Incomes" bind:this={incomeList} on:buttonClicked={() => openModal(incomeList, incomeModal)} transactions={allIncomes} listElement={IncomeElement}
            emptyMessage="There are currently no incomes for this time period. Start by adding one 👇"
            emptyButtonMessage="Add income"
            width="w-full" maxHeight="max-h-[250px]" minHeight="min-h-[150px]">
            </TransactionList>
        </div>
        <div bind:this={topLinkContainer} class="h-8">
            <LinkElement bind:this={incomeAccountsLink} linkColorClass="bg-valid" arrowColorClass="fill-valid" numArrows={1} direction="vertical"></LinkElement>
        </div>
        <div>
            <div class="w-[80%] min-w-[300px] mx-auto">
                <AccountContainer bind:container={spendingAccountsContainer} type={SpendingAccount} sectionName="Spendings" accounts={allSpendingAccounts}></AccountContainer>
            </div>
        </div>
        <div class="w-[50%] h-fit">
            <TransferButton on:click={transferClicked} containerInitialHeight="80px"></TransferButton>
        </div>
        <div class="bottom-link-element opacity-100">
            <LinkElement bind:this={accountsLink} linkColorClass="bg-valid" arrowColorClass="fill-valid" numArrows={3} direction="vertical"></LinkElement>
        </div>
        <div>
            <div class="w-[80%] min-w-[300px] mx-auto">
                <AccountContainer bind:container={savingAccountsContainer} type={SavingAccount} sectionName="Savings" accounts={allSavingAccounts}></AccountContainer>
            </div>
        </div>
    </div>
    <LinkElement bind:this={expenseAccountsLink} linkColorClass="bg-accent-light" arrowColorClass="fill-accent-light" numArrows={1} direction="horizontal"></LinkElement>
    <div bind:this={expenseListContainer} class="flex-1 min-w-[440px]">
        <TransactionList title="Expenses" bind:this={expenseList} on:buttonClicked={() => openModal(expenseList, expenseModal)} transactions={allExpenses} listElement={ExpenseElement}
            width="w-full" minWidth="min-w-[50%]" minHeight="min-h-[375px]" maxHeight="max-h-full"
            emptyMessage="There are no expenses for the current time period. Start by adding one 👇"
            emptyButtonMessage="Add expense">
            <div slot="list-end" class="w-full mt-16 text-center opacity-75 text-xl font-medium">
                You have reached the start of this period.
            </div>
        </TransactionList>
    </div>
</div>

<style>
    .bottom-link-element {
        @apply transition-opacity duration-150;
    }
</style>
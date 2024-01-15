<script lang="ts">
    import Modal from "./Modal.svelte";
    import { Categories, today } from "../../scripts/app-state";
    import { userAccounts } from "../../scripts/app-state";
    import type { SlSelect } from "@shoelace-style/shoelace";
    import { createEventDispatcher } from "svelte";
    import { currentTimePeriod } from "../../scripts/app-state";
    import { type TransactionDefinition, TransactionType } from "../../Models/TimePeriod";
    import MoneyValue from "../../Models/MoneyValue";
    import Account from "../../Models/Account";

    const dispatch = createEventDispatcher()
    export const toggleOpen = () => modal.toggleOpen()

    // If type is provided externally, it is enforced on the form below
    export let type: "expense"|"income"|undefined = undefined;

    let modal: Modal;
    let form: HTMLFormElement;

    let selectedType: "expense"|"income" = "expense";
    
    function typeChanged(select: SlSelect)
    {
        selectedType = select.value as "expense"|"income";
    }

    function formSubmit(e: SubmitEvent)
    {
        e.preventDefault();
        if (!form.checkValidity()) return;

        let data = new FormData(form);
        
        let amountValue = data.get('transaction-amount')!.toString();
        let nameValue = data.get('transaction-name')!.toString();
        let transactionAccountValue = data.get('transaction-account')!.toString();

        let transactionAmount = Number.parseFloat(amountValue);

        let transaction: TransactionDefinition = {
            type: (selectedType === "expense") ? TransactionType.Expense : TransactionType.Income,
            name: nameValue,
            amount: new MoneyValue(transactionAmount),
            date: today,
            account: Account.findById(userAccounts.getAllAccounts(), Number.parseInt(transactionAccountValue))!,
            category: Categories.None, // Defaults to none
        };

        if (selectedType === "expense")
        {
            let categoryValue = data.get('transaction-category')!.toString();
            transaction.category = Categories.getCategory(categoryValue);
        }

        if (selectedType === "income")
        {
            let savingTypeValue = data.get('saving-proportion-type')!.toString()
            let amountSavedValue = data.get('amount-saved')!.toString();
            let savingAccountValue = data.get('saving-account')!.toString();

            transaction.otherAccount = Account.findById(userAccounts.getSavingAccounts(), Number.parseInt(savingAccountValue))!;

            let givenProportionValue = Number.parseFloat(amountSavedValue);

            let proportionType: "percent"|"currency" = savingTypeValue as "percent"|"currency"
            let pctInSaving: number = givenProportionValue / 100;

            if (proportionType === "currency")
            {
                // given value in pct of total amount
                pctInSaving = givenProportionValue / transactionAmount;
            }

            transaction.savingPercent = pctInSaving;
        }

        // Add the transaction to the time period
        currentTimePeriod.makeAndAdd(transaction);

        modal.toggleOpen();
    }

    function modalOpened() {

        let typeSelect: SlSelect|null = form.querySelector(".transaction-type");
        if (typeSelect)
        {
            typeSelect.addEventListener("sl-change", (e) => { typeChanged(e.target as SlSelect) });
            typeChanged(typeSelect);
        }
        // If is redundant here because if typeSelect is null, type has to be a value
        else if (type)
        {
            selectedType = type;
        }
    }
</script>

<Modal bind:this={modal} on:modalOpened={modalOpened} on:modalClosed={() => dispatch("modalClosed")}>
    <form bind:this={form} on:submit={formSubmit} class="validity-styles input-validation-required">
        {#if type === undefined}
        <sl-select class="transaction-type" name="transaction-type" label="Type" value="expense">
            <sl-option value="expense">Expense</sl-option>
            <sl-option value="income">Income</sl-option>
        </sl-select>
        {/if}
        <sl-input required name="transaction-name" label="Name"></sl-input>
        <sl-input required placeholder="0" name="transaction-amount" label="Amount" pattern="([0-9.,])+">
            <span slot="prefix">{MoneyValue.currencyType}</span>
        </sl-input>    
        {#if selectedType === "expense"}
        <sl-select name="transaction-category" clearable label="category">
            {#each Categories.getAllIdentifiers() as category}
            <sl-option value="{category}">{Categories.getCategory(category)?.label}</sl-option>
            {/each}
        </sl-select>
        {/if}
        <sl-select name="transaction-account" value={`${userAccounts.getSpendingAccounts()[0].id}`} label="Account">
            <small>Spending accounts</small>
            {#each userAccounts.getSpendingAccounts() as account}
            <sl-option value={account.id}>{account.getName()}</sl-option>
            {/each}
            {#if selectedType === "income"}
                <small>Saving accounts</small>
                {#each userAccounts.getSavingAccounts() as account}
                <sl-option value={account.id}>{account.getName()}</sl-option>
                {/each}
            {/if}
        </sl-select>
        {#if selectedType === "income"}
            <sl-select name="saving-account" placeholder="Select a saving account" clearable label="Saving account">
                {#each userAccounts.getSavingAccounts() as account}
                <sl-option value={account.id}>{account.getName()}</sl-option>
                {/each}
            </sl-select>
            <label for="amount-saved">saving proportion</label>
            <div class="relative">
                <sl-input required name="amount-saved" pattern="([0-9.,])+" value="10"></sl-input>
                <sl-select name="saving-proportion-type" class="absolute top-0 bottom-0 w-24 right-0" value="percent">
                    <sl-option value="percent">%</sl-option>
                    <sl-option value="currency">{MoneyValue.currency()}</sl-option>
                </sl-select>
            </div>
        {/if}
        <sl-button class="submit-button" variant="primary" type="submit">Submit</sl-button>
    </form>
</Modal>
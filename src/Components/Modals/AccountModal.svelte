<script lang="ts">
    // Using the same modal for editing and adding because it's pretty similar

    import { createEventDispatcher } from "svelte";
    import WidgetTitle from "../WidgetTitle.svelte";
    import Modal from "./Modal.svelte";
    import type Account from "../../Models/Account";
    import type { SlInput, SlSelect } from "@shoelace-style/shoelace";
    import MoneyValue from "../../Models/MoneyValue";
    import { currentTimePeriod, today, userAccounts } from "../../scripts/app-state";
    import { TransactionType } from "../../Models/TimePeriod";
    import SpendingAccount from "../../Models/SpendingAccount";
    import SavingAccount from "../../Models/SavingAccount";

    const dispatch = createEventDispatcher();

    let modal: Modal;
    export function toggleOpen() { modal.toggleOpen(); }
    // Potential budget to edit
    export let accounts: Array<Account>|undefined = undefined;
    export let type: typeof Account;

    let form: HTMLFormElement;

    let editedAccount: Account|undefined = undefined;

    function formSubmit(e: SubmitEvent)
    {
        e.preventDefault(); // no submit
        // Sometimes submition is done before validation
        if (!form.checkValidity()) return;

        let data = new FormData(form);
        let nameValue = data.get('account-name')!.toString();
        let amountValue = data.get('account-amount')!.toString();

        let amount = Number.parseFloat(amountValue);
        if (editedAccount)
        {
            let balancingAmount = amount - editedAccount.getAmount().value();
            currentTimePeriod.makeAndAdd({
                type: TransactionType.Balancing,
                name: "Balancing",
                date: today,
                amount: new MoneyValue(balancingAmount),
                account: editedAccount
            });

            editedAccount.setName(nameValue);
        }
        else
        {
            if (type === SpendingAccount)
            {
                userAccounts.addSpendingAccount(new SpendingAccount(nameValue, new MoneyValue(amount)));
            }
            else if (type === SavingAccount)
            {
                userAccounts.addSavingAccount(new SavingAccount(nameValue, new MoneyValue(amount)));
            }
        }

        toggleOpen();
    }

    function accountSelected(select: SlSelect) {
        let selectedId = Number.parseInt(select.value as string);
        editedAccount = accounts!.find((a) => a.id === selectedId)!;
    }

    function modalOpened() {
        let data = new FormData(form);
        if (data.get('selected-account'))
        {
            let select: SlSelect = form.querySelector('sl-select')!;
            select.addEventListener("sl-change", (e) => { accountSelected(e.target as SlSelect); });
            accountSelected(select);
        }
        
        dispatch("modalOpened");
    }
</script>

<Modal on:modalOpened={modalOpened} on:modalClosed={() => dispatch("modalClosed")} bind:this={modal}>
    {#if accounts !== undefined}
    <WidgetTitle>Edit account</WidgetTitle>
    {:else}
    <WidgetTitle>Create new account</WidgetTitle>
    {/if}
    <form bind:this={form} on:submit={formSubmit} class="validity-styles input-validation-required">
        {#if accounts !== undefined}
            <sl-select name="selected-account" label="Account to edit" value={`${accounts[0].id}`}>
                {#each accounts as account}
                <sl-option value={account.id}>{account.getName()}</sl-option>
                {/each}
            </sl-select>
        {/if}
        <sl-input value={(editedAccount) ? editedAccount.getName() : ""} name="account-name" required label="Account name"></sl-input>
        <sl-input value={(editedAccount) ? editedAccount.getAmount().value() : ""} name="account-amount" required label="Amount" pattern="([0-9.,])+">
            <span slot="prefix">{MoneyValue.currencyType}</span>
        </sl-input>
        <sl-button class="submit-button" type="submit" variant="primary">Submit</sl-button>
    </form>
</Modal>
<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import WidgetTitle from "../WidgetTitle.svelte";
    import Modal from "./Modal.svelte";
    import type Account from "../../Models/Account";
    import type { SlSelect } from "@shoelace-style/shoelace";
    import { userAccounts } from "../../scripts/app-state";

    const dispatch = createEventDispatcher();

    let modal: Modal;
    export function toggleOpen() { modal.toggleOpen(); };
    
    export let accounts: Array<Account>;

    let accountSelect: SlSelect;
    let selectedAccount: Account;

    function deleteAccount()
    {
        userAccounts.deleteAccount(selectedAccount.id);
        toggleOpen();
    }

    function accountSelected(select: SlSelect) {
        let selectedId = Number.parseInt(select.value as string);
        selectedAccount = accounts!.find((a) => a.id === selectedId)!;
    }

    function modalOpened() 
    {
        accountSelect.addEventListener("sl-change", (e) => { accountSelected(e.target as SlSelect); });
        accountSelected(accountSelect);

        dispatch("modalOpened")
    }
</script>
<Modal on:modalClosed={() => dispatch("modalClosed")} on:modalOpened={modalOpened} bind:this={modal}>
    <WidgetTitle>Select an account to delete</WidgetTitle>
    <sl-select bind:this={accountSelect} value={`${accounts[0].id}`} label="Account to delete">
        {#each accounts as account}
        <sl-option value={account.id}>{account.getName()}</sl-option>
        {/each}
    </sl-select>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <sl-button on:click={toggleOpen}>Cancel</sl-button>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <sl-button on:click={deleteAccount} variant="danger">Delete</sl-button>
</Modal>
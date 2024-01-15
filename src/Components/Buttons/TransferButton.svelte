<script lang="ts">
    import { afterUpdate, createEventDispatcher } from "svelte";
    import GlassContainer from "../GlassContainer.svelte";
    import GradientButton from "./GradientButton.svelte";
    import { currentTimePeriod, userAccounts, today } from "../../scripts/app-state";
    import { TransactionType } from "../../Models/TimePeriod";
    import MoneyValue from "../../Models/MoneyValue";

    export let containerInitialHeight: string = "80px";

    const dispatch = createEventDispatcher();

    let allAccounts = userAccounts.getAllAccounts();

    let transferBox: HTMLElement;
    let container: HTMLElement;
    let form: HTMLFormElement;

    let transferOpen: boolean = false;
    function toggleTransferBox()
    {
        transferOpen = !transferOpen;

        if (transferOpen)
        {
            transferBox.classList.add("open");
            transferBox.classList.remove("close");
            container.classList.add("expanded");
            container.classList.remove("collapsed");
        }
        else
        {
            transferBox.classList.add("close");
            transferBox.classList.remove("open");
            container.classList.add("collapsed");
            container.classList.remove("expanded");
        }
    }

    function transferSubmit(e: SubmitEvent)
    {
        e.preventDefault();
        if (!form.checkValidity()) return;

        let data = new FormData(form);
        let giverAccountValue = data.get('giver-account')!.toString();
        let receiverAccountValue = data.get('receiver-account')!.toString();
        let amountValue = data.get('transfer-amount')!.toString();

        let giverAccount = allAccounts.find((a) => a.id === Number.parseInt(giverAccountValue));
        let targetAccount = allAccounts.find((a) => a.id === Number.parseInt(receiverAccountValue));


        currentTimePeriod.makeAndAdd({
            type: TransactionType.Transfer,
            name: `${giverAccount?.getName()} => ${targetAccount?.getName()}`,
            amount: new MoneyValue(Number.parseFloat(amountValue)),
            date: today,
            account: giverAccount!,
            otherAccount: targetAccount,
        });

        toggleTransferBox();
    }

    function buttonClicked()
    {
        toggleTransferBox();
        dispatch("click", transferOpen);
    }

    afterUpdate(() => {
        // We need to be aware of updates just to update the content of the container if 
        // an account is added/removed
        userAccounts.onAccountsUpdated(() => {allAccounts=userAccounts.getAllAccounts()});
    });
</script>

<div bind:this={container} style="--transferbox-height:318px; --initial-height:{containerInitialHeight}" class="overall-container relative w-full">
    <div class="container-link opacity-30 mx-auto bg-white w-[2px]"></div>
    <div class="absolute position-0 flex items-center justify-center">
        <GradientButton on:click={buttonClicked} extraClasses="aspect-square w-10 p-2">
            <svg class="stroke-text" viewBox="0 0 24 24" fill="none">
                <g>
                    <path d="M20 10L4 10L9.5 4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    <path d="M4 14L20 14L14.5 20" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                </g>
            </svg>
        </GradientButton>
        <div bind:this={transferBox} class="transfer-box absolute left-44">
            <GlassContainer extraClasses="h-full w-64 p-4">
                {#if allAccounts.length >= 2}
                <form bind:this={form} on:submit={transferSubmit} class="validity-styles input-validation-required">
                    <sl-select name="giver-account" value={`${allAccounts[0].id}`} label="From">
                        <small>Spending accounts</small>
                        {#each userAccounts.getSpendingAccounts() as spendingAccount}
                        <sl-option value={spendingAccount.id}>{spendingAccount.getName()}</sl-option>
                        {/each}
                        <small>Saving accounts</small>
                        {#each userAccounts.getSavingAccounts() as savingAccount}
                        <sl-option value={savingAccount.id}>{savingAccount.getName()}</sl-option>
                        {/each}
                    </sl-select>
                    <sl-select name="receiver-account" value={`${allAccounts[1].id}`} label="To">
                        <small>Spending accounts</small>
                        {#each userAccounts.getSpendingAccounts() as spendingAccount}
                        <sl-option value={spendingAccount.id}>{spendingAccount.getName()}</sl-option>
                        {/each}
                        <small>Saving accounts</small>
                        {#each userAccounts.getSavingAccounts() as savingAccount}
                        <sl-option value={savingAccount.id}>{savingAccount.getName()}</sl-option>
                        {/each}
                    </sl-select>
                    <sl-input value={0} name="transfer-amount" required label="Amount" pattern="([0-9.,])+">
                        <span slot="prefix">{MoneyValue.currencyType}</span>
                    </sl-input>
                    <sl-button class="submit-button" type="submit" variant="primary">Submit</sl-button>
                </form>
                {:else}
                <div class="flex justify-center text-center items-center h-full">
                    <h1 class="text-lg text-text font-medium">You need at least two accounts to make a transfer 🗄️</h1>
                </div>
                {/if}
            </GlassContainer>
        </div>
    </div>
</div>

<style>
    @keyframes transfer-box-open {
        from {
            height: 0;
        }
        to {
            height: var(--transferbox-height);
        }
    }
    @keyframes transfer-box-close {
        from {
            height: var(--transferbox-height);
        }
        to {
            height: 0;
        }
    }

    @keyframes container-expand {
        from {
            height: var(--initial-height);
        }
        to {
            height: calc(var(--initial-height)/2 + var(--transferbox-height));
        }
    }
    @keyframes container-collapse {
        from {
            height: calc(var(--initial-height)/2 + var(--transferbox-height));
        }
        to {
            height: var(--initial-height);
        }
    }

    .transfer-box {
        overflow: hidden;
        height: fit-content;
    }

    .overall-container {
        height: var(--initial-height);
    }

    .overall-container > .container-link {
        height: var(--initial-height);
    }

    :global(.overall-container.collapsed) {
        animation: 200ms linear 0s container-collapse;
        animation-fill-mode: both;
    }

    :global(.overall-container.collapsed > .container-link) {
        animation: 200ms linear 0s container-collapse;
        animation-fill-mode: both;
    }

    :global(.overall-container.expanded) {
        animation: 200ms linear 0s container-expand;
        animation-fill-mode: both;
    }

    :global(.overall-container.expanded > .container-link) {
        animation: 200ms linear 0s container-expand;
        animation-fill-mode: both;
    }

    .transfer-box {
        height: 0;
    }

    :global(.transfer-box.open) {
        animation: 200ms linear 0s transfer-box-open;
        animation-fill-mode: both;
    }
    :global(.transfer-box.close) {
        animation: 200ms linear 0s transfer-box-close;
        animation-fill-mode: both;
    }
</style>
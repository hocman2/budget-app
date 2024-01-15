<script lang="ts">
    import AccountContainer from "./AccountContainer.svelte";
    import SpendingAccount from "../../../Models/SpendingAccount";
    import SavingAccount from "../../../Models/SavingAccount";
    import TransferButton from "../../Buttons/TransferButton.svelte";

    export let spendingAccounts: Array<SpendingAccount>;
    export let savingAccounts: Array<SavingAccount>;

    let transferButton: HTMLElement;

    let transferOpen = false;
    function buttonClicked()
    {
        transferOpen = !transferOpen;

        if (transferOpen)
        {
            transferButton.style.width = "50%";
        }
        else
        {
            setTimeout(() => transferButton.style.width = "auto", 150);
            
        }
    }
</script>

<div class="relative flex flex-col w-full">
    <AccountContainer type={SpendingAccount} sectionName="Spending accounts" accounts={spendingAccounts}></AccountContainer>
    <div bind:this={transferButton}>
        <TransferButton on:click={buttonClicked} containerInitialHeight="80px"></TransferButton>
    </div>
    <AccountContainer type={SavingAccount} sectionName="Savings" accounts={savingAccounts}></AccountContainer>
</div>
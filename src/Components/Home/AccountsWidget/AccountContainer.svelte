<script lang="ts">
    import GlassContainer from "../../GlassContainer.svelte";
    import '../../../app.css';

    import MoneyValue from "../../../Models/MoneyValue";
    import type { SlMenu } from "@shoelace-style/shoelace";
    import AccountModal from "../../Modals/AccountModal.svelte";
    import DeleteAccountModal from "../../Modals/DeleteAccountModal.svelte";
    import WidgetTitle from "../../WidgetTitle.svelte";
    import type Account from "../../../Models/Account";
    import { afterUpdate, tick } from "svelte";

    export let sectionName: string;
    export let accounts: Array<Account>;
    export let type: typeof Account;

    let createAccountModal: AccountModal;
    let editAccountModal: AccountModal;
    let deleteAccountModal: DeleteAccountModal;

    let contextMenu: SlMenu;
    let menuVisible: boolean = false;
    export let container: HTMLElement|undefined = undefined;

    function clickInContextMenu(element: Node)
    {
        if (!contextMenu) return false;

        return contextMenu.contains(element);
    }

    let firstClick = true;
    function widowClickEvent(e: Event)
    {
        // The click event is fired immediatly, this flag prevents it
        if (firstClick)
        {
            firstClick = false;
            return;
        }

        if (!e.target) return;
        
        if (!clickInContextMenu(e.target as Node))
        {
            toggleMenu();
        }
    }

    function toggleMenu()
    {
        menuVisible = !menuVisible;
        
        if (menuVisible)
        {
            contextMenu.classList.remove('hidden');
            firstClick = true;
            window.addEventListener("click", widowClickEvent);
        }
        else 
        {
            contextMenu.classList.add('hidden');
            window.removeEventListener("click", widowClickEvent);
        }
    }

</script>

<AccountModal type={type} accounts={accounts} bind:this={editAccountModal}></AccountModal>
<AccountModal type={type} bind:this={createAccountModal}></AccountModal>
<DeleteAccountModal bind:this={deleteAccountModal} accounts={accounts}></DeleteAccountModal>
<GlassContainer bind:container={container} extraClasses="p-4 min-w-fit">
    <div class="separator mb-4">
        <div class="flex justify-between gap-2 font-bold text-xl">
            <WidgetTitle margin={false}>{sectionName}</WidgetTitle>
            <div class="relative flex items-center">
                <span class="inline-block">{accounts.map((a) => { return a.getAmount() }).reduce((p, c) => { return new MoneyValue(p.value() + c.value()); }, new MoneyValue(0)).toString()}</span>
                <button on:click={toggleMenu} class="fill-text"><svg height="1.5rem" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path></svg></button>
                <sl-menu bind:this={contextMenu} class="hidden absolute z-20 left-[90%] top-[80%] rounded-lg">
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <sl-menu-item on:click={() => { toggleMenu(); createAccountModal.toggleOpen(); }} value="create">Create new account</sl-menu-item>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <sl-menu-item disabled={accounts.length === 0} on:click={() => { toggleMenu(); editAccountModal.toggleOpen(); }} value="edit">Edit account</sl-menu-item>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <sl-menu-item disabled={accounts.length === 0} on:click={() => { toggleMenu(); deleteAccountModal.toggleOpen(); }} value="delete">Delete account</sl-menu-item>
                </sl-menu>
            </div>
        </div>
    </div>
    <div class="flex flex-col opacity-75 gap-2 max-h-24 overflow-y-scroll no-scroll">
        {#if accounts.length === 0}
            <span class="text-sm">You haven't added any account yet.<br>Create a new account by clicking on the three dots above and start tracking your expenses</span>
        {/if}
        {#each accounts as account}
            <div class="flex justify-between">
                <span>{account.getName()}</span>
                <span class="font-mono">{account.getAmount().toString()}</span>
            </div>
        {/each}
    </div>
</GlassContainer>
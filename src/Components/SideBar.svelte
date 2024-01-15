<script lang="ts">
    import '../app.css';
    import MenuItem from './SideBar/MenuItem.svelte';
    import {IconNames} from './SideBar/menu-item-icon-names';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    type MenuItemDef = {
        iconName: IconNames,
        label: string,
        currentPage: boolean
        bottomMenu: boolean,
    };

    const menuItems: Array<MenuItemDef> = [
        {
            iconName: IconNames.Home,
            label: "Home",
            currentPage: true,
            bottomMenu: false,
        },
        {
            iconName: IconNames.Budgets,
            label: "Budgets",
            currentPage: false,
            bottomMenu: false,
        },
        {
            iconName: IconNames.Accounts,
            label: "Accounts & Transactions",
            currentPage: false,
            bottomMenu: false,
        },
        {
            iconName: IconNames.Charts,
            label: "Charts",
            currentPage: false,
            bottomMenu: false,
        },
        {
            iconName: IconNames.Profile,
            label: "Profile",
            currentPage: false,
            bottomMenu: true,
        },
        {
            iconName: IconNames.Settings,
            label: "Settings",
            currentPage: false,
            bottomMenu: true,
        }
    ];

    let selectedItem = 0;
    function itemClicked(e: CustomEvent) {
        let clicked = menuItems.findIndex((i) => { return i.label == e.detail.label; });

        menuItems[selectedItem].currentPage = false;
        menuItems[clicked].currentPage = true;
        selectedItem = clicked;

        dispatch("selectionUpdated", {newIndex: selectedItem});        
    }

    export let disabled: boolean = false;
</script>

<aside id="side-bar-container" class="z-20 px-8 py-12 bg-dark">
    <div class="flex flex-col justify-between mx-auto w-fit h-full">
        <nav class="flex flex-col gap-12">
            {#each menuItems.filter((i) => {return i.bottomMenu == false;}) as menuItem}
                <svelte:component this={MenuItem} disabled={disabled} on:click={itemClicked} iconName={menuItem.iconName} label={menuItem.label} currentPage={menuItem.currentPage}></svelte:component>
            {/each}
        </nav>
        <div class="flex flex-col w-full gap-8">
            {#each menuItems.filter((i) => {return i.bottomMenu == true;}) as menuItem}
                <svelte:component this={MenuItem} disabled={disabled} on:click={itemClicked} iconName={menuItem.iconName} label={menuItem.label} currentPage={menuItem.currentPage}></svelte:component>
            {/each}
        </div>
    </div>
</aside>

<style>
    #side-bar-container {
        box-shadow: 8px 4px 24px rgba(0, 0, 0, 0.25);
    }
</style>
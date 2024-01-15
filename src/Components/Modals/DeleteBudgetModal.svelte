<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type Budget from "../../Models/Budget";
    import { budgets } from "../../scripts/app-state";
    import WidgetTitle from "../WidgetTitle.svelte";
    import Modal from "./Modal.svelte";

    const dispatch = createEventDispatcher();

    let modal: Modal;
    export function toggleOpen() { modal.toggleOpen(); };
    
    export let budget: Budget|undefined;

    function deleteBudget()
    {
        if (budget)
        {
            const idx = budgets.indexOf(budget);
            budgets.splice(idx, 1);
        }

        toggleOpen();
    }
</script>
<Modal on:modalClosed={() => dispatch("modalClosed")} on:modalOpened={() => dispatch("modalOpened")} bind:this={modal}>
    <WidgetTitle>Are you sure you want to delete "{budget?.getName()}"</WidgetTitle>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <sl-button on:click={toggleOpen}>Cancel</sl-button>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <sl-button on:click={deleteBudget} variant="danger">Yes, delete</sl-button>
</Modal>
<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import GradientButton from "./GradientButton.svelte";
    import { SlTooltip } from "@shoelace-style/shoelace";

    export let extraClasses: string|undefined = undefined;

    const dispatch = createEventDispatcher();
    let tooltip: SlTooltip;

    let timeoutHandle: number = 0;
    export function triggerTooltip()
    {       
        // Open tooltip for 3 seconds or close if already open
        if (tooltip.open)
        {
            tooltip.open = false;
            clearTimeout(timeoutHandle);
        }
        else
        {
            tooltip.open = true;
            timeoutHandle = setTimeout(() => tooltip.open = false, 3000);
        }
    }
</script>

<sl-tooltip placement="bottom-start" content="You need at least one account to add a transaction" trigger="manual" bind:this={tooltip}>
    <GradientButton on:click={() => dispatch("click")} extraClasses={extraClasses}>
        <slot></slot>
    </GradientButton>
</sl-tooltip>
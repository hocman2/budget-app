<script lang="ts">
    import { createEventDispatcher } from "svelte";


    let dispatch = createEventDispatcher();

    /**
     * Add extra classes to the top most container.
     * extra classes don't override existing classes
     */
    export let extraClasses: string = "";
</script>

<button on:click={() => dispatch("click")} class="{extraClasses} relative">
    <slot></slot>
    <div class="button-appearance"></div>
</button>

<style>
    /** Must apply the button appearance to a separate div because of the mix-blend */
    .button-appearance {
        @apply absolute position-0 rounded-md bg-white bg-opacity-30 border-2 border-white border-opacity-50;
    }
</style>
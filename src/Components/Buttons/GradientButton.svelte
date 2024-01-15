<script lang="ts">
    import { createEventDispatcher } from "svelte";


    const dispatch = createEventDispatcher();

    /**
     * Add extra classes to the top most container.
     * extra classes don't override existing classes
     */
    export let extraClasses: string = "";


    function buttonClicked()
    {
        dispatch("click");
    }

</script>

<button on:click="{buttonClicked}" class="{extraClasses} purple-gradient border-box rounded-xl after:rounded-xl">
    <slot></slot>
</button>

<style>
    .purple-gradient {
        position: relative;
        --gradient: linear-gradient(115deg, #8A53D7 0%, #9F73DD 60%, #B696E3 100%);
        background: var(--gradient);
    }

    .purple-gradient::after {
        position: absolute;
        content: '';
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        border-width: 2px;
        background-color: transparent;
        border-color: rgba(255, 255, 255, 0.8);
        mix-blend-mode: overlay;
        opacity: 80%;
    }
</style>
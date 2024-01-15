<script lang="ts">
    import { onMount } from 'svelte';
    import '../app.css';

    /**
     * Add extra classes to the top most container.
     * extra classes don't override existing classes
     */
    export let extraClasses: string = "";
    export let container: HTMLElement|undefined = undefined;
</script>

<div bind:this={container} class="{extraClasses} glass-container text-text glare-line">
    <div class="appearance-container absolute position-0 pointer-events-none">
    </div>
    <slot></slot>
</div>

<style>
    .glare-line::after {
        content: '';
        position: absolute;
        mix-blend-mode: hard-light;
        left: 0;
        right: 0;
        bottom: calc(100% - 1px);
        height: 2px;
        background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.33) 50%, transparent);
    }

    .glass-container {
        position: relative;
    }

    .appearance-container {
        @apply bg-white bg-opacity-30 mix-blend-overlay border-2 border-white border-opacity-50 rounded-xl box-border shadow-[0_0_32px_0_rgba(255,255,255,0.3)_inset];
        
        /* Safari needs this to render mix blend */
        -webkit-transform: translate3d(0, 0, 0);
    }
</style>
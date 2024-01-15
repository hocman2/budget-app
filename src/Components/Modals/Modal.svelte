<script lang="ts">
    import { afterUpdate, createEventDispatcher } from "svelte";
    
    let dispatch = createEventDispatcher();

    let container: HTMLElement;

    let shown = false;
    let hasMounted = false;
    let triggerOpenEvent = false;

    export function toggleOpen()
    {
        shown = !shown;

        if (shown)
        {
            let main = document.querySelector("main")!;
            
            // prevent opening modal over another modal
            if (main.classList.contains("modal-open"))
            {
                shown = false;
                return;
            }

            main.classList.add("modal-open");
        }
        else
        {
            document.querySelector("main")!.classList.remove("modal-open");
        }

        triggerOpenEvent = true;
    }

    afterUpdate(() => {        
        // First afterUpdate() is called after onMount()
        if (!hasMounted) {
            hasMounted = true;
        }
        
        if (triggerOpenEvent)
        {
            
            triggerOpenEvent = false;
            
            if (shown) {
                let main = document.querySelector("main")!;
                container.style.left = main.getBoundingClientRect().left + "px";
                
                // Teleport to main
                main.appendChild(container);
                
                dispatch("modalOpened");
            }
            else {
                dispatch("modalClosed");
            }
        }
    })

</script>

{#if shown}
<div bind:this={container} class="fixed right-0 top-0 bottom-0 z-50 p-32 min-h-fit">
    <div class="relative modal-appearance w-full h-full p-4">
        <button on:click={toggleOpen} class="absolute right-4 top-4 text-3xl">&times;</button>
        <slot/>
    </div>
</div>
{/if}

<style>
    .modal-appearance {
        @apply relative box-border border-transparent bg-dark bg-opacity-20 backdrop-blur-xl rounded-xl z-10;

        --border: 2px;
        border-width: var(--border);
    }

    .modal-appearance:after
    {
        @apply rounded-xl;
        
        content: '';
        position: absolute;
        z-index: -1;
        top: calc(-1*var(--border));
        left: calc(-1*var(--border));
        right: calc(-1*var(--border));
        bottom: calc(-1*var(--border));
        border: var(--border) solid transparent;
        background: conic-gradient(from 80deg, transparent 0%, rgba(187,229,211,0.51) 15%, transparent 28%, transparent 49%, rgba(219,204,241,0.5) 66%, transparent 81%) border-box;
        -webkit-mask:
            linear-gradient(#fff 0 0) padding-box, 
            linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
                mask-composite: exclude;
    }
</style>
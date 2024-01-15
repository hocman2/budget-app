<script lang="ts">
    import { afterUpdate, onMount } from 'svelte';
    import '../../../app.css';
    import {ProgressColors} from './ProgressBar/progress-bar-colors';

    export let progress: number;
    export let color: ProgressColors;

    /// A preset height for the progress bar
    export let height: "small"|"large" = "small";

    // Some animation related values
    let randomDelay: number = Math.random() * 0.3; // (0s to 0.3s)
    let randomDuration: number = Math.random() * (1.2 - 0.8) + 0.8; // (0.8s to 1.2s)

    // The class applied to the overall container which determines the height of the bar
    let heightClass: string = "";
    // The overflow indicator might need to be bigger for thicker bars
    let overflowIndicatorHeightClass: string = "";

    if (height == "small")
    {
        heightClass = "h-5";
        overflowIndicatorHeightClass = "h-8";
    }
    else if (height == "large")
    {
        heightClass = "h-7";
        overflowIndicatorHeightClass = "h-10";
    }
    
    let container: HTMLElement;
    let bar: HTMLElement;
    
    function prepareOverflowIndicator(overflowIndicator: Element, setInstant: boolean = false)
    {
        let barRect = bar.getBoundingClientRect();

        if (!barRect) { return; }

        // First add some margin, we can also already position the indicator on the y axis
        let indicatorHeight = overflowIndicator.getBoundingClientRect().height;
        let topPosition = Math.round((indicatorHeight - barRect.height) / 2);

        // This small margin makes up for the height increase due to the overflow indicator which is an absolute elemnt
        container.style.marginBlock = `${topPosition}px`;

        let positionIndicator = () => {
            // Must be re-set to get updated values
            barRect = bar.getBoundingClientRect();
            let leftPosition = Math.round(barRect.width * 100 / progress);
            if (overflowIndicator)
            {
                overflowIndicator.classList.remove('opacity-0');
                overflowIndicator.setAttribute("style", `left: ${leftPosition}px; top: -${topPosition}px`);
            }
        }

        // When values are updated, the animations aren't played again, meaning animationend is never triggered
        if (setInstant)
        {
            positionIndicator();
        }
        else
        {
            // Wait for anim to end to position it on the x axis otherwise the indicator can be seen while
            // the bar is filling up
            bar?.addEventListener("animationend", () => positionIndicator(),{once: true});
        }

    }

    function displayOrHideOverflowIndicator()
    {
        let overflowIndicator = container.querySelector(".budget-overflow-indicator");
        container.classList.add(heightClass);
        overflowIndicator?.classList.add(overflowIndicatorHeightClass);
    
        if (overflowIndicator && color === ProgressColors.Error)
        {
            prepareOverflowIndicator(overflowIndicator, hasMounted);
        }
        else
        {
            overflowIndicator?.classList.add("opacity-0"); // Make sure the indicator is hidden
        }
    }

    let hasMounted = false;
    afterUpdate(() => {
        displayOrHideOverflowIndicator();

        if (!hasMounted) hasMounted = true;
    });
</script>

<div bind:this={container} style="--progress: {progress}%; --anim-delay: {randomDelay}s; --anim-duration: {randomDuration}s" class="relative rounded-full bg-dark w-full">
    <div bind:this={bar} class="absolute position-0 progress-bar {color} rounded-full"></div>
    <div class="absolute position-0 progress-bar {color} rounded-full opacity-50 blur-xl"></div>
    <div class="budget-overflow-indicator opacity-0 {ProgressColors.Error}"></div>
</div>

<style>

    @keyframes fill-bar {
        from {
            width: 0%;
        }
        to {
            width: var(--progress)
        }
    }

    .progress-bar {
        animation: var(--anim-duration) ease-out var(--anim-delay) fill-bar;
        animation-fill-mode: both;
        width: var(--progress);
        /* A bar can slightly overflow, arbitrarly defined as 28px might be adjusted */
        max-width: calc(100% + 28px);
    }

    @keyframes indicator-appear {
        from {
            transform: scaleY(0);
        }
        to {
            transform: scaleY(1);
        }
    }
    .budget-overflow-indicator {
        @apply absolute w-[2px];
        animation: 300ms ease-out calc(var(--anim-delay) + var(--anim-duration)) indicator-appear;
    }
</style>
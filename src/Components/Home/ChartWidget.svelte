<script lang="ts">
    import { afterUpdate, beforeUpdate, onMount } from "svelte";
    import { type Arc, computeCircleArc } from "../../scripts/circle-path";
    import PieChartHoverCheck from "../../scripts/pie-chart-hover-check";
    import GlassContainer from "../GlassContainer.svelte";
    import type Budget from "../../Models/Budget";
    import { currentTimePeriod } from "../../scripts/app-state";
    import WidgetTitle from "../WidgetTitle.svelte";

    // For convenience later down
    type ArcPath = {
        arc: Arc,
        path: string,
    }

    // We could use dynamic strings for this but if tailwind doesn't see full class names
    // it doesn't compile them
    const chartColors = [
        "stroke-chart-1",
        "stroke-chart-2",
        "stroke-chart-3",
        "stroke-chart-4",
        "stroke-chart-5",
        "stroke-chart-6",
        "stroke-chart-7",
        "stroke-chart-8",
        "stroke-chart-9",
        "stroke-chart-10"
    ];
    const circleRadius = 38;
    const strokeWidth = 18;
    const viewboxSize = 100;

    // We'll use this object to determine where the mouse is on the chart
    let hoverCheck = new PieChartHoverCheck(circleRadius, strokeWidth);
    let hoveredBudget: Budget|undefined = undefined;
    export let budgets: Array<Budget> = [];
    let container: HTMLElement;
    let paths: Array<ArcPath> = [];
    // Whenever a section is hovered, we'll update the hovered budget
    hoverCheck.onSectionHovered((e) => {
        //paths indices, svg indices and budget indices always match by logic
        hoveredBudget = budgets[e.index];
        e.svg.style.transform = "scale(1.05)";
    });

    hoverCheck.onSectionStopHover((e) => {
        e.svg.style.transform = "";
    });

    let updateSvgNext = false;
    function drawGraph()
    {
        budgets.forEach((b) => b.calculateCurrentSpent(currentTimePeriod));
        
        // Calculate the budget spends as percent of total spent
        paths = generatePathsCommands(calculateBudgetPercents());

        // We must wait for the next render to have the SVG elements available
        updateSvgNext = true;
    }

    let mounted = false;
    beforeUpdate(() => {
        if (!mounted) {
            mounted = true;
            drawGraph();
            currentTimePeriod.onTransactionsUpdated(() => drawGraph());
        }
    });

    afterUpdate(() => {
        if (updateSvgNext)
        {
            // This gets called only when drawGraph() has been called previously.
            updateSvgNext = false;
            hoverCheck.clear();
            prepareSvgs();
        }
    });
        
    function prepareSvgs()
    {
        let svgs = container.querySelectorAll("svg");
        if (svgs.length > paths.length)
        {
            // remove clones if they exist
            for (let i = svgs.length - paths.length; i < svgs.length; ++i)
            {
                svgs[i].remove();
            }
        }

        // Create a clone and add the path to the hover checking object
        for (let i = 0; i < paths.length; ++i) {
            hoverCheck.addSvg({svg: svgs[i], arc: paths[i].arc});

            // Here we clone each svg element and blur the clone to give it a glow effect
            let clone = <HTMLElement>(svgs[i].cloneNode(true));
            clone.classList.add("blur-md", "opacity-50", "pointer-events-none");
            container.appendChild(clone);
        }
    }

    function calculateBudgetPercents(): Array<number> 
    {
        // We first need to know what the total spent is
        let totalSum = 0;
        budgets.map((budget) => { totalSum += budget.getCurrentSpent().value(); });

        if (totalSum === 0) return [];

        // Maybe there's an algorithm that avoids having to call map twice
        return budgets.map((budget) => { return budget.getCurrentSpent().value() * 100 / totalSum });
    }

    function generatePathsCommands(percentValues: Array<number>): Array<ArcPath>
    {
        let paths: Array<ArcPath> = [];
        let previousAngle = 0;
        let maxAngle = Math.PI * 2.0;
        for (let value of percentValues) {
            let start = previousAngle;
            let sweep = maxAngle * (value / 100);
            
            let arc: Arc = {offsetAngle: start, sweepAngle: sweep};

            // We need to save the arc to pass to the hover checking object
            paths.push({arc, path:computeCircleArc(viewboxSize, circleRadius, arc)});
            
            // Built clockwise so we subtract
            previousAngle = start + sweep;
        }
        return paths;
    }
</script>

<GlassContainer extraClasses="p-8 h-fit">
    <div class="flex justify-between">
        <div class="flex flex-col justify-between w-48">
            {#if hoveredBudget}
                <WidgetTitle>{hoveredBudget.getName()}</WidgetTitle>
                <div>
                    <span class="block font-medium">{`${hoveredBudget.calculateRemainingSpend().toString()} remaining`}</span>
                    <span class="block font-medium">{`${hoveredBudget.calculatePctValue().toFixed(2)}% spent`}</span>
                </div>
            {:else}
                <WidgetTitle>Hovered budget</WidgetTitle>
                <div>
                    <span class="block font-medium">hover over a section to display information</span>
                </div>
            {/if}
            <empty></empty>
        </div>
        <div bind:this={container} style="stroke-width: {strokeWidth}px;" class="relative w-64 aspect-square">
            {#each paths as path, i}
                <svg class="absolute position-0 {chartColors[i % 10]} transition-transform duration-300" viewBox="0 0 {viewboxSize} {viewboxSize}">
                    <path fill="none" d={path.path}></path>
                </svg>
            {/each}
        </div>
    </div>
</GlassContainer>
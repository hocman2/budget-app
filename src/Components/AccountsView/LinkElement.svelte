<script lang="ts">

    export let linkColorClass: string;
    export let arrowColorClass: string;
    export let numArrows: number = 1;
    export let direction: "horizontal"|"vertical";

    let container: HTMLElement;

    export function positionLine(originContainer: HTMLElement, destinationContainer: HTMLElement)
    {
        let link: HTMLElement = container.querySelector(":first-child")!;
        let arrows: HTMLElement = container.querySelector(":last-child")!;

        let main = document.querySelector("main")!
        let mainRect = main.getBoundingClientRect();
        let originRect = originContainer.getBoundingClientRect();
        let destinationRect = destinationContainer.getBoundingClientRect();

        if (direction === "horizontal")
        {
            let width = destinationRect.left - originRect.right;

            link.style.width = width+"px";
            arrows.style.width = width+"px";
            container.style.left = (originRect.right - mainRect.x) + "px";
            container.style.top = (originRect.top + originRect.height / 2 + main.scrollTop) + "px";
        }
        else
        {
            let height = destinationRect.top - originRect.bottom
            link.style.height = height+"px";
            arrows.style.height = height+"px";
            container.style.left = (originRect.left + originRect.width / 2 - mainRect.x) + "px";
            container.style.top = (originRect.bottom + main.scrollTop) + "px";
        }
    }
</script>

<div bind:this={container} class="absolute flex items-center justify-center">
    <div class="absolute {(direction === "vertical") ? "top-[100%]" : "left-[100%]"} opacity-30 mx-auto {linkColorClass} {(direction === "horizontal") ? "h-[2px] my-auto" : "w-[2px] mx-auto"}"></div>
    <div class="absolute {(direction === "vertical") ? "top-[100%]" : "left-[100%]"} flex {(direction === "vertical") ? "flex-col" : ""} justify-center opacity-100 {arrowColorClass} {(direction === "horizontal") ? "-rotate-90" : ""}">
        {#each Array.from({length: numArrows}, () => [0]) as _}
        <svg class="h-6 w-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z"></path>
        </svg>
        {/each}
    </div>
</div>


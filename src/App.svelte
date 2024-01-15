<script lang="ts">
  import './app.css';
  import { onMount, type ComponentType } from "svelte";
  import { rotateEllipses, type AnimInfo, type ElementsInfo } from "./scripts/ellipse-control";

  import SideBar from "./Components/SideBar.svelte";
  import Home from './Components/Pages/Home.svelte';
  import BudgetsView from './Components/Pages/BudgetsView.svelte';
  import AccountsView from './Components/Pages/AccountsView.svelte';

  let greenEllipse:Element;
  let purpleEllipse:Element;
  let contentArea: HTMLElement;
  let sideBarDisabled: boolean = false;

  // Disables or enables the sidebar when a modal is open
  const modalOpenObserver = new MutationObserver((mutationList, observer) => {
    for (let mutation of mutationList)
    {
      if (mutation.type === "attributes" && mutation.attributeName === "class")
      {
        if (contentArea.className.includes("modal-open"))
        {
          sideBarDisabled = true;
        }
        else
        {
          sideBarDisabled = false;
        }
      }
    }
  });

  // The different pages that can be accessed through the sidebar
  type Page = {
    component: ComponentType,
    sideBarIndex: number,
  }
  const pages: Array<Page> = [
    {
      component: Home,
      sideBarIndex: 0,
    },
    {
      component: BudgetsView,
      sideBarIndex: 1,
    },
    {
      component: AccountsView,
      sideBarIndex: 2,
    },
  ]

  const animInfos: Array<AnimInfo> = [
    {
      toAngle: 40,
      toDistance: 500,
      timeSecs: .75,
    },
    {
      toAngle: 60,
      toDistance: 100,
      timeSecs: .75,
    },
    {
      toAngle: 140,
      toDistance: 400,
      timeSecs: .75,
    },
  ];

  let rotationElements: ElementsInfo|undefined = undefined;

  function getPageIndex(sideBarIndex: number)
  {
    return pages.findIndex((page) => page.sideBarIndex === sideBarIndex);
  }

  // Holds which component is currently selected
  let selectedItem: ComponentType = pages[getPageIndex(0)]!.component;

  // Update the selected item when an item of the sidebar is clicked
  function sidebarItemClicked(e: CustomEvent)
  {
    let pageIndex = getPageIndex(e.detail.newIndex);
    rotateEllipses(rotationElements!, animInfos[pageIndex]);
    selectedItem = pages.find((i) => {return i.sideBarIndex === e.detail.newIndex})!.component;
  }

  onMount(() => {
    modalOpenObserver.observe(contentArea, {attributes: true});
    rotationElements = {greenEllipse, purpleEllipse, container: document.querySelector("main")!}
    rotateEllipses(rotationElements, animInfos[0]);
  });
</script>

<div bind:this={greenEllipse} id="bg-green-ellipse" class="fixed w-[1420px] h-[600px]">
  <img src="assets/green-ellipse.png" alt="">
</div>
<div bind:this={purpleEllipse} id="bg-purple-ellipse" class="fixed w-[1420px] h-[600px]">
  <img src="assets/purple-ellipse.png" alt="">
</div>

<div class="flex h-[100vh]">  
  <SideBar disabled={sideBarDisabled} on:selectionUpdated={sidebarItemClicked}></SideBar>
  <main bind:this={contentArea} class="relative flex-grow-[9] px-12 py-8 min-w-[700px]">
    <svelte:component this={selectedItem}></svelte:component>
  </main>
</div>

<style>
  :global(main.modal-open) {
    overflow-y: hidden;
  }

  :global(main:not(.modal-open)) {
    overflow-y:scroll;
  }
</style>
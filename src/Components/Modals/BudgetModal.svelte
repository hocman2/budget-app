<script lang="ts">
    import WidgetTitle from "../WidgetTitle.svelte";
    import Modal from "./Modal.svelte";
    import { Categories, budgets, currentTimePeriod, today } from "../../scripts/app-state";
    import Budget from "../../Models/Budget";
    import MoneyValue from "../../Models/MoneyValue";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    let modal: Modal;
    export function toggleOpen() { modal.toggleOpen(); }
    // Potential budget to edit
    export let budget: Budget | undefined = undefined; 

    let form: HTMLFormElement;

    function formSubmit(e: SubmitEvent)
    {
        e.preventDefault(); // no submit
        if (!form.checkValidity()) return;

        let data = new FormData(form);

        let categoriesKeysValues = data.getAll('categories-keys');
        let maxValue = data.get('budget-max')!.toString();
        let nameValue = data.get('budget-name')!.toString();
        let getCategoriesValues = () => categoriesKeysValues.map((k) => (Categories as any)[k.toString()]);

        if (budget)
        {
            budget.changeData(nameValue, new MoneyValue(Number.parseFloat(maxValue)), getCategoriesValues());
            budget.calculateCurrentSpent(currentTimePeriod);
        }
        else
        {
            let newBudget = new Budget(
                nameValue,
                new MoneyValue(Number.parseFloat(maxValue)),
                1, 
                getCategoriesValues());
    
            budgets.push(newBudget);
            newBudget.calculateCurrentSpent(currentTimePeriod);
        }

        toggleOpen();
    }

    function modalOpened() {
        dispatch("modalOpened");
    };

    function getBudgetName(): string
    {
        return (budget) ? budget.getName() : "";
    }
    function getBudgetMax(): string
    {
        return (budget) ? budget.getMax().value().toString() : "";
    }
    function getBudgetCategories(): string
    {
        return (budget) ? budget.getCategories().map((cat) => Categories.getIdentifier(cat)!).join(" ") : "";
    }
</script>

<Modal on:modalOpened={modalOpened} on:modalClosed={() => dispatch("modalClosed")} bind:this={modal}>
    {#if budget !== undefined}
    <WidgetTitle>Edit budget</WidgetTitle>
    {:else}
    <WidgetTitle>Create new budget</WidgetTitle>
    {/if}
    <form bind:this={form} on:submit={formSubmit} class="validity-styles input-validation-required">
        <sl-input required value={getBudgetName()} name="budget-name" label="Budget name"></sl-input>
        <sl-input required value={getBudgetMax()} placeholder="0" name="budget-max" label="Maximum allocated" pattern="([0-9.,])+">
            <span slot="prefix">{MoneyValue.currencyType}</span>
        </sl-input>          
        <sl-select value={getBudgetCategories()} name="categories-keys" label="categories" multiple clearable>
            {#each Categories.getAllIdentifiers() as identifier}
                <sl-option value={identifier}>{Categories.getCategory(identifier)?.label}</sl-option>
            {/each}
        </sl-select>
        <sl-button class="submit-button" type="submit" variant="primary">Submit</sl-button>
    </form>
</Modal>
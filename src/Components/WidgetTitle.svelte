<script lang="ts">
    export let margin: boolean = true;
</script>

<h1 class="text-xl font-semibold {(margin) ? 'mb-4' : ''}"><slot></slot></h1>

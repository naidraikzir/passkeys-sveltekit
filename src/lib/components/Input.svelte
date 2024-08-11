<script lang="ts">
	let { value = $bindable(), ...props } = $props();
</script>

<input class="px-4 py-2 border rounded" bind:value {...props} />

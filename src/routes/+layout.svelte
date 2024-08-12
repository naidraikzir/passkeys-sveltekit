<script lang="ts">
	import '$lib/index.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>Passkeys SvelteKit</title>
</svelte:head>

<div class="container mx-auto px-4">
	{@render children()}
</div>

<script lang="ts">
	import '$lib/index.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>Passkeys SvelteKit</title>
</svelte:head>

{@render children()}

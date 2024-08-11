<script lang="ts">
	import type { Snippet } from 'svelte';
	import type {
		HTMLButtonAttributes,
		MouseEventHandler
	} from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';

	interface Props extends HTMLButtonAttributes {
		children: Snippet<[]>;
		onclick?: MouseEventHandler<HTMLButtonElement>;
	}

	let { children, class: className = '', ...props }: Props = $props();
</script>

<button
	class={twMerge(
		'px-4 py-2 border rounded transition hover:opacity-85',
		className
	)}
	{...props}
>
	{@render children()}
</button>

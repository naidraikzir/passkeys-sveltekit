<script lang="ts">
	import { browser } from '$app/environment';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';

	type Props = {
		onSwitchForm: () => void;
	};

	let { onSwitchForm }: Props = $props();
	let username = $state('');

	function loginWithPasskeys() {}

	function login(event: SubmitEvent) {
		event.preventDefault();
	}
</script>

<form
	onsubmit={login}
	class="w-full max-w-96 mx-auto p-6 flex flex-col gap-4 rounded-lg shadow-xl bg-white"
>
	<h4 class="text-2xl font-semibold">Login</h4>
	<Input
		type="text"
		name="username"
		placeholder="Username"
		autocomplete="username webauthn"
		bind:value={username}
		required
	/>
	<Button type="submit" class="bg-blue-500 border-blue-500 text-white">
		Login
	</Button>
	<button type="button" class="text-blue-500 self-end" onclick={onSwitchForm}>
		Don't have an account?
	</button>
	{#if browser}
		{#await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable() then passkeysSupported}
			{#if passkeysSupported}
				<hr class="my-2" />
				<Button type="button" onclick={loginWithPasskeys}>
					🔐 Login with a passkey
				</Button>
			{/if}
		{/await}
	{/if}
</form>

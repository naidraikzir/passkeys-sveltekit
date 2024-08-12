<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import { startAuthentication } from '@simplewebauthn/browser';

	type Props = {
		onSwitchForm: () => void;
	};

	let { onSwitchForm }: Props = $props();
	let username = $state('');
	let error = $state('');

	async function loginWithPasskeys() {
		const resp = await fetch('/authentication/generate-options');
		let asseResp;
		try {
			const opts = await resp.json();
			asseResp = await startAuthentication(opts);
		} catch (err) {
			error = err as string;
			return;
		}

		const verificationResp = await fetch('/authentication/verify', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(asseResp)
		});

		const verificationJSON = await verificationResp.json();

		if (verificationJSON && verificationJSON.verified) {
			alert(`User authenticated!`);
			goto('/dashboard');
		} else {
			error = `Oh no, something went wrong! Response: <pre>${JSON.stringify(
				verificationJSON
			)}</pre>`;
		}
	}

	function login(event: SubmitEvent) {
		event.preventDefault();
		alert(`User authenticated!`);
		goto('/dashboard');
	}
</script>

<form
	onsubmit={login}
	class="w-full max-w-96 mx-auto p-6 flex flex-col gap-4 rounded-lg shadow-xl bg-white"
>
	<h4 class="text-2xl font-semibold">Login</h4>
	{#if browser}
		{#await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable() then passkeysSupported}
			{#if passkeysSupported}
				<Button type="button" onclick={loginWithPasskeys}>
					🔐 Login with a passkey
				</Button>
			{:else}
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
			{/if}
		{/await}
	{/if}
	<div class="text-red-500">{error}</div>
	<button type="button" class="text-blue-500 self-end" onclick={onSwitchForm}>
		Don't have an account?
	</button>
</form>

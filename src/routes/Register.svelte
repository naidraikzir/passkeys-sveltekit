<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import { startRegistration } from '@simplewebauthn/browser';

	type Props = {
		onSwitchForm: () => void;
	};

	let { onSwitchForm }: Props = $props();
	let username = $state('');
	let error = $state('');

	async function register(event: SubmitEvent) {
		event.preventDefault();
		const resp = await fetch('/generate-registration-options', {
			method: 'POST',
			body: JSON.stringify({
				username: username
			})
		});

		let attResp;
		try {
			const opts = await resp.json();
			attResp = await startRegistration(opts);
		} catch (err) {
			console.error(err);
			error = error as string;
			return;
		}

		const verificationResp = await fetch('/verify-registration', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username,
				authenticator: attResp
			})
		});

		const verificationJSON = await verificationResp.json();

		if (verificationJSON && verificationJSON.verified) {
			error = '';
			alert('Authenticator registered!');
			onSwitchForm();
		} else {
			error = `Oh no, something went wrong! Response: <pre>${JSON.stringify(
				verificationJSON
			)}</pre>`;
		}
	}
</script>

<form
	onsubmit={register}
	class="w-full max-w-96 mx-auto p-6 flex flex-col gap-4 rounded-lg shadow-xl bg-white"
>
	<h4 class="text-2xl font-semibold">Register</h4>
	<Input
		type="text"
		name="username"
		placeholder="Username"
		autocomplete="username webauthn"
		bind:value={username}
		required
	/>
	<Button type="submit" class="bg-blue-500 border-blue-500 text-white">
		Register
	</Button>
	<div class="text-red-500">{error}</div>
	<button type="button" class="text-blue-500 self-end" onclick={onSwitchForm}>
		Already have an account?
	</button>
</form>

<script lang="ts">
	import { browser } from '$app/environment';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';

	type FormType = 'login' | 'register';

	let formType = $state<FormType>('login');
	let loginUsername = $state('');
	let registerUsername = $state('');

	function switchForm() {
		formType = formType === 'login' ? 'register' : 'login';
	}

	function loginWithPasskeys() {}

	function login(event: SubmitEvent) {
		event.preventDefault();
	}

	function register(event: SubmitEvent) {
		event.preventDefault();
	}
</script>

<div class="container mx-auto px-4 h-screen flex flex-col justify-center">
	<form
		onsubmit={formType === 'login' ? login : register}
		class="w-full max-w-96 mx-auto p-6 flex flex-col gap-4 rounded-lg shadow-xl bg-white"
	>
		{#if formType === 'login'}
			<h4 class="text-2xl font-semibold">Login</h4>
			<Input
				type="text"
				name="username"
				placeholder="Username"
				autocomplete="username webauthn"
				bind:value={loginUsername}
				required
			/>
			<Button type="submit" class="bg-blue-500 border-blue-500 text-white">
				Login
			</Button>
			<button type="button" class="text-blue-500 self-end" onclick={switchForm}>
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
		{:else}
			<h4 class="text-2xl font-semibold">Register</h4>
			<Input
				type="text"
				name="username"
				placeholder="Username"
				autocomplete="username webauthn"
				bind:value={registerUsername}
				required
			/>
			<Button type="submit" class="bg-blue-500 border-blue-500 text-white">
				Register
			</Button>
			<button type="button" class="text-blue-500 self-end" onclick={switchForm}>
				Already have an account?
			</button>
		{/if}
	</form>
</div>

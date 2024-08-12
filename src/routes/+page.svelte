<script lang="ts">
	import Login from './Login.svelte';
	import Register from './Register.svelte';

	type FormType = 'login' | 'register';

	let formType = $state<FormType>('login');

	function onSwitchForm() {
		formType = formType === 'login' ? 'register' : 'login';
	}
</script>

<div class="h-screen flex flex-col justify-center">
	{#if formType === 'login'}
		<Login {onSwitchForm} />
	{:else}
		<Register {onSwitchForm} />
	{/if}
</div>

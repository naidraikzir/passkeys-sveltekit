<script lang="ts">
	let { data } = $props();
</script>

<div class="max-w-screen-md mx-auto flex flex-col gap-4 py-4">
	<div class="flex items-center justify-between">
		<h2 class="text-2xl">Dashboard</h2>
		<a href="/">Logout 🫱🏽</a>
	</div>

	<div class="h-96 flex flex-col justify-center items-center text-3xl">
		Oi, {data.username}!
	</div>
</div>

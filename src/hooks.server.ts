import type { Handle } from '@sveltejs/kit';
import { sveltekitSessionHandle } from 'svelte-kit-sessions';
import { env } from '$env/dynamic/private';

export const handle: Handle = sveltekitSessionHandle({
	secret: env.SECRET
});

// See https://kit.svelte.dev/docs/types#app

import type { User } from '$lib/types';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session?: SessionData;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module 'svelte-kit-sessions' {
	interface SessionData {
		user: User;
		challenge?: string;
	}
}

export {};

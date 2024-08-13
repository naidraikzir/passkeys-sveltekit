import {
	generateRegistrationOptions,
	type GenerateRegistrationOptionsOpts
} from '@simplewebauthn/server';
import { json } from '@sveltejs/kit';

import { rpID } from '$lib/server';
import type { User } from '$lib/types.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
	const { session } = locals;
	const { username } = await request.json();
	const user: User = {
		id: username,
		username,
		devices: []
	};

	const opts: GenerateRegistrationOptionsOpts = {
		rpName: 'Passkeys SvelteKit',
		rpID,
		userName: username,
		timeout: 60_000,
		attestationType: 'none',
		/**
		 * Passing in a user's list of already-registered authenticator IDs here prevents users from
		 * registering the same device multiple times. The authenticator will simply throw an error in
		 * the browser if it's asked to perform registration when one of these ID's already resides
		 * on it.
		 */
		excludeCredentials: user?.devices
			? user.devices.map((dev) => ({
					id: dev.credentialID,
					type: 'public-key',
					transports: dev.transports
				}))
			: [],
		authenticatorSelection: {
			residentKey: 'discouraged',
			/**
			 * Wondering why user verification isn't required? See here:
			 *
			 * https://passkeys.dev/docs/use-cases/bootstrapping/#a-note-about-user-verification
			 */
			userVerification: 'preferred'
		},
		/**
		 * Support the two most common algorithms: ES256, and RS256
		 */
		supportedAlgorithmIDs: [-7, -257]
	};

	const options = await generateRegistrationOptions(opts);

	/**
	 * The server needs to temporarily remember this value for verification, so don't lose it until
	 * after you verify an authenticator response.
	 */
	await session.setData({
		user,
		challenge: options.challenge
	});
	await session.save();

	return json(options);
}

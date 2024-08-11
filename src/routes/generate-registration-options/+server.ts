import {
	generateRegistrationOptions,
	type GenerateRegistrationOptionsOpts
} from '@simplewebauthn/server';
import { json } from '@sveltejs/kit';

import { inMemoryUserDeviceDB, loggedInUserId, rpID } from '$lib/server/index';

/** @type {import('./$types').RequestHandler} */
export async function GET({ locals }) {
	const { session } = locals;
	const user = inMemoryUserDeviceDB[loggedInUserId];

	const {
		/**
		 * The username can be a human-readable name, email, etc... as it is intended only for display.
		 */
		username,
		devices
	} = user;

	const opts: GenerateRegistrationOptionsOpts = {
		rpName: 'SimpleWebAuthn Example',
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
		excludeCredentials: devices.map((dev) => ({
			id: dev.credentialID,
			type: 'public-key',
			transports: dev.transports
		})),
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
	await session.setData({ challenge: options.challenge });
	await session.save();

	return json(options);
}

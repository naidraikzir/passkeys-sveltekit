import {
	generateAuthenticationOptions,
	type GenerateAuthenticationOptionsOpts
} from '@simplewebauthn/server';
import type { AuthenticatorDevice } from '@simplewebauthn/types';
import { json } from '@sveltejs/kit';

import { rpID } from '$lib/server';

/** @type {import('./$types').RequestHandler} */
export async function GET({ locals }) {
	const { session } = locals;
	const { user } = session.data;

	const opts: GenerateAuthenticationOptionsOpts = {
		timeout: 60_000,
		allowCredentials: user?.devices.map((dev: AuthenticatorDevice) => ({
			id: dev.credentialID,
			type: 'public-key',
			transports: dev.transports
		})),
		/**
		 * Wondering why user verification isn't required? See here:
		 *
		 * https://passkeys.dev/docs/use-cases/bootstrapping/#a-note-about-user-verification
		 */
		userVerification: 'preferred',
		rpID
	};

	const options = await generateAuthenticationOptions(opts);

	/**
	 * The server needs to temporarily remember this value for verification, so don't lose it until
	 * after you verify an authenticator response.
	 */
	await session.setData({ user, challenge: options.challenge });
	await session.save();

	return json(options);
}

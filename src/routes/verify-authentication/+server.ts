import {
	verifyAuthenticationResponse,
	type VerifiedAuthenticationResponse,
	type VerifyAuthenticationResponseOpts
} from '@simplewebauthn/server';
import type { AuthenticationResponseJSON } from '@simplewebauthn/types';
import { error, json } from '@sveltejs/kit';

import { rpID, expectedOrigin } from '$lib/server';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
	const { session } = locals;
	const { user, challenge } = session.data;
	const body: AuthenticationResponseJSON = await request.json();

	const expectedChallenge = challenge;

	let dbAuthenticator;
	// "Query the DB" here for an authenticator matching `credentialID`
	if (user?.devices) {
		for (const dev of user.devices) {
			if (dev.credentialID === body.id) {
				dbAuthenticator = dev;
				break;
			}
		}
	}

	if (!dbAuthenticator) {
		return error(400, {
			message: 'Authenticator is not registered with this site'
		});
	}

	let verification: VerifiedAuthenticationResponse;
	try {
		const opts: VerifyAuthenticationResponseOpts = {
			response: body,
			expectedChallenge: `${expectedChallenge}`,
			expectedOrigin,
			expectedRPID: rpID,
			authenticator: {
				...dbAuthenticator,
				credentialPublicKey: new Uint8Array(
					Object.values(dbAuthenticator.credentialPublicKey)
				)
			},
			requireUserVerification: false
		};
		verification = await verifyAuthenticationResponse(opts);
	} catch (err) {
		const _error = err as Error;
		console.error(_error);
		return error(400, {
			message: _error.message
		});
	}

	const { verified, authenticationInfo } = verification;

	if (verified) {
		// Update the authenticator's counter in the DB to the newest count in the authentication
		dbAuthenticator.counter = authenticationInfo.newCounter;
	}

	await session.setData({ user, challenge: undefined });
	await session.save();

	return json({ verified });
}

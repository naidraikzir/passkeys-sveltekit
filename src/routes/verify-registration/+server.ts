import {
	verifyRegistrationResponse,
	type VerifiedRegistrationResponse,
	type VerifyRegistrationResponseOpts
} from '@simplewebauthn/server';
import type {
	AuthenticatorDevice,
	RegistrationResponseJSON
} from '@simplewebauthn/types';
import { json } from '@sveltejs/kit';

import { rpID, expectedOrigin } from '$lib/server/index';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
	const { session } = locals;
	const {
		authenticator
	}: {
		authenticator: RegistrationResponseJSON;
	} = await request.json();
	const user = session.data.user;
	const expectedChallenge = session.data.challenge;

	let verification: VerifiedRegistrationResponse;
	try {
		const opts: VerifyRegistrationResponseOpts = {
			response: authenticator,
			expectedChallenge: `${expectedChallenge}`,
			expectedOrigin,
			expectedRPID: rpID,
			requireUserVerification: false
		};
		verification = await verifyRegistrationResponse(opts);
	} catch (error) {
		const _error = error as Error;
		console.error(_error);
		return json({ error: _error.message });
	}

	const { verified, registrationInfo } = verification;

	if (verified && registrationInfo) {
		const { credentialPublicKey, credentialID, counter } = registrationInfo;

		const existingDevice = user?.devices.find(
			(device: AuthenticatorDevice) => device.credentialID === credentialID
		);

		if (!existingDevice) {
			/**
			 * Add the returned device to the user's list of devices
			 */
			const newDevice: AuthenticatorDevice = {
				credentialPublicKey,
				credentialID,
				counter,
				transports: authenticator.response.transports
			};
			user?.devices.push(newDevice);
		}
	}

	await session.setData({ user, challenge: undefined });
	await session.save();

	return json({ verified });
}

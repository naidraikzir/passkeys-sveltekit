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

import {
	inMemoryUserDeviceDB,
	loggedInUserId,
	rpID,
	expectedOrigin
} from '$lib/server/index';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
	const { session } = locals;
	const body: RegistrationResponseJSON = await request.json();
	const user = inMemoryUserDeviceDB[loggedInUserId];
	const expectedChallenge = session.data.challenge;

	let verification: VerifiedRegistrationResponse;
	try {
		const opts: VerifyRegistrationResponseOpts = {
			response: body,
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

		const existingDevice = user.devices.find(
			(device) => device.credentialID === credentialID
		);

		if (!existingDevice) {
			/**
			 * Add the returned device to the user's list of devices
			 */
			const newDevice: AuthenticatorDevice = {
				credentialPublicKey,
				credentialID,
				counter,
				transports: body.response.transports
			};
			user.devices.push(newDevice);
		}
	}

	await session.setData({ challenge: undefined });

	return json({ verified });
}

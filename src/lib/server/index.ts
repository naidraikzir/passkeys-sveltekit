import { env } from '$env/dynamic/private';

export const loggedInUserId = 'internalUserId';

export const rpID = env.EXPECTED_ORIGIN ? env.EXPECTED_ORIGIN : 'localhost';

export const expectedOrigin = import.meta.env.PROD
	? `https://${rpID}`
	: `http://${rpID}:5173`;

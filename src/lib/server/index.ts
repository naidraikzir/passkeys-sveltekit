import type { AuthenticatorDevice } from '@simplewebauthn/types';
import { env } from '$env/dynamic/private';

interface LoggedInUser {
	id: string;
	username: string;
	devices: AuthenticatorDevice[];
}

export const loggedInUserId = 'internalUserId';

export const rpID = env.EXPECTED_ORIGIN ? env.EXPECTED_ORIGIN : 'localhost';

export const inMemoryUserDeviceDB: { [loggedInUserId: string]: LoggedInUser } =
	{
		[loggedInUserId]: {
			id: loggedInUserId,
			username: `user@${rpID}`,
			devices: []
		}
	};

export const expectedOrigin = import.meta.env.PROD
	? `https://${rpID}`
	: `http://${rpID}:5173`;

import type { AuthenticatorDevice } from '@simplewebauthn/types';

export interface User {
	id: string;
	username: string;
	devices: AuthenticatorDevice[];
}

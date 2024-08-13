/** @type {import('./$types').PageServerLoad} */
export function load({ locals }) {
	const { session } = locals;
	return {
		username: session.data.user?.username as string
	};
}

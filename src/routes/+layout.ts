import { getRunCount } from '$lib/db';
import type { LayoutLoad } from './$types';


export const load = (async () => {
    const count = await getRunCount();
    return {count: count.results[0].response.result.rows[0][0].value};
}) satisfies LayoutLoad;
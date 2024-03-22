import { loadFlash } from 'sveltekit-flash-message/server';

export const load = loadFlash(async (event) => {
    return {
        props: {
            user: event.locals.user,
            session: event.locals.session
        }
    }
})
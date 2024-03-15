export async function load(event) {
    return {
        props: {
            user: event.locals.user,
            session: event.locals.session
        }
    }
}
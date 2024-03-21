import { error, redirect } from '@sveltejs/kit';
import { flashMessageStore } from '../../../stores.js';

export async function load({ params, url }) {
    if (params.login_register != "login" && params.login_register != 'register') {
        throw new error(404, "Not found")
    }
    if (params.login_register == "login") {
        let intervalId;
        function flashInterval(intervalId) {
            if (window.location.pathname === '/') {
                flashMessageStore.set("Welcome back, we are happy to have you here again");
                clearInterval(intervalId);
            }
        }
        intervalId = setInterval(() => {flashInterval(intervalId)}, 100)
        redirect(307, "/");
    }
    if (params.login_register == "register") {
        let intervalId;
        function flashInterval(intervalId) {
            if (url.pathname === '/') {
                flashMessageStore.set("Welcome to Sensopinion, check your email to verify your account");
                clearInterval(intervalId);
            }
        }
        intervalId = setInterval(() => {flashInterval(intervalId)}, 100)
        redirect(307, "/");
    }
}
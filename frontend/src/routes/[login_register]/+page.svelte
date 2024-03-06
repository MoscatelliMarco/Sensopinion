<script>
    import { slide } from "svelte/transition";
    let login = true;
</script>

<div class="flex min-h-full flex-col justify-center px-6 py-16 md:py-20 xl:py-24">
    <div class="flex justify-center">
        <button on:click={() => {login = true;}} class="{login ? "bg-primary-gradient-opacity text-white" : "border border-grey-2 text-grey-2"} 
        w-24 py-1.5 rounded-l text-sm">
            Sign in
        </button>
        <button on:click={() => {login = false;}} class="{!login ? "bg-primary-gradient-opacity text-white" : "border border-grey-2 text-grey-2"} 
        w-24 py-1.5 rounded-r text-sm">
            Sign up
        </button>
    </div>
  
    <h3 class="text-center font-medium text-2xl mt-8">
        {login ? "Login into your account" : "Create an account"}
    </h3>

    {#if login}
        <div transition:slide={{duration: 300}} class="sm:mx-auto sm:w-full sm:max-w-sm mt-6">
            <form class="space-y-3" action="" method="POST">
                <div>
                    <label for="email_username_login" class="block text-sm font-medium leading-6 text-grey-1">Email address or username</label>
                    <div class="mt-1">
                        <input id="email_username_login" name="email_username_login" type="email" autocomplete="email" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6">
                    </div>
                </div>
            
                <div>
                    <div class="flex items-center justify-between">
                    <label for="password_login" class="block text-sm font-medium leading-6 text-grey-1">Password</label>
                    <div>
                        <a href="#" class="font-semibold text-xs text-primary-gradient">Forgot password?</a>
                    </div>
                    </div>
                    <div class="mt-1">
                        <input id="password_login" name="password_login" type="password" autocomplete="current-password" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6">
                    </div>
                </div>
            
                <div class="pt-3">
                    <button type="submit" class="flex w-full justify-center rounded-md bg-primary-gradient px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
                        Sign in
                    </button>
                </div>
            </form>
        </div>
    {:else}
        <div on:error={(error) => {console.log(error)}} transition:slide={{duration: 300}} class="sm:mx-auto sm:w-full sm:max-w-sm mt-8">
            <form class="space-y-3" action="" method="POST">
                <div>
                    <label for="username_register" class="block text-sm font-medium leading-6 text-grey-1">Username</label>
                    <div class="mt-1">
                    <input id="username_register" name="username_register" type="username" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6">
                    </div>
                </div>

                <div>
                    <label for="email_register" class="block text-sm font-medium leading-6 text-grey-1">Email address</label>
                    <div class="mt-1">
                    <input id="email_register" name="email_register" type="email" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6">
                    </div>
                </div>
            
                <div>
                    <div class="flex items-center justify-between">
                    <label for="password_register" class="block text-sm font-medium leading-6 text-grey-1">Password</label>
                    </div>
                    <div class="mt-1">
                    <input id="password_register" name="password_register" type="password" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6">
                    </div>
                </div>

                <div>
                    <div class="flex items-center justify-between">
                    <label for="confirm_password_register" class="block text-sm font-medium leading-6 text-grey-1">Confirm password</label>
                    </div>
                    <div class="mt-1">
                    <input id="confirm_password_register" name="confirm_password_register" type="password" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6">
                    </div>
                </div>
            
                <div class="pt-3">
                    <button type="submit" class="flex w-full justify-center rounded-md bg-primary-gradient px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
                        Sign up
                    </button>
                </div>
            </form>
        </div>
    {/if}

  </div>
<script>
    export let isAuthenticated;

    import { onMount } from 'svelte';
    let user;

	async function getUser() {
        try {
            let response = await fetch('/api/user');
            let data = await response.json();
            return data;
        } catch(e) {
            console.log(e);
        }
    }

    onMount(async () => {
        if(isAuthenticated && user == null) {
            let data = await getUser();
            if(data.status == 'error') return;
            user = data;
        }
    });
</script>

{#if isAuthenticated }
    {#if user != null}
    <a href="/logout" title="Logout" class="ml-auto">
        <img class="h-8 rounded-full" alt="{user.username}'s avatar" src="https://cdn.discordapp.com/avatars/{user.id}/{user.avatar}.png" />
    </a>
    {:else}
         <span class="ml-auto inline-block">Loading...</span>
    {/if}
{:else}
    <a href="/login" class="px-4 py-2 text-sm font-medium text-indigo-200 ml-auto">Login with Discord</a>
{/if}

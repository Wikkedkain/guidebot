<script>
    import { onMount } from 'svelte';
    import { cachedApi } from '../components/api.js';
    import { Link } from "svelte-routing";
    let serverFetch = cachedApi('/api/servers', onError, true);
    let servers = [];

    onMount(async () => {
        servers = await serverFetch();
    });

    function onError(err) {
        console.log(err);
    }
</script>

{#if servers != null && servers.length > 0}
<ul class="divide-y divide-gray-200">
    {#each servers as server}
    <li>
        <Link to="servers/{server.id}">
            <div class="py-4 flex items-center space-x-3">
                <div class="min-w-0 flex-1 flex items-center">
                    <img class="h-10 w-10 rounded-full" src="http://cdn.discordapp.com/icons/{server.id}/{server.icon}.png" alt="{server.name}">
                    <div class="flex flex-col pl-4">
                        <span class="text-sm leading-5 font-medium text-gray-900">{server.name}</span>
                        <span class="text-sm leading-5 text-gray-500">BatBot not present</span>
                    </div>
                </div>
                <div>
                    <!-- Heroicon name: chevron-right -->
                    <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                </div>
            </div>
        </Link>
    </li>
    {/each}
</ul>
{/if}
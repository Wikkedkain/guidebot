<script>
    import { onMount } from 'svelte';
    import { cachedApi } from '../components/api.js';
    import Command from '../components/Command.svelte';
    import { Router, Link, Route } from "svelte-routing";
    let commandFetch = cachedApi('/api/commands', onError, true);
    let commands = [];

    const defaultClass = "px-2 -mx-2 py-1 relative block hover:translate-x-2px hover:bg-indigo-600 hover:text-white focus:outline-none text-gray-600 font-medium";
    const activeClass = "px-2 -mx-2 py-1 relative block hover:translate-x-2px text-white focus:outline-none bg-indigo-800 font-medium";

    const getLinkProps = ({ href, isPartiallyCurrent, isCurrent }) => {
        return { class: isCurrent ? activeClass : defaultClass };
    };

    function onError(err) {
        console.log(err);
    }
    
	onMount(async () => {
        commands = await commandFetch();
    });

    function updateCommandListHeight(smallMedia) {
        if(smallMedia.matches) {
            commandListHeight = "height: calc(100vh - 7rem)";
        } else {
            commandListHeight = "";
        }
    }
    
    let commandListHeight = "";
    let smallMedia = window.matchMedia("(min-width: 640px)");
    updateCommandListHeight(smallMedia);
    smallMedia.addListener(updateCommandListHeight);
</script>

<Router>
    <h1 class="text-lg leading-6 font-semibold text-gray-900">Commands</h1>
    {#if commands != null && commands.length > 0}
        <div class="sm:flex">
            <div class="sm:w-1/3 md:w-1/4 sm:overflow-x-hidden sm:overflow-y-scroll sm:-ml-4 pl-2" style="{commandListHeight}">
                <ul>
                    {#each commands as command}
                    <Link to="{command.help.name}" getProps={getLinkProps}>{command.help.name}</Link>
                    {/each}
                </ul>
            </div>
            <div class="sm:w-2/3 md:w-3/4">
                {#each commands as command}
                <Route path="{command.help.name}" component={Command} command={command} />
                {/each}
            </div>
        </div>
    {/if}
</Router>
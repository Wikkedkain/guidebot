<script>
    import { onMount } from 'svelte';
    import { localCache } from '../components/stores.js';
    import Command from '../components/Command.svelte';
    import { Router, Link, Route } from "svelte-routing";
    let commandCache = localCache('/api/commands');
    let commands = commandCache.get();

    const getLinkProps = ({ href, isPartiallyCurrent, isCurrent }) => {
        //const isActive = href === "/" ? isCurrent : isPartiallyCurrent || isCurrent;
        return { class: "px-2 -mx-2 py-1 relative block hover:translate-x-2px hover:text-gray-900 text-gray-600 font-medium" };
    };

	async function getCommands() {
		let response = await fetch('/api/commands');
		let data = await response.json();
		return data;
    }
    
	onMount(async () => {
        if(commands == null || commands.length == 0) {
            commands = await getCommands();
            commandCache.set(commands);
        }
	});
</script>

<Router>
    <h1 class="text-2xl font-bold text-indigo-900">Commands</h1>
    {#if commands != null}
        {#each commands as command}
        <Route path="{command.help.name}" component={Command} command={command} />
        {/each}
        <ul>
            {#each commands as command}
            <li><Link to="{command.help.name}" getProps={getLinkProps}>{command.help.name}</Link></li>
            {/each}
        </ul>
    {/if}
</Router>
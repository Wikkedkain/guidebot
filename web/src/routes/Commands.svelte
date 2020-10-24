<script>
    import { onMount } from 'svelte';
    import { commandStore } from '../components/stores.js';
    import Command from '../components/Command.svelte';
    import { Router, Link, Route } from "svelte-routing";
	let commands;

	async function getCommands() {
		let response = await fetch('/api/commands');
		let data = await response.json();
		return data;
	}
	onMount(async () => {
        commands = await getCommands();
        commandStore.set(commands);
	});
</script>

<Router>
    <h1>Commands</h1>
    {#if commands != null}
        {#each commands as command}
        <Route path="{command.help.name}" component={Command} command={command} />
        {/each}
        <ul>
            {#each commands as command}
            <li><Link to="{command.help.name}">{command.help.name}</Link></li>
            {/each}
        </ul>
    {/if}
</Router>
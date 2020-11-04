<script>
    export let command;
</script>

<div class="mx-8">
    <h2 class="text-2xl font-bold text-indigo-800">{command.help.name}</h2>
    <p class="text-gray-600">{command.help.description}</p>
    
    <h3 class="mt-8 font-semibold text-indigo-700">Examples</h3>
    <pre class="bg-gray-600 text-white border-solid rounded-md p-4 whitespace-pre-wrap">{command.help.usage}</pre>

    <table class="mt-8">
        <tr>
            <td>Server only?</td>
            <td>{command.conf.guildOnly}</td>
        </tr>
        <tr>
            <td>Permission Level</td>
            <td>{command.conf.permLevel}</td>
        </tr>
        <tr>
            <td>Aliases</td>
            <td>{command.conf.aliases.join(', ')}</td>
        </tr>
    </table>
</div>
<script>
    import { onMount } from 'svelte';
    import { Router, Link, Route } from "svelte-routing";
    export let id;
    let server;

    const getLinkProps = () => {
        return { class: 'text-gray-900 font-medium hover:text-gray-600 transition ease-in-out duration-150' };
    };
    
	async function getServer() {
		let response = await fetch(`/api/servers/${id}`);
		let data = await response.json();
		return data;
    }

    onMount(async () => {
        if(server == null) {
            server = await getServer();
        }
    });
</script>

{#if server != null}
<div class="bg-indigo-500 mx-auto p-2 h-18 flex items-center -mt-4">
    <img class="h-8 rounded-full" alt="{server.name}'s icon" src="https://cdn.discordapp.com/icons/{server.id}/{server.icon}.png" />
    <h2 class="text-white font-bold">{server.name}</h2>
</div>

<Router>
    <Route path="/">
        <ul class="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <li>
                <Link to="music">
                    <div class="col-span-1 flex shadow-sm rounded-md">
                        <div class="flex-shrink-0 flex items-center justify-center w-16 bg-purple-600 text-white text-sm leading-5 font-medium rounded-l-md">
                        MP
                        </div>
                        <div class="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
                            <div class="flex-1 px-4 py-2 text-sm leading-5 truncate">
                                <span class="text-gray-900 font-medium hover:text-gray-600 transition ease-in-out duration-150">Music Player</span>
                                <p class="text-gray-500">Play music in discord!</p>
                            </div>
                            <div>
                                <!-- Heroicon name: chevron-right -->
                                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </Link>
            </li>

            <li>
                <Link to="temp">
                    <div class="col-span-1 flex shadow-sm rounded-md">
                        <div class="flex-shrink-0 flex items-center justify-center w-16 bg-pink-600 text-white text-sm leading-5 font-medium rounded-l-md">
                        SP
                        </div>
                        <div class="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
                            <div class="flex-1 px-4 py-2 text-sm leading-5 truncate">
                                <span class="text-gray-900 font-medium hover:text-gray-600 transition ease-in-out duration-150">Sexy Party</span>
                                <p class="text-gray-500">Start a sexy party!</p>
                            </div>
                            <div>
                                <!-- Heroicon name: chevron-right -->
                                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </Link>
            </li>

            <li>
                <Link to="temp">
                    <div class="col-span-1 flex shadow-sm rounded-md">
                        <div class="flex-shrink-0 flex items-center justify-center w-16 bg-orange-500 text-white text-sm leading-5 font-medium rounded-l-md">
                        D
                        </div>
                        <div class="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
                            <div class="flex-1 px-4 py-2 text-sm leading-5 truncate">
                                <span class="text-gray-900 font-medium hover:text-gray-600 transition ease-in-out duration-150">Data</span>
                                <p class="text-gray-500">Edit some data!</p>
                            </div>
                            <div>
                                <!-- Heroicon name: chevron-right -->
                                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </Link>
            </li>

            <li>
                <Link to="temp">
                    <div class="col-span-1 flex shadow-sm rounded-md">
                        <div class="flex-shrink-0 flex items-center justify-center w-16 bg-red-600 text-white text-sm leading-5 font-medium rounded-l-md">
                        DB
                        </div>
                        <div class="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
                            <div class="flex-1 px-4 py-2 text-sm leading-5 truncate">
                                <span class="text-gray-900 font-medium hover:text-gray-600 transition ease-in-out duration-150">Delete Batbot</span>
                                <p class="text-gray-500">Please don't!</p>
                            </div>
                            <div>
                                <!-- Heroicon name: chevron-right -->
                                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </Link>
            </li>
        </ul>
    </Route>
    
    <Route path="music">
        <p>Play some music!</p>
        <div class="flex bg-gray-400 items-center justify-between p-4 fixed bottom-0 max-w-6xl w-full">
            <div class="flex-auto"></div>
            <div>
                <button>
                <svg class="h-12 w-12 text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clip-rule="evenodd" />
                </svg>
                </button>
            </div>
            <div>
                <button>
                <svg class="h-12 w-12 text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                </svg>
                </button>
            </div>
            <div>
                <button>
                <svg class="h-12 w-12 text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clip-rule="evenodd" />
                </svg>
                </button>
            </div>
            <div class="flex-auto"></div>
        </div>
        
    </Route>

    <Route path="temp">
        <p>Temporary!</p>
    </Route>
</Router>
{/if}
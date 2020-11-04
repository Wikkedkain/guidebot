<script>
  import { Router, Link, Route } from "svelte-routing";
  import Home from "./routes/Home.svelte";
  import NavLink from './components/NavLink.svelte';
  import Commands from './routes/Commands.svelte';
  import Servers from './routes/Servers.svelte';
  import Server from './routes/Server.svelte';
  import Auth from './components/Auth.svelte';
  import Command from './components/Command.svelte';
  import { cookies } from './components/stores.js';
  let isAuthenticated = cookies.get('isAuthenticated') == 'true';

  export let url = "";
</script>

<Router url="{url}">
  <nav class="bg-indigo-700 mx-auto p-2 h-18 flex">
    <NavLink to="/">Home</NavLink>
    <NavLink to="commands">Commands</NavLink>
    {#if isAuthenticated}
    <NavLink to="servers">Servers</NavLink>
    {/if}
    <Auth isAuthenticated={isAuthenticated} />
  </nav>
  
  <main class="container mt-4 max-w-6xl px-4 sm:px-6 lg:px-8 xl:px-0">
    <Route path="commands/*" component="{Commands}" />
    <Route path="servers" component={Servers} />
    <Route path="servers/:id/*" component={Server} />
    <Route path="/">
      <Home name="world" />
    </Route>
  </main>
</Router>
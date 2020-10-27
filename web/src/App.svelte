<script>
  import { Router, Link, Route } from "svelte-routing";
  import Home from "./routes/Home.svelte";
  import NavLink from './components/NavLink.svelte';
  import Commands from './routes/Commands.svelte';
  import Command from './components/Command.svelte';

  export let url = "";
</script>

<Router url="{url}">
  <nav class="bg-indigo-700 mx-auto p-4 h-16">
    <NavLink to="/">Home</NavLink>
    <NavLink to="commands">Commands</NavLink>
  </nav>
  
  <main class="container mt-4">  
    <Route path="commands/*" component="{Commands}" />
    
    <Route path="/">
      <Home name="world" />
    </Route>
  </main>
</Router>
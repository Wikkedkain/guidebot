<script>
  import { Router, Link, Route } from "svelte-routing";
  import Home from "./routes/Home.svelte";
  import Commands from './routes/Commands.svelte';
  import Command from './components/Command.svelte';

  export let url = "";
</script>

<Router url="{url}">
  <nav>
    <Link to="/">Home</Link>
    <Link to="commands">Commands</Link>
  </nav>
  <div>
    <Route path="commands/*" component="{Commands}" />
    
    <Route path="/">
      <Home name="world" />
    </Route>
  </div>
</Router>
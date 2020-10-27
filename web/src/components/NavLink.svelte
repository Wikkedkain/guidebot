<script>
    import { Link } from "svelte-routing";

    export let to = "";

    const defaultClass = "px-4 py-2 rounded-md text-sm font-medium text-indigo-200 hover:text-white hover:bg-indigo-600 focus:outline-none focus:text-white focus:bg-indigo-600";
    const activeClass = "px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-800 focus:outline-none focus:text-white focus:bg-indigo-600";

    const getProps = ({ href, isPartiallyCurrent, isCurrent }) => {
        const isActive = href === "/" ? isCurrent : isPartiallyCurrent || isCurrent;
        return { class: isActive ? activeClass : defaultClass };
    };
</script>

<Link to="{to}" getProps="{getProps}">
  <slot />
</Link>
<script>
  import { page } from "$app/stores";
</script>

<nav>
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/">Bookmarks</a></li>
      </ul>
</nav>

<style>
  nav {
    /* width: 100%; */
    float: right;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: 7px;
  }
  ul {
    width: 400px;
    list-style: none;
    display: flex;
    flex-direction: row;
    justify-content:  space-evenly;;
    align-items: center;
  }
  /* ul.vertical{
    flex-direction: column; */
    /* height: 300px;
  } */
  a {
    font-size: 2em;
  }
  li{
    border: 2px solid var(--color-border);
    padding-left: 6px;
  }
</style>

<script lang="ts">
  import Icon from "fa-svelte";
  import { faFacebookF, faInstagram } from "@fortawesome/free-brands-svg-icons"

  import tureHoundsLogo from "$lib/images/ture-hounds-logo.png";

  export let segment: string;
</script>

<nav>
  <div class="title">
    <a href="/">
      <img alt="Ture Hounds" src={tureHoundsLogo} />
      PuppyCam
    </a>
  </div>

  <ul>
    <li>
      <a
        aria-current={segment === undefined ? "page" : undefined}
        href="/"
        ><span>Live</span></a
      >
    </li>
    <li>
      <a
        aria-current={segment === "stats" ? "page" : undefined}
        href="stats"
        ><span>Stats</span></a
      >
    </li>
    <li>
      <a
        aria-current={segment === "news" ? "page" : undefined}
        href="news"
        ><span>News</span></a
      >
    </li>
    <li>
      <a
        aria-current={segment === "about" ? "page" : undefined}
        href="about"
        ><span>About</span></a
      >
    </li>
    <li>
      <a href="https://turehounds.com"><span>Ture Hounds Home</span></a>
    </li>
    <li>
      <a href="https://www.facebook.com/TureHounds"
        ><span class="icon"><Icon icon={faFacebookF} /></span></a
      >
    </li>
    <li>
      <a href="https://www.instagram.com/turehounds"
        ><span class="icon"><Icon icon={faInstagram} /></span></a
      >
    </li>
  </ul>
</nav>

<style lang="postcss">
  nav {
    border-bottom: 1px solid hsl(194, 70%, 48%, 0.2);
    font-weight: 300;
    padding: 0.5em 1em calc(0.5em - 12px);
  }

  .title {
    display: inline-block;
    font-weight: 700;

    img {
      vertical-align: middle;
      padding: 0 0.5em 12px 0;
      height: 50px;
    }
  }
  ul {
    margin: 0 0 0 5em;
    padding: 0;
    display: inline-block;
  }

  li {
    display: inline-block;

    a {
      padding: 0.75em 0.5em;

      span {
        padding: 0.25em 0;
        border-bottom: 3px solid transparent;

        :global(svg) {
          /* padding: 0.25em 0; */
          height: 1.25em;
          width: 1.25em;
        }
      }

    }
  }

  a {
    text-decoration: none;
    display: block;

    &[aria-current],
    &:hover {
      color: hsl(194, 70%, 48%);

      span {
        border-bottom-color: hsl(194, 70%, 48%);
      }
    }
  }

  @media (max-width: 1024px) {
    .title {
      display: block;
      text-align: center;

      img {
        padding: 0 0.5em 4px 0;
        height: 30px;
      }
    }

    ul {
      display: block;
      text-align: center;
      margin: 0;
    }
  }
</style>

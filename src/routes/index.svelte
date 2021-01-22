<script lang="ts">
  import Video from "../components/Video.svelte";
  import PuppyDetails from "../components/PuppyDetails.svelte";
  import PuppyWeather from "../components/PuppyWeather.svelte";
</script>

<svelte:head>
  <title>Ture Hounds PuppyCam!</title>
</svelte:head>

<div class="layout">
  <div class="aspect-root">
    <div class="aspect-main">
      <Video title="Up-close" videoId="dAYyHiFXJU" />
    </div>
    <div class="aspect-child">
      <Video title="Eye in the Sky" videoId="jqbAk2MNMd" />
    </div>
  </div>

  <div class="details">
    <h3>The puppies</h3>

    <PuppyDetails />
    <a href="about#puppy-details" class="what">what?!</a>

    <PuppyWeather title="Current puppy weather" />
    <a href="about#puppy-weather" class="what">what?!</a>
  </div>
</div>

<style type="scss">
  .layout {
    display: block;
  }

  .aspect-root {
    width: 100%;
    height: auto;
  }

  .aspect-main,
  .aspect-child {
    /* ensures a 16:9 aspect ratio */
    width: min(100vw - 1rem, (100vh - 5rem) * 1.77778);
    height: min(100vh - 5rem, (100vw - 1rem) / 1.77778);
    margin-bottom: 1rem;
  }

  .details {
    padding: 0;
  }

  .what {
    font-size: 80%;
    font-style: italic;
  }

  @media (min-width: 1025px) {
    .layout {
      display: flex;
    }

    .aspect-root {
      /* ensures a 16:9 aspect ratio */
      width: min(100vw - 25rem, (100vh - 10rem) * 1.77778);
      height: min(100vh - 10rem, (100vw - 25rem) / 1.77778);
      position: relative;
      flex-basis: content;
    }

    .aspect-main {
      width: 100%;
      height: 100%;
    }

    .aspect-child {
      position: absolute;
      width: 30%;
      height: 30%;
      top: 0;
      right: 0;
      margin: 0.5em;
      border: 0.5em solid white;
    }

    .details {
      padding: 0.5em 1em;
      width: 25rem;
      

      & > *:first-child {
        margin-top: 0;
      }
    }
  }
</style>

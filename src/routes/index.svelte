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
    <Video title="Eye in the Sky" videoId="jqbAk2MNMd" />
    <!-- <div class="aspect-child">
			<Video title="PuppyCam 2 (coming soon)" videoId="dAYyHiFXJU" dummy />
		</div> -->
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
  .aspect-root {
    /* ensures a 16:9 aspect ratio */
    width: min(100vw - 10rem, (100vh - 10rem) * 1.77778);
    height: min(100vh - 10rem, (100vw - 10rem) / 1.77778);
    position: relative;
  }

  // .aspect-child {
  //   position: absolute;
  //   width: 30%;
  //   height: 30%;
  //   top: 0;
  //   right: 0;
  //   margin: 0.5em;
  //   border: 0.5em solid white;
  // }

  .layout {
    display: flex;
  }

  .details {
    padding: 0.5em 1em;
    flex: auto;

    & > *:first-child {
      margin-top: 0;
    }
  }

  .what {
    font-size: 80%;
    font-style: italic;
  }

  @media (max-width: 1024px) {
    .layout {
      display: block;
    }

    .aspect-root {
      /* ensures a 16:9 aspect ratio */
      width: min(100vw - 1rem, (100vh - 5rem) * 1.77778);
      height: min(100vh - 5rem, (100vw - 1rem) / 1.77778);
      margin-bottom: 2rem;
    }

    // .aspect-child {
    //   margin: 0.25em;
    //   border-width: 0.25em;
    // }

    .details {
      padding: 0;
    }
  }
</style>

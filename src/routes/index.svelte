<script lang="ts">
  // import Video from "../components/Video.svelte";
  // import Video2 from "../components/Video2.svelte";
  // import PuppyDetails from "../components/PuppyDetails.svelte";
  // import PuppyWeather from "../components/PuppyWeather.svelte";
  import LatestNews from "../components/LatestNews.svelte";
</script>

<svelte:head>
  <title>Ture Hounds PuppyCam!</title>
</svelte:head>

<div class="layout">
  <!-- <div class="aspect-root">
    <div class="aspect-main">
      <Video title="Eye in the Sky" videoId="jqbAk2MNMd" />
      <Video2
        publicId="dAYyHiFXJU"
        uuid="3ed3fea78dfc4f86968ab2ae9f616443"
        streamHost="stream-ue1-charlie.dropcam.com"
      />
    </div>
  </div>

  <div class="details">
    <PuppyDetails />
    <a href="about#puppy-details" class="what">what?!</a>

    <PuppyWeather title="Current puppy weather" />
    <a href="about#puppy-weather" class="what">what?!</a>

    <LatestNews />
    <a href="about#news" class="what">what?!</a>
  </div> -->

  <div class="news">
    <LatestNews title="Until next time..." />
  </div>
</div>

<!-- .aspect-root {
    width: 100%;
  }

  .aspect-main /* ,
  .aspect-child */ {
    /* ensures a 16:9 aspect ratio */
    width: min(100vw - 1rem, (100vh - 5rem) * 1.77778);
    margin-bottom: 0.5rem;
    background-color: hsl(0, 0%, 40%);
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
      position: relative;
      flex-basis: content;
    }

    .aspect-main {
      width: 100%;
    }

    /* .aspect-child {
      position: absolute;
      width: 30%;
      top: 0;
      right: 0;
      margin: 0.5em;
      border: 0.25em solid white;
    } */

    .details {
      padding: 0.5em 1em;
      width: 25rem;

      & > *:first-child {
        margin-top: 0;
      }
    }
  }
</style> -->
<style type="scss">
  .layout {
    display: block;
  }

  .news {
    font-size: 150%;
    max-width: 50rem;
  }
</style>

<script lang="ts">
  import Video from "../components/Video.svelte";
  import PuppyWeather from "../components/PuppyWeather.svelte";
</script>

<svelte:head>
  <title>About - Ture Hound PuppyCam!</title>
</svelte:head>
<div class="wrapper">
  <h1>About PuppyCam</h1>

  <p>
    Having puppies in the house is
    <em>ridiculously</em>
    fun, especially as they get bigger and start to play. The next best thing to
    having them in your house is at least being able to check in on them at any time.
    We had a puppy cam available for Disa's first litter and decided to do it again
    for this one.
  </p>

  <p>
    If history is any indicator, morning time—around 8am MST, say—will be a good
    time to see puppy activity. That’s when I (Jared) jump in with the puppies
    to get my fix before starting work.
  </p>

  <h2>Technical details</h2>

  <p>
    I (Jared) write software for a living, and I enjoy it enough that I also do
    it in my spare time. Any excuse to write some bespoke software or learn
    a new technology is a good thing in my opinion. As a result, this site might
    be considered a gratuitous use of technology. 😉
  </p>

  <p>
    This PuppyCam site is composed of several loosly-connected pieces. In
    roughly the order that you experience them, they are:
  </p>
  <ul>
    <li><a href="about#front-end">front-end web site</a></li>
    <li><a href="about#live-video">live video feed</a></li>
    <li><a href="about#puppy-details">puppy details</a></li>
    <li><a href="about#puppy-weather">“puppy weather” information</a></li>
    <li><a href="about#more">maybe more?</a></li>
  </ul>

  <h3 id="front-end">Front-end web site</h3>

  <p>
    The site itself is a
    <a href="https://svelte.dev" target="_blank">Svelte.js</a>/<a
      href="https://sapper.svelte.dev"
      target="_blank">Sapper</a
    >
    site, which means that everything “interesting” actually runs in your browser,
    and the hosting server (<code>puppycam.turehounds.com</code>) itself doesn’t
    actually
    <em>do</em>
    anything. The nice thing about having nothing running on the server is that it
    means we can host it for free on
    <a href="https://netlify.com" target="_blank">Netlify</a>. One other nice
    thing about Netlify is that it auto-updates when there’s a change to the
    source code. As soon as I push a change to the code, Netlify grabs that
    change, rebuilds the site, and redeploys it, all in a matter of seconds.
  </p>

  <p>
    If you want to see the source for this site, you could, theoretically, as
    it’s hosted on GitHub. It’s currently marked as a private repository,
    though, so you can’t actually see it. Please let me know if you’re curious,
    and I could be persuaded to make it publicly visible. (There’s really
    nothing secret in the source; I just didn’t want to have random folks
    visiting the PuppyCam site.)
  </p>

  <h3 id="live-video">Live video feed</h3>

  <p>
    Even before the previous iteration of PuppyCam, we had a few
    <a href="https://nest.com" target="_blank">Nest</a>
    cameras, for security. We use them so that we can easily keep an eye on things,
    including being able to peek in at the pups at night-time—the cameras use infrared
    in low-light situations so we don’t need to turn on a light just to check on
    them. You can also, as a camera owner, choose to make the feed from the camera
    “public”, which allows you to share a public link to the feed on the
    <code>nest.com</code>
    site,
    <em>or</em>
    you can embed the video on your own site:
  </p>

  <div class="example video">
    <Video title="Eye in the Sky" videoId="jqbAk2MNMd" />
  </div>

  <p>
    For PuppyCam, I use a little bit of HTML/CSS magic to make one of the videos
    look like it’s “inset” into the other. (Coming soon... I just need to mount
    the camera on the whelping box first!)
  </p>

  <h3 id="puppy-details">Puppy details</h3>

  <p>
    The details about the puppies is just content that I’ve typed into the site
    by hand… there’s nothing magic or particularly technical for this part. It
    would be awesome if the puppy weights could auto-update, but that would mean
    some kind of weight-measuring pad, being able to track which puppy is on the
    pad at any given moment, and so on… I mean, that would be
    <em>undeniably</em>
    cool, but it’s beyond my reach at the moment.
  </p>

  <h3 id="puppy-weather">“Puppy weather” information</h3>

  <div class="example">
    <PuppyWeather />
  </div>

  <p>
    Okay... now
    <em>this</em>
    part of the site is a
    <em><strong>completely</strong></em>
    gratuitous use of technology. It's a complete sub-system in and of itself. It
    comprises:
  </p>
  <ul>
    <li>
      <a href="about#sensorpush">temperature/humidity data collection</a>
    </li>
    <li><a href="about#proxy">bespoke data proxy</a></li>
    <li>
      <a href="about#weather-component">auto-updating in-browser logic</a>
    </li>
  </ul>

  <h4 id="sensorpush">Temperature/humidity data collection</h4>

  <p>
    For various and sundry reasons, I happen to have several
    <a href="https://www.sensorpush.com/" target="_blank">SensorPush</a>
    temperature and humidity sensors. They allow me to monitor such critical things
    as
    <em>“does my cigar humidor need more water?”</em>
    and
    <em>“what temperature is the kitchen right now?”</em>. These devices record
    the temperature and humidity once every minute, and send that information
    (via a low-energy-Bluetooth–to–WiFi hub) up to SenorPush’s data servers in
    the cloud.
  </p>

  <p>
    SensorPush also exposes a programmatic API so that you can get the raw data
    they have saved from the individual sensors. Their API is rather complex,
    however, and also requires performing proper authentication using your (my!)
    personal SensorPush password. Since (a) I don’t want to expose my password
    even within the source of the web page, (b) the PuppyCam site only needs the
    most-recent temperature/humidity reading, and (c) when the PuppyCam goes
    viral it could start requesting the information
    <em>millions</em>
    of times 😉, the “most sane” thing to do is to run a tiny one-off web server
    whose job is to peridocially poke the SensorPush API to get the latest reading,
    and to also serve that information publically.
  </p>

  <p>All of which means it’s a…</p>

  <h4 id="proxy">Bespoke data proxy</h4>

  <p>
    I’ve written a small program/web-server in
    <a href="https://golang.org/" target="_blank">Go</a>
    that performs all of the necessary work for getting the temperature and humidity
    from the SensorPush API, and then turns around and exposes it as a simple web
    page at
    <a href="https://puppycam-sensor.spudnoggin.com/sensor" target="_blank"
      ><code>https://puppycam-sensor.spudnoggin.com/sensor</code></a
    >. If you visit that link, you’ll see some additional potential data metrics
    without values: altitude, barometric pressure, and so on. SensorPush has
    some newer sensors that report those values, but ours only includes the
    temperature and humidity.
  </p>

  <p>
    This small program runs on spare hardware that’s been cobbled together over
    the years and turned into a little Linux box running my own personal private
    “cloud”. It could just as easily run “in the (real) cloud”—and in
    would/will, if the PuppyCam actually goes viral!—but it doesn’t cost
    anything (more) to run it on a machine that I already have and that is
    already exposed to the internet as half-a-dozen other virtual servers.
  </p>

  <h4 id="weather-component">Auto-updating in-browser logic</h4>

  <p>
    So given that there’s now easy and open access to the temperature/humidity
    data, it’s just a matter of getting that information to show up in your
    browser. The Svelte component I’ve written for this site simply tells the
    browser to retrieve the data from the bespoke data proxy every 30 seconds,
    and then updates the information on the page. Updating the page is something
    that Svelte was designed to do, so this is a lot easier than it might sound.
  </p>

  <p>All of that, just to get this:</p>

  <div class="example">
    <PuppyWeather />
  </div>

  <p>Wooo! 🎉 <em>(And yes, that’s a live and accurate reading!)</em></p>

  <h3 id="more">Maybe more?</h3>

  <p>
    …And that’s it, for now. I’ve considered including the
    <em>outside</em>
    weather (as a nice contrast with the puppy weather), but that doesn’t seem really
    necessary—not that this entire site is really necessary. 😉
  </p>
</div>

<style type="scss">
  .wrapper {
    max-width: 50em;
    // font-weight: 400;
  }

  .example {
    width: 16em;
    margin: 1em auto;
    border: 1px solid hsl(0, 0%, 60%);
    border-radius: 1em;
    background-color: hsl(0, 0%, 60%, 0.25);
    padding: 0.5em;
    box-sizing: content-box;
  }
  .video {
    height: 9em;
  }
</style>

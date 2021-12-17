# [puppycam.turehounds.com](https://puppycam.turehounds.com)

The live-streaming and “news” site for the [Ture Hounds](https://turehounds.com) PuppyCam!

![Netlify status](https://img.shields.io/netlify/47358d93-3acf-4c93-b133-f1653cc883c8)

## Why on earth does this exist?

For two reasons:

- Family, friends, and prospective new puppy owners _**love**_ to watch puppies
  as they grow and develop. Since we can’t have all of these people living in
  our house, the next best thing is a 24/7 live-stream.

- Personal software projects give me a chance to play with technologies that I’m
  curious about. I’ve used React quite a bit and wanted to see what
  Svelte/Sapper was like.

## Okay, so what is it, exactly?

_You can also read more about the technical details on the [About page](https://puppycam.turehounds.com/about/) itself._

The PuppyCam site is composed of several loosly-connected pieces. In roughly the
order that one can experience them, they are:

- [front-end web site](#front-end-web-site)
- [live video feed](#live-video-feed)
- [puppy details](#puppy-details)
- [“puppy weather” information](#puppy-weather-information)
- [latest news](#latest-news)
- [maybe more?](#maybe-more)

### Front-end web site

The site itself is a
[Svelte.js](https://svelte.dev)/[Sapper](https://sapper.svelte.dev) site, which
means that everything “interesting” actually runs in your browser, and the
hosting server (`puppycam.turehounds.com`) itself doesn’t actually _do_
anything. The nice thing about having nothing running on the server is that it
means it can be hosted it for _**free**_ on [Netlify](https://netlify.com). One
other nice thing about Netlify is that it auto-updates when there’s a change to
the source code. As soon as I push a change to the code, Netlify grabs that
change, rebuilds the site, and redeploys it, all in a matter of seconds.

### Live video feed

Even before this iteration of PuppyCam, we had a few [Nest](https://nest.com)
cameras, for security. We use them so that we can easily keep an eye on things,
including being able to peek in at the pups at night-time—the cameras use
infrared in low-light situations so we don’t need to turn on a light just to
check on them. One can also, as a camera owner, choose to make the feed from the
camera “public”, which creates a public link to the feed on the `nest.com` site,
_or_ the video can be embedded on any site.

The default embedded (`iframe`) experience is okay, but I wanted better... so I did a
little forensic network anaylsis to find the raw video-stream so that it could
be served directly in a `<video>` element.

### Puppy details

For the first few days, the details about the puppies had been typed in by
hand. As of late Saturday, January 16, however, much of it is driven from
some data. This data, including relatively up-to-date weight measurements,
is still typed in by hand… but it’s entered in a very concise and minimal
way. It would be awesome if the puppy weights could truly auto-update, but
that would mean some kind of weight-measuring pad, being able to track which
puppy is on the pad at any given moment, and so on… I mean, that would be
_undeniably_
cool, but it’s beyond my reach at the moment.

That said, the table is now not only data-driven, but it also checks every 30
minutes or so to see if there’s any updated data. If it has, the table will
auto-update to reflect the latest weights, without requiring a page refresh.
While I'm not likely to update the weights every 30 minutes, this ensures that
the page will always be current.

Having all of the raw data also means that it is available to drive the
[statistics page](https://puppycam.turehounds.com/stats)!

### “Puppy weather” information

Okay... now _this_ part of the site is a _**completely**_ gratuitous use of
technology. It's a complete sub-system in and of itself. It comprises:

- [temperature/humidity data collection](#temperature-humidity-data-collection)
- [bespoke data proxy](#bespoke-data-proxy)
- [auto-updating in-browser logic](#auto-updating-in-browser-logic)

#### Temperature/humidity data collection

For various and sundry reasons, I happen to have several
[SensorPush](https://www.sensorpush.com/) temperature and humidity sensors. They
allow me to monitor such critical things as _“does my cigar humidor need more
water?”_ and _“what temperature is the kitchen right now?”_. These devices
record the temperature and humidity once every minute, and send that information
(via a low-energy-Bluetooth–to–WiFi hub) up to SenorPush’s data servers in the
cloud.

SensorPush also exposes a programmatic API so that one can get the raw data they
have saved from the individual sensors. Their API is rather complex, however,
and also requires performing proper authentication using one’s (my!) personal
SensorPush password. Since (a) I don’t want to expose my password even within
the source of the web page, (b) the PuppyCam site only needs the most-recent
temperature/humidity reading, and (c) when the PuppyCam goes viral it could
start requesting the information _millions_ of times 😉, the “most sane” thing
to do is to run a tiny one-off web server whose job is to peridocially poke the
SensorPush API to get the latest reading, and to also serve that information
publically.

All of which means it’s a…

#### Bespoke data proxy

I’ve written a small program/web-server in [Go](https://golang.org/) that
performs all of the necessary work for getting the temperature and humidity from
the SensorPush API, and then turns around and exposes it as a simple data feed
at <https://puppycam-sensor.spudnoggin.com/sensor> . If you visit that link,
you’ll see some additional potential data metrics without values: altitude,
barometric pressure, and so on. SensorPush has some newer sensors that report
those values, but ours only includes the temperature and humidity.

This small program runs on spare hardware that’s been cobbled together over
the years and turned into a little Linux box running my own personal private
“cloud”. It could just as easily run “in the (real) cloud”—and in
would/will, if the PuppyCam actually goes viral!—but it doesn’t cost
anything (more) to run it on a machine that I already have and that is
already exposed to the internet as half-a-dozen other virtual servers.

The source for this is in a private repository... but I may open it up in the
future.

#### Auto-updating in-browser logic

So given that there’s now easy and open access to the temperature/humidity data,
it’s just a matter of getting that information to show up in the browser. The
Svelte component I’ve written for this site simply tells the browser to retrieve
the data from the bespoke data proxy every 30 seconds, and then updates the
information on the page. Updating the page is something that Svelte was designed
to do, so this is a lot easier than it might sound.

### Latest news

I thought it would be good to have a way to highlight the most-recent news
update on the main page. And, just in case a visitor misses some, one should be
able to see _all_ of the previous news items as well.

The “latest news” component leverages the same “auto-refresh” capabilities
as the other components, checking every 30 minutes for any updated news.

I’ll admit it… I’m just having fun at this point.

### Maybe more?

…And that’s it, for now. I’ve considered including the _outside_ weather (as a
nice contrast with the puppy weather), but that doesn’t seem really
necessary—not that this entire site is really necessary. 😉

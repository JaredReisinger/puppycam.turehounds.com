<svelte:head>
	<title>About</title>
</svelte:head>

<h1>About PuppyCam</h1>

<p>
	Having puppies in the house is
	<em>ridiculously</em>
	fun, especially as they get bigger and start to play. The next best thing to
	having them in your house is at least being able to check in on them at any
	time. We had a puppy cam available for Disa's first litter and decided to do
	it again for this one.
</p>

<h2>Technical details</h2>

<p>
	We have a couple of Nest cameras set up as “publicly shared”, and this site
	uses an
	<code>iframe</code>
	to embed the video on the “live” page.
</p>

<p>
	The temperature/humidity data is being recorded by a Sensor Push device, and
	we have a custom web server that peridocially checks the Sensor Push API to
	get the latest data, and then serves that data to this site.
</p>

<p>Finally, this site itself was built using Svelte.js/Sapper.</p>

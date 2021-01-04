<script lang="ts">
	import tureHoundsLogo from "images/ture-hounds-logo.png";

	export let segment: string;
</script>

<style>
	nav {
		border-bottom: 1px solid hsl(194, 70%, 48%, 0.2);
		font-weight: 300;
		padding: 0.5em 1em calc(0.5em - 12px);
	}

	div.title {
		display: inline-block;
		font-weight: 700;
	}

	div.title img {
		vertical-align: middle;
		padding: 0 0.5em 12px 0;
	}

	ul {
		margin: 0 0 0 5em;
		padding: 0;
		display: inline-block;
	}

	li {
		display: inline-block;
	}

	a {
		text-decoration: none;
		display: block;
	}

	a[aria-current],
	a:hover {
		color: hsl(194, 70%, 48%);
	}

	li a {
		padding: 0.75em 0.5em;
	}

	li span {
		padding: 0.25em 0;
		border-bottom: 3px solid transparent;
	}

	a[aria-current] span,
	a:hover span {
		border-bottom-color: hsl(194, 70%, 48%);
	}
</style>

<nav>
	<div class="title">
		<a href="/" rel="prefetch">
			<img alt="Ture Hounds" src={tureHoundsLogo} height="50" />
			PuppyCam
		</a>
	</div>

	<ul>
		<li>
			<a
				aria-current={segment === undefined ? 'page' : undefined}
				href="/"
				rel="prefetch"><span>Live</span></a>
		</li>
		<li>
			<a
				aria-current={segment === 'about' ? 'page' : undefined}
				href="about"
				rel="prefetch"><span>About</span></a>
		</li>
		<li>
			<a href="https://turehounds.com"><span>Ture Hounds Home</span></a>
		</li>

		<!-- for the blog link, we're using rel=prefetch so that Sapper prefetches
		     the blog data when we hover over the link or tap it on a touchscreen -->
		<!-- <li><a rel=prefetch aria-current="{segment === 'blog' ? 'page' : undefined}" href="blog">blog</a></li> -->
	</ul>
</nav>

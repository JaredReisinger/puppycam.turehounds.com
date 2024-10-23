// See https://svelte.dev/docs/kit/types#app
// for information about these interfaces
declare global {
  namespace App {
          // interface Error {}
          // interface Locals {}
          // interface PageData {}
          // interface PageState {}
          // interface Platform {}
  }
}

export {};

/**
 * These declarations tell TypeScript that we allow import of images, e.g.
 * ```
		<script lang='ts'>
			import successkid from 'images/successkid.jpg';
		</script>

		<img src="{successkid}">
	 ```
 */
// declare module "*.gif" {
// 	const value: string;
// 	export = value;
// }

// declare module "*.jpg" {
// 	const value: string;
// 	export = value;
// }

// declare module "*.jpeg" {
// 	const value: string;
// 	export = value;
// }

// declare module "*.png" {
// 	const value: string;
// 	export = value;
// }

// declare module "*.svg" {
// 	const value: string;
// 	export = value;
// }

// declare module "*.webp" {
// 	const value: string;
// 	export = value;
// }

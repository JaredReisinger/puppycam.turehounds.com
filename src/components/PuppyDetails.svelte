<script lang="ts">
  import { onMount } from "svelte";
  import { DateTime } from "luxon";

  import { store as dataStore } from "./puppy-data.js";
  import {
    formatPoundsOunces,
    gramsToPounds,
    humanizeDuration,
    properName,
  } from "./puppy-data-utils.js";
  import type { PuppyData } from "./puppy-data-utils.js";

  const dateFmt = { ...DateTime.DATETIME_SHORT, timeZoneName: "short" };

  export let title: string = "The puppies";

  let puppyData: PuppyData;
  let puppyAge: string = "...";
  let weightIndex: number = 0;
  let weightDate: string = "...";
  let weightDateRel: string = "...";
  let checkDate: string = "...";

  $: {
    // console.log("PuppyDetails data update?", $dataStore);
    puppyData = $dataStore.puppyData;

    if (puppyData) {
      const { weights } = puppyData.dogs[0];

      updateAge();

      weightIndex = weights.length - 1;
      const date = weights[weightIndex][0];
      weightDate = date.toLocaleString(dateFmt);
      weightDateRel = date.toRelative();
    }

    if ($dataStore.lastChecked) {
      checkDate = $dataStore.lastChecked.toLocaleString(dateFmt);
    }
  }

  function updateAge() {
    if (puppyData) {
      const { birthdate } = puppyData.dogs[0];
      puppyAge = humanizeDuration(birthdate.diffNow());
    }
  }

  onMount(() => {
    // Every half-hour, see if we need to update the "age" text.
    const interval = setInterval(updateAge, 30 * 1000);
    return () => {
      clearInterval(interval);
    };
  });
</script>

<h3>{title}</h3>
<!-- <p>All puppies were born on Wednesday, January 13, 2021.</p> -->
<p>The puppies are {puppyAge} old.</p>

<table>
  <thead>
    <tr>
      <th>nickname</th>
      <th>collar</th>
      <th>sex</th>
      <!-- <th>color</th> -->
      <th>weight</th>
    </tr>
  </thead>
  <tbody>
    {#if puppyData}
      {#each puppyData.dogs as dog}
        <tr class={dog.collar}>
          <td>{dog.nickname}</td>
          <td>{dog.collar}</td>
          <td>{dog.sex}</td>
          <!-- <td>{dog.color}</td> -->
          <td
            ><b
              >{formatPoundsOunces(
                gramsToPounds(dog.weights[weightIndex][1])
              )}</b
            >
            ({dog.weights[weightIndex][1]}g)</td
          >
        </tr>
      {/each}
    {/if}
  </tbody>
</table>
<p class="note first">
  Weight measured at {weightDate}.
</p>
<p class="note">
  Checked for updates at {checkDate}.
</p>

<style type="scss">
  tr {
    & > * {
      text-align: left;
    }

    & > :nth-child(n + 2) {
      padding-left: 0.5rem;
    }

    & > td:nth-child(n + 2) {
      font-size: 80%;
    }

    & > td:nth-child(1) {
      font-weight: 600;
    }

    & > :nth-child(3) {
      text-align: center;
    }

    /*& > :nth-child(4) {
      text-align: center;
    }*/
  }

  th {
    /* font-weight: 400; */
    font-size: 80%;
  }

  /*.note {
    margin: 0;
    font-size: 80%;
    font-style: italic;
    color: hsl(0, 0%, 50%);
  }*/

  .note.first {
    margin-top: 0.5em;
  }
</style>

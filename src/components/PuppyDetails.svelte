<script lang="ts">
  import { DateTime } from "luxon";
  import puppyData, { gramsToOunces, properName } from "./puppy-data.js";

  const dateFmt = { ...DateTime.DATETIME_SHORT, timeZoneName: "short" };

  const stdWeights = puppyData.dogs[0].weights;
  const weightIndex = stdWeights.length - 1;

  const weightDate = stdWeights[weightIndex][0].toLocaleString(dateFmt);
</script>

<p>All puppies were born on Wednesday, January 13, 2021.</p>

<table>
  <thead>
    <tr>
      <th>name</th>
      <th>sex</th>
      <th>color</th>
      <th>weight</th>
    </tr>
  </thead>
  <tbody>
    {#each puppyData.dogs as dog}
      <tr class={dog.collar}>
        <td>{properName(dog)}</td>
        <td>{dog.sex}</td>
        <td>{dog.color}</td>
        <td
          ><b>{gramsToOunces(dog.weights[weightIndex][1]).toFixed(1)}oz</b>
          ({dog.weights[weightIndex][1]}g)</td
        >
      </tr>
    {/each}
  </tbody>
</table>
<p class="note">
  Weight listed is the most-recent measurement, as of {weightDate}.
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
      font-size: 84%;
    }

    & > td:nth-child(1) {
      font-weight: bold;
    }

    & > :nth-child(2) {
      text-align: center;
    }

    // & > :nth-child(4) {
    //   text-align: center;
    // }
  }

  th {
    font-weight: 600;
  }

  .note {
    margin: 0.5em 0 0;
    font-size: 80%;
    font-style: italic;
    color: hsl(0, 0%, 50%);
  }
</style>

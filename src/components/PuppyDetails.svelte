<script lang="ts">
  // import x from "./puppy-data.yaml";
  // import x from "./puppy-data.json";
  import data, {gramsToOunces} from "./puppy-data.js";

  // console.log("GOT DATA", data );
</script>

<p>All puppies were born on Wednesday, January 13, 2021.</p>

<table>
  <thead>
    <tr>
      <th>collar</th>
      <th>sex</th>
      <th>color</th>
      <th>weight</th>
    </tr>
  </thead>
  <tbody>
    {#each data.dogs as {collar, sex, color, birthweight}}
    <tr class="{collar}">
      <td>{collar}</td>
      <td>{sex}</td>
      <td>{color}</td>
      <td>{gramsToOunces(birthweight).toFixed(1)}oz ({birthweight}g)</td>
    </tr>
    {/each}
  </tbody>
</table>
<p class="note">Weight listed is weight at birth.</p>

<style type="scss">
  tr {
    & > * {
      text-align: left;
    }

    & > :nth-child(n + 2) {
      padding-left: 0.5em;
    }

    & > td:nth-child(1) {
      text-transform: capitalize;
    }

    & > :nth-child(2) {
      text-align: center;
    }

    // & > :nth-child(4) {
    //   text-align: center;
    // }
  }
  .note {
    margin-top: 0.5em;
    font-size: 80%;
    font-style: italic;
    color: hsl(0, 0%, 50%);
  }
</style>

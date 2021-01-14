<script lang="ts">
</script>

<style>
    tr > * { 
        text-align: left;
    }

    tr > :nth-child(n+2) {
        padding-left: 0.5em;
    }

    tr > :nth-child(2) {
        text-align: center;
    }

    tr > :nth-child(4) {
        text-align: center;
    }

    .note {
        margin-top: 0.5em;
        font-size: 80%;
        font-style: italic;
        color: hsl(0, 0%, 50%);
    }

    .blue {
        color: hsl(220, 80%, 50%);
    }
    .red {
        color: hsl(0, 80%, 50%);
    }
    .yellow {
        color: hsl(60, 80%, 45%);
    }
    .white {
        color: hsl(0, 0%, 70%);
    }
    .green {
        color: hsl(100, 80%, 30%);
    }
    .pink-purple {
        color: hsl(320, 80%, 70%);
    }
</style>

<p>All puppies were born on Wednesday, January 13, 2021.</p>

<table>
    <thead>
        <tr>
            <th>collar</th>
            <th>sex</th>
            <th>color</th>
            <th>weight (oz)</th>
        </tr>
    </thead>
    <tbody>
        <tr class="blue">
            <td>Blue</td>
            <td>F</td>
            <td>Red &amp; White</td>
            <td>8.2</td>
        </tr>
        <tr class="red">
            <td>Red</td>
            <td>M</td>
            <td>Red &amp; White</td>
            <td>7.2</td>
        </tr>
        <tr class="yellow">
            <td>Yellow</td>
            <td>F</td>
            <td>Red &amp; White</td>
            <td>7.2</td>
        </tr>
        <tr class="white">
            <td>White</td>
            <td>F</td>
            <td>Red &amp; White</td>
            <td>7.9</td>
        </tr>
        <tr class="green">
            <td>Green</td>
            <td>M</td>
            <td>Red &amp; White</td>
            <td>8.1</td>
        </tr>
        <tr class="pink-purple">
            <td>Pink/Purple</td>
            <td>F</td>
            <td>Tri-colored</td>
            <td>7.6</td>
        </tr>
    </tbody>
</table>
<p class="note">Weight listed is weight at birth.</p>

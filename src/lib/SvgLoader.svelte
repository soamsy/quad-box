<script>
  import { SHAPES } from "./constants"
</script>

<span id="svg-loader">
  <svg style="display: none;">
    <defs>
      {#each Object.keys(SHAPES) as shape (shape)}
      <g id="{shape}">
        <path d={SHAPES[shape]} />
      </g>
      {/each}
    </defs>
  </svg>
</span>
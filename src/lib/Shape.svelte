<script>
export let shapeName = ''
export let shapeOuterColor = ''

</script>

<div class="shape" style="background-color: {shapeOuterColor};">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 110" class="{shapeName.includes('heart') ? 'w-[100%] h-[95%]' : 'w-[80%] h-[80%]'}">
    <use href="#{shapeName}" />
  </svg>
</div>

<style>
  .shape {
    @apply w-full h-full flex items-center justify-center;
  }
</style>
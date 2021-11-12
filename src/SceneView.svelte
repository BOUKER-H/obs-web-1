<script>
  export let isStudioMode;
  export let transitionScene;
</script>

<div class="columns is-centered is-vcentered has-text-centered">
  {#if isStudioMode}
    <div class="fomreDiv">
      <img id="preview" class="is-hidden has-background-dark" alt="Preview" />
    </div>
    <div class="column is-narrow">
      <button on:click={transitionScene} class="button is-fullwidth is-info">Transition</button>
    </div>
  {/if}
  <div class="fomreDiv">
    <img id="program" alt="Program" class="is-hidden"/>
  </div>
</div>

<style>

  .fomreDiv{
    display: inline-flex;
    width: 80%;
    border: 2px solid DeepSkyBlue;border-radius: 5px;
    align-items: center;
  }

  </style>
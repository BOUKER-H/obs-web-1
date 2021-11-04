<script>
  import { Col, Container, Row } from 'sveltestrap';

  let sceneViews = [{name:'view 1',nameObs : '[V][3D1]'},{name:'view 2',nameObs : '[V][3D2]'},{name:'view 3',nameObs : '[V][3D3]'},{name:'view 4',nameObs : '[V][3D4]'}];
  let sceneContents = [{name:'content view',nameObs : '[V][Content1]'}];
  let currentViewScene = false;
  let currentViewPreviewScene = false;

</script>
<Container>
  <Row>
  {#each sceneViews as sceneView}
    <!-- <div class="tile" style="display: inline-flex;padding-right: 20px;"> -->
      <Col xs="3">
      {#if currentViewScene == sceneView.name}
        <a class=" is-child is-primary notification">
          <p class="title has-text-centered is-size-6-mobile">{sceneView.name}</p>
        </a>
      {:else if currentViewPreviewScene == sceneView.name}
        <a on:click={() => {let aux = currentViewScene; currentViewScene = currentViewPreviewScene; currentViewPreviewScene = aux;}} class="is-child is-warning notification">
          <p class="title has-text-centered is-size-6-mobile">{sceneView.name}</p>
        </a>
      {:else}
        <a on:click={() => {currentViewPreviewScene = sceneView.name } } class="is-child is-info notification">
          <p class="title has-text-centered is-size-6-mobile">{sceneView.name}</p>
        </a>
      {/if}
      </Col>

    <!-- </div> -->
  {/each}
  {#each sceneContents as sceneContent}
    <!-- <div class="tile" style="display: inline-flex;padding-right: 20px;"> -->
    <Col>
      {#if currentViewScene == sceneContent.name}
        <a class=" is-child is-primary notification">
          <p class="title has-text-centered is-size-6-mobile">{sceneContent.name}</p>
        </a>
      {:else if currentViewPreviewScene == sceneContent.name}
        <a on:click={() => {let aux = currentViewScene; currentViewScene = currentViewPreviewScene; currentViewPreviewScene = aux;}} class="is-child is-warning notification">
          <p class="title has-text-centered is-size-6-mobile">{sceneContent.name}</p>
        </a>
      {:else}
        <a on:click={() => {currentViewPreviewScene = sceneContent.name } } class="is-child is-info notification">
          <p class="title has-text-centered is-size-6-mobile">{sceneContent.name}</p>
        </a>
      {/if}
    </Col>
    <!-- </div> -->
  {/each}
  </Row>
  </Container>





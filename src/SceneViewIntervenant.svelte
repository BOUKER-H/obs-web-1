<script>
  import { Col, Container, Row , Button } from 'sveltestrap';

  let sceneViews = [
    { name: 'view 1', nameObs: '[V][3D1]' },
    { name: 'view 2', nameObs: '[V][3D2]' },
    { name: 'view 3', nameObs: '[V][3D3]' },
    { name: 'view 4', nameObs: '[V][3D4]' },
  ];
  let sceneContents = [{ name: 'content view', nameObs: '[V][Content1]' }];
  let currentViewScene = false;
  let currentViewPreviewScene = false;
</script>
<!-- svelte-ignore a11y-missing-attribute -->
<div class="fomreDiv">
  <div style="align-items: center;width: 80px ;">3D Views: </div>
  <div class="fomreDivFlex" style="justify-content: space-between;    width: 100%;">
    
    {#each sceneViews as sceneView , i}
      <div  style="width: 150px;"> 
        {#if currentViewScene == sceneView.name}
          <!-- svelte-ignore a11y-missing-attribute -->
          <!-- <Button outline light>{sceneView.name}</Button> -->
          <a             on:click={() => {
             console.log("view1")
          }}>>
            <img src="../image/view1.png" class="buttonImg">
            <p class="titleView">{sceneView.name}</p>
          </a>

        {:else if currentViewPreviewScene == sceneView.name}
          <!-- svelte-ignore a11y-missing-attribute -->
          <a 
            on:click={() => {
              let aux = currentViewScene;
              currentViewScene = currentViewPreviewScene;
              currentViewPreviewScene = aux; console.log("view2")
            }}>
            <img src="../image/view2.png" class="buttonImg">
            <p class="titleView">{sceneView.name}</p>
          </a>
<!--           <Button 
          on:click={() => {
            let aux = currentViewScene;
            currentViewScene = currentViewPreviewScene;
            currentViewPreviewScene = aux;
          }}
          outline success>{sceneView.name}</Button> -->
        {:else}
          <!-- svelte-ignore a11y-missing-attribute -->
          <a 
            on:click={() => {
              currentViewPreviewScene = sceneView.name; console.log("view3")
            }}>
            <img src="../image/view3.png" class="buttonImg">
            <p class="titleView">{sceneView.name}</p>
          </a>
<!--           <Button
            on:click={() => {
              currentViewPreviewScene = sceneView.name;
            }}
          outline primary>{sceneView.name}</Button> -->
        {/if}
      </div>
    {/each}
  </div>

</div>
<div class="fomreDiv fomreDivFlex" style="width: auto;">
  <div>Content Views: </div>
    {#each sceneContents as sceneContent , j}
    <div  > 
      <!-- <div class="tile" style="display: inline-flex;padding-right: 20px;"> -->
        {#if currentViewScene == sceneContent.name}
          <!-- svelte-ignore a11y-missing-attribute -->
          <Button outline light>{sceneContent.name}</Button>

        {:else if currentViewPreviewScene == sceneContent.name}
          <!-- svelte-ignore a11y-missing-attribute -->
          <Button 
          on:click={() => {
            let aux = currentViewScene;
            currentViewScene = currentViewPreviewScene;
            currentViewPreviewScene = aux;
          }}
          outline success>{sceneContent.name}</Button>
        {:else}
          <!-- svelte-ignore a11y-missing-attribute -->
          <Button
            on:click={() => {
              currentViewPreviewScene = sceneContent.name;
            }}
          outline primary>{sceneContent.name}</Button>
        {/if}
      <!-- </div> -->
      <p>view {j+1}</p>
    </div>
  {/each}
</div>

<style>
.fomreDivFlex{
  display: inline-flex;
  align-items: center;
}
.fomreDiv{
  padding:5px 15px 5px 15px ;
  display: inline-flex;
  width: 80%;
  border: 2px solid DeepSkyBlue;border-radius: 5px;
  align-items: center;
}
.buttonImg {border:0;background:transparent url("../img/button.png") no-repeat 0 0;}
.buttonImg:hover {background:transparent url("../img/button-hover.png") no-repeat 0 0;}
.titleView {
  text-align: center !important;
  margin: 0;
  padding: 0;
  color: #363636;
  font-weight: 600;
  line-height: 0.25;
}
</style>
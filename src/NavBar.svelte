<script>
  import { mdiFullscreen, mdiFullscreenExit, mdiBorderVertical, mdiArrowSplitHorizontal, mdiAccessPoint, mdiAccessPointOff, mdiRecord, mdiStop, mdiPause, mdiPlayPause } from '@mdi/js';
  import Icon from 'mdi-svelte';

  export let sendCommand;
  export let connected;
  export let disconnect;
  export let heartbeat;
  export let isStudioMode;
  export let errorMessage;
  export let isFullScreen;
  export let toggleFullScreen;

  let isSceneOnTop ;
  let activeVirtualCam = false;

  async function stopStream() {
    await sendCommand('StopStreaming');
  }

  async function startStream() {
    await sendCommand('StartStreaming');
  }

  async function StartVirtualCamera() {
    let data = await sendCommand('StartVirtualCam');
    console.log('StartVirtualCam et ' + data.status);
    if (data.status) {
      activeVirtualCam = true;
    } else {
      activeVirtualCam = false;
    }
    console.log('activeVirtualCam =' + activeVirtualCam);
  }

  async function StopVirtualCamera() {
    let data = await sendCommand('StopVirtualCam');
    console.log('StopVirtualCamera et ' + data.status);
    if (data.status == 'ok') {
      activeVirtualCam = false;
    } else {
      activeVirtualCam = true;
    }
    console.log('activeVirtualCam =' + activeVirtualCam);
  }

  async function resumeRecording(){
    await sendCommand('ResumeRecording');
  }

  async function pauseRecording(){
    await sendCommand('PauseRecording');
  }

  async function stopRecording() {
    await sendCommand('StopRecording');
  }

  async function startRecording() {
    await sendCommand('StartRecording');
  }

  async function toggleStudioMode() {
    await sendCommand('ToggleStudioMode');
  }

  async function switchSceneView() {
    isSceneOnTop = !isSceneOnTop;
  }




</script>

<nav class="navbar is-primary" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item is-size-4 has-text-weight-bold" href="/">
      <img src="incept.png" alt="incept-video-web" class="rotate" />
      &nbsp; incept-video-web
    </a>

    <!-- svelte-ignore a11y-missing-attribute -->
    <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navmenu">
      <span aria-hidden="true" />
      <span aria-hidden="true" />
      <span aria-hidden="true" />
    </a>
  </div>

  <div id="navmenu" class="navbar-menu">
    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <!-- svelte-ignore a11y-missing-attribute -->
          {#if connected}
            <a class="button is-info is-light" disabled>
              {#if heartbeat}
                {Math.round(heartbeat.stats.fps)} fps, {Math.round(heartbeat.stats['cpu-usage'])}% CPU, {heartbeat.stats['output-skipped-frames']} skipped frames
              {:else}Connected{/if}
            </a>
            {#if heartbeat && heartbeat.streaming}
              <a class="button is-danger" on:click={stopStream}>
                <span class="icon">
                  <Icon path={mdiAccessPointOff} />
                </span>
                <span>
                  Stop stream ({heartbeat.totalStreamTime} secs)
                </span>
              </a>
            {:else}
              <a class="button is-danger" on:click={startStream}>
                <span class="icon">
                  <Icon path={mdiAccessPoint} />
                </span>
                <span> Start stream </span>
              </a>
            {/if}
            {#if activeVirtualCam}
              <a class="button is-danger" on:click={StopVirtualCamera}>
                <span class="icon">
                  <Icon path={mdiAccessPointOff} />
                </span>
                <span>Stop virtual camera</span>
              </a>
            {:else}
              <a class="button is-danger" on:click={StartVirtualCamera}>
                <span class="icon">
                  <Icon path={mdiAccessPoint} />
                </span>
                <span> Start virtual camera </span>
              </a>
            {/if}
            {#if heartbeat && heartbeat.recording}
              {#if heartbeat.recordingPaused}
                <a class="button is-danger" on:click={resumeRecording}>
                  <span class="icon">
                    <Icon path={mdiPlayPause} />
                  </span>
                  <span> Resume recording </span>
                </a>
              {:else}
              <a class="button is-danger" on:click={pauseRecording}>
                <span class="icon">
                  <Icon path={mdiPause} />
                </span>
                <span> Pause recording </span>
              </a>
              {/if}
              <a class="button is-danger" on:click={stopRecording}>
                <span class="icon">
                  <Icon path={mdiStop} />
                </span>
                <span>
                  Stop recording ({heartbeat.totalRecordTime} secs)
                </span>
              </a>
              {:else}
              <a class="button is-danger" on:click={startRecording}>
                <span class="icon">
                  <Icon path={mdiRecord} />
                </span>
                <span> Start recording </span>
              </a>
            {/if}
            <a class="button is-danger is-light" on:click={disconnect}>Disconnect</a>
            <a class:is-light={!isStudioMode} class="button is-link" on:click={toggleStudioMode} title="Toggle Studio Mode">
              <span class="icon">
                <Icon path={mdiBorderVertical} />
              </span>
            </a>
            <a class:is-light={!isSceneOnTop} class="button is-link" on:click={switchSceneView} title="Show Scene on Top">
              <span class="icon">
                <Icon path={mdiArrowSplitHorizontal} />
              </span>
            </a>
          {:else}
            <a class="button is-danger" disabled>{errorMessage || 'Not connected'}</a>
          {/if}
          <!-- svelte-ignore a11y-missing-attribute -->
          <a class:is-light={!isFullScreen} class="button is-link" on:click={toggleFullScreen} title="Toggle Fullscreen">
            <span class="icon">
              <Icon path={isFullScreen ? mdiFullscreenExit : mdiFullscreen} />
            </span>
          </a>
        </div>
      </div>
    </div>
  </div>
</nav>

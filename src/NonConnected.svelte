<script>
  export let documentLocation;
  export let hostkey;
  export let host;
  export let connect;
</script>

<h1 class="subtitle">
  Welcome to
  <strong>video-web</strong>
  the easiest way to control
  <a href="https://incept.tn/" target="_blank">EventZoo</a>
  remotely!
</h1>

{#if documentLocation.protocol === 'https:'}
  <div class="notification is-danger">
    You are checking this page on a secure HTTPS connection. That's great, but it means you can
    <strong>only</strong>
    connect to WSS (secure websocket) hosts, for example OBS exposed with
    <a href="https://ngrok.com/">ngrok</a>
    or
    <a href="https://pagekite.net/">pagekite</a>
    . If you want to connect to a local OBS instance,
    <strong>
      <a href="http://{documentLocation.hostname}{documentLocation.port ? ':' + documentLocation.port : ''}{documentLocation.pathname}">
        please click here to load the non-secure version of this page
      </a>
    </strong>
    .
  </div>
{/if}

<p>To get started, enter your OBS host below and click "connect".</p>

<div class="field is-grouped">
  <p class="control is-expanded">
    <input id="host" on:keyup={hostkey} bind:value={host} class="input" type="text" placeholder="localhost:4440" />
  </p>
  <p class="control">
    <button on:click={connect} class="button is-success">Connect</button>
  </p>

</div>
<p class="help">
  Make sure that the
  <a href="https://github.com/Palakis/obs-websocket/releases" target="_blank">obs-websocket plugin</a>
  is installed and enabled.
</p>


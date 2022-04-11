<script>
    const OBS_WEBSOCKET_LATEST_VERSION = '4.8.0'; // https://api.github.com/repos/Palakis/obs-websocket/releases/latest
  
    // Imports
    import { onMount } from 'svelte';
    import './style.scss';
    import { mdiFullscreen, mdiFullscreenExit, mdiBorderVertical, mdiArrowSplitHorizontal, mdiAccessPoint, mdiAccessPointOff, mdiRecord, mdiStop, mdiPause, mdiPlayPause } from '@mdi/js';
    import Icon from 'mdi-svelte';
    import compareVersions from 'compare-versions';
  
    // Import OBS-websocket
    import OBSWebSocket from 'obs-websocket-js';
    const obs = new OBSWebSocket();
    // Import use CSS
    import { Col, Container, Row } from 'sveltestrap';
  
    // Import local components
    import SceneView from './SceneView.svelte';
    import NonConnected from './NonConnected.svelte';
    import NavBar from './NavBar.svelte';
    import SceneViewIntervenant from './SceneViewIntervenant.svelte';
  
    onMount(async () => {
      if ('serviceWorker' in navigator) {
        console.log("serviceWorker in navigator");
        navigator.serviceWorker.register('/service-worker.js');
      }
  
      // Request screen wakelock
      if ('wakeLock' in navigator) {
        try {
          wakeLock = await navigator.wakeLock.request('screen');
            // Re-request when coming back
            document.addEventListener('visibilitychange', async () => {
              if (document.visibilityState === 'visible') {
                wakeLock = await navigator.wakeLock.request('screen');
              }
            });
        }
        catch(e) { }
      }
  
      // Listen for fullscreen changes
      document.addEventListener('fullscreenchange', () => {
        isFullScreen = document.fullscreenElement;
      });
  
      document.addEventListener('webkitfullscreenchange', () => {
        isFullScreen = document.webkitFullscreenElement;
      });
  
      document.addEventListener('msfullscreenchange', () => {
        isFullScreen = document.msFullscreenElement;
      });
  
      // Hamburger menu
      const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
      if ($navbarBurgers.length > 0) {
        $navbarBurgers.forEach(el => {
          el.addEventListener('click', () => {
            const target = document.getElementById(el.dataset.target);
            el.classList.toggle('is-active');
            target.classList.toggle('is-active');
          });
        });
      }
  
      if (document.location.hash !== '') {
        // Read host from hash
        host = document.location.hash.slice(1);
        await connect();
      }
    });
  
    // State
  
    let connected,
      heartbeat,
      currentScene,
      currentPreviewScene,
      isFullScreen,
      isStudioMode,
      wakeLock = false;
  
    let scenes = [];
    let host,
      password,
      errorMessage = '';
    let scenePopulates = [];
    // variable sceneInterveants and Hosts
    let sceneIntervenants = [];
    let sceneModerators = [];
  
    let nameSourceActiveForScreenShot = false;
  
  
    function toggleFullScreen() {
      if (isFullScreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
          document.documentElement.msRequestFullscreen();
        }
      }
    }
  
  
  
  
  
    // OBS functions
    async function sendCommand(command, params) {
      try {
        return await obs.send(command, params || {});
      } catch (e) {
        console.log('Error sending command', command, ' - error is:', e);
        return {};
      }
    }
  

  
    async function connect() {
      console.log(" function connect");
      host = host || 'localhost:4440';
      console.log("host");
      console.log(host);
      console.log("location");
      console.log(location);
      let secure = location.protocol === 'http:' || host.endsWith(':443');
      console.log("secure");
      console.log(secure);
      if (host.indexOf('://') !== -1) {
        let url = new URL(host);
        secure = url.protocol === 'obsws:' || url.protocol === 'http:';
        host = url.hostname + ':' + (url.port ? url.port : secure ? 443 : 80);
      }
      console.log('Connecting to:', host, '- secure:', secure, '- using password:', password);
      await disconnect();
      connected = false;
      try {
        await obs.connect({ address: host, password, secure });
      } catch (e) {
        console.log(e);
        errorMessage = e.description;
      }
    }
  
    async function disconnect() {
      await obs.disconnect();
      connected = false;
      errorMessage = 'Disconnected';
    }
  
    async function hostkey(event) {
      if (event.key !== 'Enter') return;
      await connect();
      event.preventDefault();
    }
  
    // OBS events
    obs.on('ConnectionClosed', () => {
      connected = false;
      window.history.pushState('', document.title, window.location.pathname + window.location.search); // Remove the hash
      console.log('Connection closed');
    });
  
    obs.on('AuthenticationSuccess', async () => {
      console.log('Connected');
      connected = true;
      document.location.hash = host; // For easy bookmarking
      const version = (await sendCommand('GetVersion')).obsWebsocketVersion || '';
      console.log('OBS-websocket version:', version);
      if (compareVersions(version, OBS_WEBSOCKET_LATEST_VERSION) < 0) {
        alert('You are running an outdated OBS-websocket (version ' + version + '), please upgrade to the latest version for full compatibility.');
      }
      await sendCommand('SetHeartbeat', { enable: true });
      await getStudioMode();
      await updateScenes();
      await getScreenshot();
      await getScreenShotSourcesAdd();
      document.querySelector('#program').classList.remove('is-hidden');
    });
  
    obs.on('AuthenticationFailure', async () => {
      password = prompt('Please enter your password:', password);
      if (password === null) {
        connected = false;
        password = '';
      } else {
        await connect();
      }
    });
  
    // Heartbeat
    obs.on('Heartbeat', (data) => {
      heartbeat = data;
    });
  
    // Scenes
    obs.on('SwitchScenes', async (data) => {
      console.log(`New Active Scene: ${data.sceneName}`);
      await updateScenes();
    });
  
    obs.on('error', err => {
      console.error('Socket error:', err);
    });
  
    obs.on('StudioModeSwitched', async (data) => {
      console.log(`Studio Mode: ${data.newState}`);
      isStudioMode = data.newState;
      if (!isStudioMode) {
        currentPreviewScene = false;
      } else {
        await updateScenes();
      }
    });
  
    obs.on('PreviewSceneChanged', async(data) => {
      console.log(`New Preview Scene: ${data.sceneName}`);
      await updateScenes();
    });
  
    // declaration function
  
  
    </script>
  
  <svelte:head>
    <title>incept-video-web - control video from anywhere</title>
  </svelte:head>
  
   <NavBar sendCommand={sendCommand} connected={connected} disconnect={disconnect} heartbeat={heartbeat} isStudioMode={isStudioMode} 
    errorMessage={errorMessage} isFullScreen={isFullScreen} toggleFullScreen={toggleFullScreen} />
  
  <section class="section">
    <div class="container">
      {#if connected}
         <!--  <SceneView isStudioMode={isStudioMode} transitionScene={transitionScene}/> -->
        <!--   <SceneViewIntervenant /> -->
  
  
      {:else}
      <NonConnected documentLocation={document.location} hostkey={hostkey} host={host} connect={connect}/>
      {/if}
    </div>
  
  </section>
  
  
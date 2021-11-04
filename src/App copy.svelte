<script>
  // 22-09-2021 // pc travail
  const OBS_WEBSOCKET_LATEST_VERSION = '4.8.0'; // https://api.github.com/repos/Palakis/obs-websocket/releases/latest
  // Imports ajouter
  //import FilePond, { registerPlugin, supported } from 'svelte-filepond';
  //import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
  //import resolve from 'rollup-plugin-node-resolve';
  //import commonjs from '@rollup-plugin-commonjs';
  import Button from 'svelte-atoms/Button.svelte';
  // Imports
  import { onMount } from 'svelte';
  //require('register-svelte-require')(require('svelte'))
  //const uppie = new Uppie();
  //const grandiose = new Grandiose();
  //import grandiose from 'grandiose';
  //import * as jsx from '../grandiose/index.js';
  //import bindings from 'bindings.js';
  //import  compile from './support.js';

  import { Col, Row, Container } from 'sveltestrap';
  import './style.scss';
  import {
    mdiFullscreen,
    mdiFullscreenExit,
    mdiBorderVertical,
    mdiArrowSplitHorizontal,
    mdiAccessPoint,
    mdiAccessPointOff,
    mdiRecord,
    mdiStop,
    mdiPause,
    mdiPlayPause,
  } from '@mdi/js';
  import Icon from 'mdi-svelte';
  import compareVersions from 'compare-versions';
  //import {Page, Navbar, BlockTitle, List, ListItem, ListItemCell , Range, Block} from 'framework7-svelte';
  //import {f7ready} from 'framework7-svelte';
  // Import OBS-websocket
  import OBSWebSocket from 'obs-websocket-js';
  const obs = new OBSWebSocket();

  // Import local components
  import SceneView from './SceneView.svelte';

  /* import { log } from 'node:console';
   */
  //import CustomButton from './CustomButton.svelte';
  //import AddIntervenant from './AddIntervenant.svelte';
  //import Item from './BeerItem.svelte';
  //import Dropdown from 'sv-bootstrap-dropdown';
  //import JSONTree from 'svelte-json-tree'
  //const fs = require('fs');

  let dropdownTrigger;

  async function AddIntervenants() {
    let addModerInter = false;
    if (visibleHost) {
      for (let i = 0; i < sceneModerators.length; i++) {
        if (!sceneModerators[i].sources[0].render && !addModerInter) {
          addModerInter = true;
          await SetVisibleGroupe(sceneModerators[i].name, sceneModerators[i].sources[0].name);
          //sceneModerators[i].sources[0].groupChildren = await updateSources(sceneModerators[i].sources[0].groupChildren);
          updateScenes();
        }
      }
      visibleHost ;
      wantToAddInterModerator = false;
    }

    if (visibleSpeaker) {
      for (let i = 0; i < sceneIntervenants.length; i++) {
        if (!sceneIntervenants[i].sources[0].render && !addModerInter) {
          addModerInter = true;
          await SetVisibleGroupe(sceneIntervenants[i].name, sceneIntervenants[i].sources[0].name);
          //sceneIntervenants[i].sources[0].groupChildren = await updateSources(sceneIntervenants[i].sources[0].groupChildren)
          updateScenes();
        }
      }
      visibleSpeaker = false;
      wantToAddInterModerator = false;
    }
  }

  async function DeleteIntervenant() {
    console.log('DeleteIntervenant');
    for (let i = 0; i < sceneModerators.length; i++) {
      if (sceneModerators[i].name == nameIntervenantActive) {
        await SetInVisibleGroup(sceneModerators[i].name, sceneModerators[i].sources[0].name);
        await SetInVisibleGroup(sceneModerators[i].name, sceneModerators[i].sources[0].groupChildren[0].video.sourceName);
        await SetInVisibleGroup(sceneModerators[i].name, sceneModerators[i].sources[0].groupChildren[0].ndi.sourceName);
        await SetInVisibleGroup(sceneModerators[i].name, sceneModerators[i].sources[0].groupChildren[0].browser.sourceName);
        var sourceVideo = await GetSourceDefaultSettings(sceneModerators[i].sources[0].groupChildren[0].video.sourceType);
        var sourceNdi = await GetSourceDefaultSettings(sceneModerators[i].sources[0].groupChildren[0].ndi.sourceType);
        var sourceBrowser = await GetSourceDefaultSettings(sceneModerators[i].sources[0].groupChildren[0].browser.sourceType);
        await sendCommand('SetSourceSettings', { sourceName: sceneModerators[i].sources[0].groupChildren[0].browser.sourceName, sourceSettings: sourceVideo.defaultSettings });
        await sendCommand('SetSourceSettings', { sourceName: sceneModerators[i].sources[0].groupChildren[0].browser.sourceName, sourceSettings: sourceNdi.defaultSettings });
        await sendCommand('SetSourceSettings', { sourceName: sceneModerators[i].sources[0].groupChildren[0].browser.sourceName, sourceSettings: sourceBrowser.defaultSettings });
        nameIntervenantActive = false;
        for (let i = 0; i < saveSourcesFiltresArray.length; i++) {
          let dataChroma = await sendCommand('SetSourceFilterSettings', { sourceName: nameSourceFilterActivite, filterName: saveSourcesFiltresArray[i].name, filterSettings: saveSourcesFiltres[i].settings });
          let dataHide   = await sendCommand('SetSourceFilterVisibility', { sourceName: nameSourceFilterActivite, filterName: saveSourcesFiltresArray[i].name, filterEnabled: false });
        }
        updateScenes();
      }
    }

    for (let i = 0; i < sceneIntervenants.length; i++) {
      if (sceneIntervenants[i].name == nameIntervenantActive) {
        await SetInVisibleGroup(sceneIntervenants[i].name, sceneIntervenants[i].sources[0].name);
        await SetInVisibleGroup(sceneIntervenants[i].name, sceneIntervenants[i].sources[0].groupChildren[0].video.sourceName);
        await SetInVisibleGroup(sceneIntervenants[i].name, sceneIntervenants[i].sources[0].groupChildren[0].ndi.sourceName);
        await SetInVisibleGroup(sceneIntervenants[i].name, sceneIntervenants[i].sources[0].groupChildren[0].browser.sourceName);
        var sourceVideo = await GetSourceDefaultSettings(sceneIntervenants[i].sources[0].groupChildren[0].video.sourceType);
        var sourceNdi = await GetSourceDefaultSettings(sceneIntervenants[i].sources[0].groupChildren[0].ndi.sourceType);
        var sourceBrowser = await GetSourceDefaultSettings(sceneIntervenants[i].sources[0].groupChildren[0].browser.sourceType);
        await sendCommand('SetSourceSettings', { sourceName: sceneIntervenants[i].sources[0].sourceName, sourceSettings: sourceVideo.defaultSettings });
        await sendCommand('SetSourceSettings', { sourceName: sceneIntervenants[i].sources[0].sourceName, sourceSettings: sourceNdi.defaultSettings });
        await sendCommand('SetSourceSettings', { sourceName: sceneIntervenants[i].sources[0].sourceName, sourceSettings: sourceBrowser.defaultSettings });
        nameIntervenantActive = false;
        updateScenes();
      }
    }

    selectModeratotr = false;
    selectIntervenant = false;
    showTransform = false;
  }

  function logAfficher(word) {
    console.log(word);
    if (word == 'custom') {
      console.log(true);
    } else {
      console.log(false);
    }
  }

  onMount(async () => {
    if ('serviceWorker' in navigator) {
      console.log('serviceWorker in navigator');
      navigator.serviceWorker
        .register('/service-worker.js', { scope: './sw-test/' })
        .then((reg) => {
          // registration worked
          console.log('Registration succeeded. Scope is ' + reg.scope);
        })
        .catch((error) => {
          // registration failed
          console.log('Registration failed with ' + error);
        });
    }
    // Request screen wakelock
    if ('wakeLock' in navigator) {
      console.log('wakeLock in navigator');
      try {
        wakeLock = await navigator.wakeLock.request('screen');
        // Re-request when coming back
        document.addEventListener('visibilitychange', async () => {
          if (document.visibilityState === 'visible') {
            wakeLock = await navigator.wakeLock.request('screen');
          }
        });
      } catch (e) {}
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
      $navbarBurgers.forEach((el) => {
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
  //
  let timeStampsForImg = new Date().getTime();

  let activeVirtualCam = false;
  let handleFiltreCropChroma = [true, true];
  let sourceNamegetScreenshotModeOrInt = 'Scene All';
  let wantToAddInterModerator = false;
  let choiseSourceInterModer = false;
  let showScreenInterOrModer = false;
  let selectedSourcesBVN;
  let selectModeratotr = false;
  let selectIntervenant = false;
  let selectPopulate = -1;
  let showPopulates = false;
  let scenePopulates = [];
  let namePopulates = [];
  let selectModeratotrForPopulalte = -1;
  let selectIntervenantForPopulalte = -1;
  let nameInterforPopulateActive = false;

  let AllSourceMedImg = [];
  let selectMedImgForPopulalte = false;
  
  let showTransform = false;
  let transformObj = {
    position: { x: 0, y: 0 },
    size: { x: 1920, y: 1080 },
    crop: { left: 0, right: 0, top: 0, bottom: 0 },
    rotation: 0,
    scale: { x: 1, y: 1 },
  };
  let a = 5;
  let sourcesModerators = [],
    sourcesIntervenants = [];

  let sourceVolume = {
    muted: false,
    name: '',
    volume: 1,
  };

  let answer = '';
  let nameSourceActive = false;
  let nameIntervenantActive = false,
    nameModeratorActive;
  let sceneIntervenants = [],
    sceneModerators = [];
  let visibilitys = false,
    visibilityFiltre,
    visibilityFiltreChromaKey,
    visibilityFiltreCrop,
    nameSourceFilterActivite;
  let visibilityFiltreModerator = false;
  let saveSourcesFiltres = [
    {
      enabled: false,
      name: 'Chroma Key',
      settings: {
        key_color_type: 'green',
        key_color: 4278255360, //'#00ff00'
        similarity: 400,
        smoothness: 80,
        spill: 100,
        opacity: 1,
        contrast: 0,
        brightness: 0,
        gamma: 0,
      },
      type: 'chroma_key_filter_v2',
    },
    {
      enabled: false,
      name: 'Crop/Pad',
      settings: {
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
      },
      type: 'crop_filter',
    },
  ];
  let activeFiltreForModerator = false;
  let saveSourcesFiltresArray = [
    {
      enabled: false,
      name: 'Chroma Key',
      type: 'chroma_key_filter_v2',
      settings: {
        key_color_type: {
          courant: 'green',
          value: ['green', 'blue', 'magenta', 'custom'],
          key_color: '#00ff00',
        },
        similarity: { courant: 400, max: 1000, min: 1, step: 1 },
        smoothness: { courant: 80, max: 1000, min: 1, step: 1 },
        spill: { courant: 100, max: 1000, min: 1, step: 1 },
        opacity: { courant: 1, max: 1, min: 0, step: 0.0001 },
        contrast: { courant: 0, max: 4, min: -4, step: 0.01 },
        brightness: { courant: 0, max: 1, min: -1, step: 0.0001 },
        gamma: { courant: 0, max: 1, min: -1, step: 0.01 },
      },
    },
    {
      enabled: false,
      name: 'Crop/Pad',
      type: 'crop_filter',
      settings: {
        bottom: { courant: 0, max: 9888, min: -9888, step: 1 },
        left: { courant: 0, max: 9888, min: -9888, step: 1 },
        right: { courant: 0, max: 9888, min: -9888, step: 1 },
        top: { courant: 0, max: 9888, min: -9888, step: 1 },
      },
    },
  ];
  let tabColors = ['Green', 'blue', 'magenta', 'custom'],
    selectedTabColor,
    selectedColor = '#4d40ff';
  const valuesSettingsCourant = (valuesSettings) => valuesSettings.courant;
  const valuesSettingsValue = (valuesSettings) => valuesSettings.value;
  // State
  let connected,
    visibleHost = false,
    visibleSpeaker = false;

  let visibleBrowser = false,
    nameBrowser = 'Browser',
    valueBrowser,
    CanncelSourceBrowserActive,
    sourceBrowserActive = {
      source: '',
      css: 'body { background-color: rgba(0, 0, 0, 0); margin: 0px auto; overflow: hidden; }',
      fps: 30,
      fps_custom: false,
      width: 600,
      height: 800,
      is_local_file: false,
      reroute_audio: false,
      restart_when_active: false,
      shutdown: false,
      source: '',
      url: '',
    },
    DefaultSourceBrowserActive = {
      css: 'body { background-color: rgba(0, 0, 0, 0); margin: 0px auto; overflow: hidden; }',
      fps: 30,
      fps_custom: false,
      width: 600,
      height: 800,
      is_local_file: false,
      reroute_audio: false,
      restart_when_active: false,
      shutdown: false,
      source: '',
      url: '',
    };
  let visibleNDI = true,
    nameNDI = 'NDI',
    valueNDI,
    visibleVideo = false,
    nameVideoCaptureDevice = 'Video Capture Device',
    valueVideoCaptureDevice,
    heartbeat,
    currentScene,
    currentPreviewScene,
    isFullScreen,
    isStudioMode,
    isSceneOnTop, // scene
    wakeLock = false;
  let scenes = [];
  let varSources = {};
  let moderators = [];
  let host,
    password,
    addModer = 0,
    addInter = 0,
    errorMessage = '';
  let getAudioActive;
  let getSourcesAudios = [];
  let hasAudio = [
      'audio_line',
      'browser_source',
      'ffmpeg_source',
      'gain_filter',
      'noise_suppress_filter',
      'noise_suppress_filter_v2',
      'invert_polarity_filter',
      'noise_gate_filter',
      'compressor_filter',
      'limiter_filter',
      'expander_filter',
      'ndi_source',
      'ndi_audiofilter',
      'vst_filter',
      'dshow_input',
      'wasapi_input_capture',
      'wasapi_output_capture',
    ];
    let AllScenesAudio = [],
    nameSceneAudioActive = '' ;
    let selectedAudio,
    chooseSourceAudioActive = true,
    sceneAudio = [],
    sceneAllAudio = [],
    sceneSourceNdiAudios = [],
    sceneSourceInAudios = [],
    sceneSourceOutAudios = [],
    nameSourceAudioActive,
    valueAudioSources = {};
    let inputSourceNdiAudio = '',
      inputSourceInAudio = '',
      inputSourceOutAudio = '',
      inputSourceAudio = '',
      checkVisibleNdiAudio = false,
      checkVisibleInAudio = false,
      checkVisibleOutAudio = false,
      erreurChoiseSourceAudio = false,
      choiseSourceAudio = false,
      inputSourcNdiInOutAudio = '';

  let sceneSourceImages = [],
    sceneSourceMedias = [],
    sceneSourceMeIm = [],
    selectedMedImg,
    checkVisibleMedia = false,
    checkVisibleImage = false,
    inputSourceImage = '',
    inputSourceMedia = '',
    inputSourceMedImg = '',
    erreurChoiseSourceMeIm = false,
    choiseSourceMeIm = false;
  let showScreenSourcesAdd = false;
  let nameSourceMedImgActive = false;
  let showTransformSourceMedImg = false;
  let nameSceneMedImgActive = '';

  //Math.ceil() function always rounds a number up to the next largest integer.
  ///////////////////////////////////
  async function GetSourceDefaultSettings(SourceKind) {
    let data = await sendCommand('GetSourceDefaultSettings', { sourceKind: SourceKind });
    //console.log("GetSourceDefaultSettings");
    if (data.status != 'ok') {
      console.log(data);
    }
    return data;
  }

  async function GetSourcesList() {
    let data = await sendCommand('GetSourcesList');
    console.log('GetSourcesList');
    console.log(data);
    return data.sources;
  }



  async function CreateScene(sceneName) {
    let data = await sendCommand('CreateScene', { sceneName: sceneName });
    console.log('CreateScene');
    console.log(data);
  }

  async function DefaultAllSources() {
    let data = await GetSourcesList();
    nameIntervenantActive = false;
    nameSourceActive = false;
    selectModeratotr = false;
    selectIntervenant = false;
    showTransform = false;
    activeVirtualCam = false;
    visibleHost = false;
    visibleSpeaker = false;
    choiseSourceAudio = false;
    chooseSourceAudioActive = true;
    checkVisibleMedia = false;
    checkVisibleImage = false;
    showPopulates = false ;
    addInter = 0;
    addModer = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i].typeId != 'group') {
        var source = await GetSourceDefaultSettings(data[i].typeId);
        await sendCommand('SetSourceSettings', { sourceName: data[i].name, sourceSettings: source.defaultSettings });
      }
    }
    for (let i = 0; i < sceneAudio.length; i++) {
      var source = await GetSourceDefaultSettings(sceneAudio[i].type);
      await sendCommand('SetSourceSettings', { sourceName: sceneAudio[i].name, sourceSettings: source.defaultSettings });
    }
    for (let i = 0; i < sceneSourceImages.length; i++) {
      var source = await GetSourceDefaultSettings(sceneSourceImages[i].type);
      await sendCommand('SetSourceSettings', { sourceName: sceneSourceImages[i].name, sourceSettings: { ...source.defaultSettings, ...{ local_file: '' } } });
    }

    for (let i = 0; i < sceneSourceMedias.length; i++) {
      var source = await GetSourceDefaultSettings(sceneSourceMedias[i].type);
      await sendCommand('SetSourceSettings', { sourceName: sceneSourceMedias[i].name, sourceSettings: { ...source.defaultSettings, ...{ local_file: '' } } });
    }

    for (let i = 0; i < sceneModerators.length; i++) {
      console.log("Chroma Key Mod ".concat(i+1));
      let dataChroma = await sendCommand('SetSourceFilterSettings', { sourceName: sceneModerators[i].sources[0].name, filterName: "Chroma Key Mod ".concat(i+1), filterSettings: saveSourcesFiltres[0].settings });
      let dataCrop   = await sendCommand('SetSourceFilterSettings', { sourceName: sceneModerators[i].sources[0].name, filterName: "Crop/Pad Mod ".concat(i+1), filterSettings: saveSourcesFiltres[1].settings });
      let dataChromaHide   = await sendCommand('SetSourceFilterVisibility', { sourceName: sceneModerators[i].sources[0].name, filterName: "Chroma Key Mod ".concat(i+1), filterEnabled: false });
      let dataCropHide   = await sendCommand('SetSourceFilterVisibility', { sourceName: sceneModerators[i].sources[0].name, filterName: "Crop/Pad Mod ".concat(i+1), filterEnabled: false });
    }

    if((sceneSourceImages.length + sceneSourceMedias.length) != 0){
      SetInVisibleGroup("AllSourceMedImg", nameSceneMedImgActive)
      nameSceneMedImgActive = "AddSource ".concat(Number(nameSceneMedImgActive.slice(10))+1);
      let data0 = await sendCommand('CreateSource', { sceneName: "AllSourceMedImg", sourceName: nameSceneMedImgActive, sourceKind: "scene", setVisible: true });
      console.log(data0)
    }

    if((sceneSourceNdiAudios.length + sceneSourceInAudios.length + sceneSourceOutAudios.length) != 0){
      SetInVisibleGroup("AllScenesAudio", nameSceneAudioActive)
      console.log(Number(nameSceneAudioActive.slice(9)));
      nameSceneAudioActive = "AddAudio ".concat(Number(nameSceneAudioActive.slice(9))+1);
      let data0 = await sendCommand('CreateSource', { sceneName: "AllScenesAudio", sourceName: nameSceneAudioActive, sourceKind: "scene", setVisible: true });
      console.log(nameSceneAudioActive)
      console.log(data0)
    }
    updateInvisibleAllGroup();
  }

  async function updateInvisibleAllGroup() {
    console.log('updateInvisibleAllGroup');

    for (let i = 0; i < sceneModerators.length; i++) {
      if (sceneModerators[i].sources[0].name) {
          console.log(sceneModerators[i].sources[0].name);

          await SetInVisibleGroup(sceneModerators[i].name, sceneModerators[i].sources[0].name);
          await SetInVisibleGroup(sceneModerators[i].name, sceneModerators[i].sources[0].groupChildren[0].video.sourceName);
          await SetInVisibleGroup(sceneModerators[i].name, sceneModerators[i].sources[0].groupChildren[0].ndi.sourceName);
          await SetInVisibleGroup(sceneModerators[i].name, sceneModerators[i].sources[0].groupChildren[0].browser.sourceName);
      }
    }

    for (let i = 0; i < sceneIntervenants.length; i++) {
      if (sceneIntervenants[i].sources[0].name) {
          await SetInVisibleGroup(sceneIntervenants[i].name, sceneIntervenants[i].sources[0].name);
          await SetInVisibleGroup(sceneIntervenants[i].name, sceneIntervenants[i].sources[0].groupChildren[0].video.sourceName);
          await SetInVisibleGroup(sceneIntervenants[i].name, sceneIntervenants[i].sources[0].groupChildren[0].ndi.sourceName);
          await SetInVisibleGroup(sceneIntervenants[i].name, sceneIntervenants[i].sources[0].groupChildren[0].browser.sourceName);
      }
    }

    for (let i = 0; i < scenePopulates.length; i++) {
      for (let j = 0; j < scenePopulates[i].sources.length; j++) {
        await SetInVisibleGroup(scenePopulates[i].name, scenePopulates[i].sources[j].name);
      }
    }

    for (let i = 0; i < sceneAudio.length; i++) {
      await SetInVisibleGroup(nameSourceAudioActive, sceneAudio[i].name);
    }

    for (let i = 0; i < sceneSourceImages.length; i++) {
      await SetInVisibleGroup(nameSceneMedImgActive, sceneSourceImages[i].name);
    }

    for (let i = 0; i < sceneSourceMedias.length; i++) {
      await SetInVisibleGroup(nameSceneMedImgActive, sceneSourceMedias[i].name);
    }

    for (let i = 0; i < sceneSourceNdiAudios.length; i++) {
      await SetInVisibleGroup(nameSourceAudioActive, sceneSourceNdiAudios[i].name);
    }

    for (let i = 0; i < sceneSourceInAudios.length; i++) {
      await SetInVisibleGroup(nameSourceAudioActive, sceneSourceInAudios[i].name);
    }

    for (let i = 0; i < sceneSourceOutAudios.length; i++) {
      await SetInVisibleGroup(nameSourceAudioActive, sceneSourceOutAudios[i].name);
    }
    updateScenes();

  }

  ///////////////////////////
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

  async function toggleStudioMode() {
    await sendCommand('ToggleStudioMode');
  }

  async function switchSceneView() {
    isSceneOnTop = !isSceneOnTop;
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

  ///////////////////////30-09//////////////////////////
  /*   async function sendCallbackCommand(command, params) {
      
      try {
        return obs.sendCallback(command,params||{});
      } catch (e) {
        console.log('Error sending command', command, ' - error is:', e);
        return {};
      }
    } */
  /////////////////////////////////////////////////////

  async function setScene(e) {
    await sendCommand('SetCurrentScene', { 'scene-name': e.currentTarget.textContent });
    console.log('SetCurrentScene');
  }

  async function transitionScene(e) {
    await sendCommand('TransitionToProgram');
  }

  async function setPreview(e) {
    await sendCommand('SetPreviewScene', { 'scene-name': e.currentTarget.textContent });
  }

  async function startStream() {
    await sendCommand('StartStreaming');
  }

  async function stopStream() {
    await sendCommand('StopStreaming');
  }

  ////////////////////30-09/////////////////////////
  async function GetStreamSettings() {
    console.log('GetStreamSettings');
    let data = await sendCommand('GetStreamSettings');
    console.log(data);
  }

  async function SetStreamSettings() {
    console.log('SetStreamSettings');
    let data = await sendCommand('SetStreamSettings');
    console.log(data);
  }

  async function GetStreamingStatus() {
    let data = await sendCommand('GetStreamingStatus');
    console.log('GetStreamingStatus');
    console.log(data);
  }

  async function GetVideoInfo() {
    let data = await sendCommand('GetVideoInfo');
    console.log('GetVideoInfo');
    console.log(data);
  }

  async function StreamStatus() {
    console.log('StreamStatus');
    let data = await sendCommand('StreamStatus');
    console.log(data);
  }
  //////////////////////////////////////////////
  async function startRecording() {
    await sendCommand('StartRecording');
  }

  async function stopRecording() {
    await sendCommand('StopRecording');
  }

  async function pauseRecording() {
    await sendCommand('PauseRecording');
  }

  async function resumeRecording() {
    await sendCommand('ResumeRecording');
  }
  / /; /////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////

  async function SetSourceSettings() {
    await sendCommand('SetSourceSettings', { sourceName: 'NDI™ Source Moderator 1', sourceSettings: { ndi_source_name: 'DESKTOP-ALPHA (OBS (Test))' } });
    console.log('SetSourceSettings');
  }

  async function GetSourceSettings(sourceName) {
    let data = await sendCommand('GetSourceSettings', { sourceName: sourceName });
    console.log('GetSourceSettings');
    console.log(data);
  }

  async function GetTextGDIPlusProperties() {
    let data = await sendCommand('GetTextGDIPlusProperties', { source: 'Text (Intervenant 1 - Video).1' });
    console.log('GetTextGDIPlusProperties');
    console.log(data);
  }

  async function GetSceneTransitionOverride() {
    let data = await sendCommand('GetSceneTransitionOverride', { sceneName: '[IN] Moderator (Camera Source + Chroma)' });
    console.log('GetSceneTransitionOverride');
    console.log(data);
  }

  async function GetSourcesAudio() {
    console.log('GetSourcesAudio');
    let arraySourceAudio = [];
    let dataSource = await sendCommand('GetSourcesList');
    for (let i = 0; i < dataSource.sources.length; i++) {
      let index = hasAudio.findIndex((typeId) => typeId == dataSource.sources[i].typeId);
      if (index != -1) {
        let dataAudio = await sendCommand('GetAudioActive', { sourceName: dataSource.sources[i].name });
        if (dataAudio.audioActive == true) {
          arraySourceAudio.push(dataSource.sources[i]);
        }
      }
    }
    getSourcesAudios = arraySourceAudio;
    await GetSourceActive();
    await GetVolumeSourceAudio();
    await GetMuteSourceAudio();
  }

  /////////////////// 22-09 ////////////////////////////

  async function SetPositionInterModer() {
    console.log('SetPositionInterModer');
    for (let i = 0; i < scenePopulates.length; i++) {
      var index = namePopulates.findIndex((name) => '[ns]' + name.name == scenePopulates[i].name);
      //if (index != -1) {
      for (let j = 0; j < scenePopulates[i].sources.length; j++) {
        if (namePopulates[index].conncet == scenePopulates[i].sources[j].name) {
          await sendCommand('SetSceneItemRender', { 'scene-name': scenePopulates[i].name, source: scenePopulates[i].sources[j].name, render: true });
        } else {
          await sendCommand('SetSceneItemRender', { 'scene-name': scenePopulates[i].name, source: scenePopulates[i].sources[j].name, render: false });
        }
      }
      //}
    }
    selectModeratotrForPopulalte = -1;
    selectIntervenantForPopulalte = -1;
    selectMedImgForPopulalte = false;

    showPopulates = false;
    selectPopulate = -1;
  }

  async function ListOutputs() {
    let data = await sendCommand('ListOutputs');
    console.log('ListOutputs');
    console.log(data);
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

  async function StopVirtualCameraInDepart() {
    await sendCommand('StopVirtualCam');
  }

  async function StartStopVirtualCam() {
    let data = await sendCommand('StartStopVirtualCam');
    console.log('StartStopVirtualCam');
    console.log(data);
  }
  /////////////////////23-09///////////////////////////

  async function SetSceneItemPosition(nameScene, nameSource, X, Y) {
    console.log('SetSceneItemPosition');
    let data = await sendCommand('SetSceneItemPosition', { 'scene-name': nameScene, item: nameSource, x: X, y: Y });
    console.log(data);
  }

  async function SetSceneItemTransform(nameScene, nameSource, xScale, yScale, Rotation) {
    let data = await sendCommand('SetSceneItemTransform', { 'scene-name': nameScene, item: nameSource, 'x-scale': xScale, 'y-scale': yScale, rotation: Rotation });
    console.log('SetSceneItemTransform');
    console.log(data);
  }

  async function SetTransformScale(nameScene, nameSource, X, Y) {
    console.log('SetSceneItemProperties');
    console.log(nameScene + ' ' + nameSource);
    let data = await sendCommand('SetSceneItemProperties', { sceneName: nameScene, item: { name: nameSource }, scale: { x: X, y: Y } });
  }

  async function SetTransformBounds(nameScene, nameSource, X, Y) {
    console.log('SetSceneItemProperties');
    console.log(nameScene + ' ' + nameSource);
    let data = await sendCommand('SetSceneItemProperties', { sceneName: nameScene, item: { name: nameSource }, scale: { x: X, y: Y } });
  }

  async function SetTransformCrop(nameScene, nameSource, Left, Right, Top, Bottom) {
    console.log('SetTransformCrop');
    console.log(nameScene + ' ' + nameSource);
    let data = await sendCommand('SetSceneItemProperties', { 'scene-name': nameScene, item: { name: nameSource }, crop: { bottom: Bottom, left: Left, right: Right, top: Top } });
  }

  async function SetSceneItemCrop(nameScene, nameSource, Left, Right, Top, Bottom) {
    console.log('SetSceneItemCrop');
    console.log(nameScene + ' ' + nameSource);
    let data = await sendCommand('SetSceneItemCrop', { 'scene-name': nameScene, item: nameSource, bottom: Bottom, left: Left, right: Right, top: Top });
  }

  ////////////////////////////////////////////////
  async function SetSourceSettingsNDI(sourceName, ndi_source_name) {
    await sendCommand('SetSourceSettings', { sourceName: sourceName, sourceSettings: { ndi_source_name: ndi_source_name } });
    console.log('SetSourceSettings NDI');
  }



  async function SetSourceSettingsLocked(sourceName, locked) {
    await sendCommand('SetSourceSettings', { sourceName: sourceName, sourceSettings: { ndi_source_name: ndi_source_name } });
    console.log('SetSourceSettings Locked');
  }

  async function SetSourceSettingsVideo(sourceName, video) {
    await sendCommand('SetSourceSettings', { sourceName: sourceName, sourceSettings: { last_video_device_id: video, ndi_source_name: video, video_device_id: video } });
    console.log('SetSourceSettings Video');
    await updateScenes();
  }

  async function SetSourceSettingsBrowserVariable(SourceName, SourceSettingsVariable) {
    console.log('SetSourceSettings BrowserVariable');
    let data = await sendCommand('SetSourceSettings', { sourceName: SourceName, sourceSettings: SourceSettingsVariable });
    console.log(data);
  }

  async function SetSourceSettingsBrowserCanncel() {
    console.log('SetSourceSettings BrowserCanncel');
    await sendCommand('SetSourceSettings', { sourceName: sourceBrowserActive.source, sourceSettings: CanncelSourceBrowserActive });
    sourceBrowserActive = JSON.parse(JSON.stringify(CanncelSourceBrowserActive));
    CanncelSourceBrowserActive = JSON.parse(JSON.stringify(CanncelSourceBrowserActive));
  }

  async function SetSourceSettingsBrowserDefault() {
    console.log('SetSourceSettings BrowserCanncel');
    await sendCommand('SetSourceSettings', { sourceName: sourceBrowserActive.source, sourceSettings: DefaultSourceBrowserActive });
    sourceBrowserActive = JSON.parse(JSON.stringify(DefaultSourceBrowserActive));
  }

  async function DeleteSceneItem(sceneName , sourceName , id ) {
    console.log('DeleteSceneItem');
    let data3 = await sendCommand('DeleteSceneItem', { scene: sceneName, item: { name: sourceName} });
    console.log(data3);
  }

  async function DuplicateSceneItem(FromScene , ToScene ,sourceName , id ) {
    console.log('DuplicateSceneItem');
    let data1 = await sendCommand('DuplicateSceneItem', { fromScene: "SceneB1", toScene : "SceneB2", item: { Group1: {name: "Bouker2"}}});
    let data2 = await sendCommand('DuplicateSceneItem', { fromScene: "SceneB1", toScene : "Group", item: { name: "Bouker2" } });
    //let data3 = await sendCommand('DuplicateSceneItem', { fromScene: FromScene, toScene : ToScene, item: { name: sourceName, id: id } });
    //console.log(data1);
    console.log(data2);
    //console.log(data3);
  }

  async function SceneItemRemoved() {
    console.log('SceneItemRemoved');
    let data1 = await sendCommand('SceneItemRemoved', { 'scene-name': "SceneB1", 'item-name' : "Bouker2", 'item-id': 9});
    let data2 = await sendCommand('SceneItemRemoved', { 'scene-name': "SceneB2", 'item-name' : "Bouker2", 'item-id': 9});
    console.log(data1);
    console.log(data2);
  }
  
  async function SourceDestroyed() {
    console.log('SourceDestroyed');
    //let data1 = await sendCommand('SourceDestroyed', { sourceName: sourceName , sourceType : sourceType,  sourceKind : sourceKind });
    let data1 = await sendCommand('SourceDestroyed', { sourceName: "Bouker2" , sourceType : "input",  sourceKind : "browser_source" });
    console.log(data1);
  }

  async function GetSourceFilters(name) {
    console.log('GetSourceFilters');
    let data = await sendCommand('GetSourceFilters', { sourceName: name });
    return data.filters;
  }



  async function SetSourceFilterSettingsCrop(sourceName, name, settings) {
    console.log('SetSourceFilterSettingsCrop '+sourceName);
    let valueMod = {};
    if (name.indexOf('Crop/Pad') != -1) {
      valueMod = { bottom: settings.bottom.courant, left: settings.left.courant, right: settings.right.courant, top: settings.top.courant };
    } else {
      valueMod = {
        key_color_type: settings.key_color_type.courant,
        key_color: hexToAndroid(settings.key_color_type.key_color),
        similarity: settings.similarity.courant,
        smoothness: settings.smoothness.courant,
        spill: settings.spill.courant,
        opacity: settings.opacity.courant,
        contrast: settings.contrast.courant,
        brightness: settings.brightness.courant,
        gamma: settings.gamma.courant,
      };
    }
    await sendCommand('SetSourceFilterSettings', { sourceName: sourceName, filterName: name, filterSettings: valueMod });
  }

  async function SetSourceFilterVisibility(source) {
    console.log('SetSourceFilterVisibility = '+nameSourceFilterActivite+"   "+source.name);
    await sendCommand('SetSourceFilterVisibility', { sourceName: nameSourceFilterActivite, filterName: source.name, filterEnabled: !source.enabled });
  }

  /////////////////////24-09///////////////////////////

  async function SourceCreated() {
    await sendCommand('SourceCreated', { sourceName: 'boukerhhhhh', sourceType: 'mp4', sourceKind: 'mp4' });
    console.log('SourceCreated');
  }

  async function SetSourceName() {
    await sendCommand('SetSourceName', { sourceName: 'NDI™ Source Moderator 1', newName: 'bouker' });
    console.log('SetSourceName');
  }

  async function RefreshBrowserSource() {
    let data = await sendCommand('RefreshBrowserSource', { sourceName: 'Browser Int 1' });
    console.log('RefreshBrowserSource');
    //console.log(data);
  }

  async function GetBrowserSourceProperties(name) {
    let data = await sendCommand('GetBrowserSourceProperties', { source: name });
    console.log('GetBrowserSourceProperties');
    console.log(data);
  }

  async function GetVolumeForSource() {
    let data = await sendCommand('GetVolume', { source: 'Audio Input Capture' });
    console.log('GetVolume');
    console.log(data);
    sourceVolume.name = data.name;
    sourceVolume.muted = data.muted;
    sourceVolume.volume = data.volume;
  }

  async function GetAudioTracks() {
    //let data = await sendCommand('GetAudioTracks');
    let data = await sendCommand('GetAudioTracks', { source: 'Browser Mod 1' });
    console.log('GetAudioTracks');
    console.log(data);
  }

  async function GetSourceActive() {
    console.log('GetSourceActive');
    for (let i = 0; i < getSourcesAudios.length; i++) {
      let data0 = await sendCommand('GetSourceActive', { sourceName: getSourcesAudios[i].name });
      getSourcesAudios[i].sourceActive = data0.sourceActive;
/*       if (data0.sourceActive) {
        console.log(getSourcesAudios[i].name);
      } */
    }
  }

  async function GetMuteSourceAudio() {
    console.log('GetMute');
    for (let i = 0; i < getSourcesAudios.length; i++) {
      let data = await sendCommand('GetMute', { source: getSourcesAudios[i].name });
      getSourcesAudios[i].muted = data.muted;
    }
  }

  async function GetVolumeSourceAudio() {
    console.log('GetVolume');
    for (let i = 0; i < getSourcesAudios.length; i++) {
      let data = await sendCommand('GetVolume', { source: getSourcesAudios[i].name });
      getSourcesAudios[i].volume = data.volume;
    }
  }

  async function SetMuteSourceAudio(SourceName, Value) {
    console.log('SetMute');
    let data = await sendCommand('SetMute', { source: SourceName, mute: Value });
    console.log(data);
  }

  async function SetVolumeSourceAudio(SourceName, Value) {
    console.log('SetVolume');
    let data = await sendCommand('SetVolume', { source: SourceName, volume: Value });
    console.log(data);
  }

  async function GetAudioMonitorType() {
    let data = await sendCommand('GetAudioMonitorType', { sourceName: 'Browser Mod 1' });
    let data0 = await sendCommand('GetAudioMonitorType', { sourceName: 'Audio Input Capture' });
    console.log('GetAudioMonitorType');
    console.log(data);
    console.log(data0);
  }

  async function GetAudioActive(SourceName) {
    let data = await sendCommand('GetAudioActive', { sourceName: SourceName });
    console.log('GetAudioActive');
    console.log(data);
  }

  async function SetVolumeForSource() {
    let name = sourceVolume.name;
    let muted = sourceVolume.muted;
    let volume = sourceVolume.volume;
    await sendCommand('SetVolume', { source: 'Audio Input Capture', volume: 0.25, useDecibel: true });
    await sendCommand('SetVolume', { source: 'Audio Input Capture', volume: 0.5, muted: true });
    console.log('SetVolume');
    //console.log(data);
  }

  async function SaveReplayBuffer() {
    let data = await sendCommand('SaveReplayBuffer');
    console.log('SaveReplayBuffer');
    console.log(data);
  }

  async function SetBrowserSourceProperties() {
    await sendCommand('SetBrowserSourceProperties', { source: 'Browser', url: 'NDI™ Source Moderator 1' });
    console.log('SetBrowserSourceProperties');
  }

  async function setNDI(e) {
    await sendCommand('SetCurrentScene', { 'scene-name': e.currentTarget.textContent });
    console.log('SetCurrentScene');
  }

  async function getStudioMode() {
    let data = await sendCommand('GetStudioModeStatus');
    isStudioMode = (data && data.studioMode) || false;
  }

  /////////////////////////////////////////////////
  async function OpenProjector() {
    let data = await sendCommand('OpenProjector', { source: 'Browser Mod 5', type: 'StudioProgram' });
    console.log('OpenProjector');
    console.log(data);
  }

  async function GetMediaSourcesList() {
    let data = await sendCommand('GetMediaSourcesList');
    console.log('GetMediaSourcesList');
    console.log(data);
  }
  /////////////////////////////////////////////////
  async function SetBrowserSourcePropertiesData(data) {
    await sendCommand('SetBrowserSourceProperties', data);
    console.log('SetBrowserSourceProperties');
    console.log(data);
  }

  async function FGetSceneItemProperties(nameScene , name) {
    console.log('FGetSceneItemProperties');
    let data = await sendCommand('GetSceneItemProperties', { 'scene-name' : nameScene , item: { name: name } });
    console.log(data);
  }

  async function GetSceneItemPropertiesFunction(nameScene, name) {
    console.log('GetSceneItemProperties');
    console.log(nameScene + ' ' + name);
    let data = await sendCommand('GetSceneItemProperties', { sceneName: nameScene, item: { name: name } });
    console.log(data);
    return data;
  }

  async function FFGetSceneItemProperties() {
    console.log('e.currentTarget.textContent');
    let data = await sendCommand('GetSceneItemProperties', { sceneName: 'Intervenant 1', item: { name: 'Browser Int 1' } });
    console.log('GetSceneItemProperties');
    console.log(data);
  }

  async function SetInVisibleGroup(nameScene, name) {
    let data = await sendCommand('SetSceneItemProperties', { 'scene-name': nameScene, item: { name: name }, visible: false, locked: false });
    //console.log("SetInVisibleGroup");
  }

  async function SetVisibleGroupe(nameScene, name) {
    console.log('SetVisibleGroupe');
    console.log(nameScene + '   ' + name);
    let data = await sendCommand('SetSceneItemProperties', { 'scene-name': nameScene, item: { name: name }, visible: true, locked: true });
    console.log(data);
  }

  async function ResetSceneItem(nameScene, name) {
    console.log('ResetSceneItem');
    console.log(nameScene + ' ' + name);
    let data = await sendCommand('ResetSceneItem', { 'scene-name': nameScene, item: { name: name } });
    //let data = await sendCommand('ResetSceneItem', { 'scene-name' : nameScene } );
    console.log(data);
  }

  /////////////////////////////////////////////////



  async function SetSourceVisibleLocked(nameScene, nameSources, name) {
    console.log('SetSourceVisibleLocked');
    nameSourceActive = JSON.parse(JSON.stringify(name));
    await sendCommand('SetSceneItemProperties', { 'scene-name': nameScene, item: { name: nameSources.browser.sourceName }, visible: false, locked: false });
    await sendCommand('SetSceneItemProperties', { 'scene-name': nameScene, item: { name: nameSources.ndi.sourceName }, visible: false, locked: false });
    await sendCommand('SetSceneItemProperties', { 'scene-name': nameScene, item: { name: nameSources.video.sourceName }, visible: false, locked: false });
    await sendCommand('SetSceneItemProperties', { 'scene-name': nameScene, item: { name: name }, visible: true, locked: true });
  }

  async function ChargeSourceBrowserActive(sourceName) {
    let data0 = await sendCommand('GetSourceSettings', { sourceName: sourceName });
    console.log('ChargeSourceBrowserActive');
    let data = data0.sourceSettings;
    sourceBrowserActive.source = sourceName;
    if (data.fps) {
      sourceBrowserActive.fps = JSON.parse(JSON.stringify(data.fps));
    }
    if (data.fps_custom) {
      sourceBrowserActive.fps_custom = JSON.parse(JSON.stringify(data.fps_custom));
    }
    if (data.width) {
      sourceBrowserActive.width = JSON.parse(JSON.stringify(data.width));
    }
    if (data.height) {
      sourceBrowserActive.height = JSON.parse(JSON.stringify(data.height));
    }
    if (data.is_local_file) {
      sourceBrowserActive.is_local_file = JSON.parse(JSON.stringify(data.is_local_file));
    }
    if (data.reroute_audio) {
      sourceBrowserActive.reroute_audio = JSON.parse(JSON.stringify(data.reroute_audio));
    }
    if (data.restart_when_active) {
      sourceBrowserActive.restart_when_active = JSON.parse(JSON.stringify(data.restart_when_active));
    }
    if (data.shutdown) {
      sourceBrowserActive.shutdown = JSON.parse(JSON.stringify(data.shutdown));
    }
    if (data.url) {
      sourceBrowserActive.url = JSON.parse(JSON.stringify(data.url));
    }
    DefaultSourceBrowserActive.source = sourceName;
    CanncelSourceBrowserActive = JSON.parse(JSON.stringify(data0.sourceSettings));
    //CanncelSourceBrowserActive.source = sourceName;
  }
  /////////////////////Audio //////////////////////////////////
  async function CreateSourceAudio(nameSource, KindSource, valueSource, visible) {
    console.log('CreateSourceAudio');
    console.log(nameSourceAudioActive);
    console.log(nameSource);
    console.log(valueSource);
    let data = await sendCommand('CreateSource', { sceneName: nameSourceAudioActive, sourceName: nameSource, sourceKind: KindSource, sourceSettings: valueSource, setVisible: visible });
    console.log(data);
    if (data && data.status == 'ok') {
      await updateScenes();
      //choiseSourceMeIm = false;
      inputSourceNdiAudio = '';
      inputSourceInAudio = '';
      inputSourceOutAudio = '';
      checkVisibleNdiAudio = false;
      checkVisibleInAudio = false;
      checkVisibleOutAudio = false;
      //choiseSourceAudio = false;
    } else {
      erreurChoiseSourceAudio = true;
    }
  }

  async function SetSourceAudioVisibleLocked(nameScene, nameSource, selectedAudio) {
    console.log('SetSourceAudioVisibleLocked');
    nameSourceAudioActive = nameSource;
    for (let i = 0; i < sceneAudio.length; i++) {
      if (sceneAudio[i].name == nameSource) {
        await sendCommand('SetSceneItemProperties', { 'scene-name': nameScene, item: { name: nameSource }, visible: true, locked: true });
      } else {
        await sendCommand('SetSceneItemProperties', { 'scene-name': nameScene, item: { name: sceneAudio[i].name }, visible: false, locked: false });
      }
    }
  }

  async function SetSourceAudioVisible(nameScene, nameSource, visible) {
    console.log('SetSourceAudioVisible ='+ nameScene);
    console.log('SetSourceAudioVisible ='+ nameSource);
        let data = await sendCommand('SetSceneItemProperties', { 'scene-name': nameScene, item: { name: nameSource }, visible: visible });
  }

  async function SetSourceAudioLocked(nameScene, nameSource, locked) {
    console.log('SetSourceAudioLocked = '+ nameScene +" ="+ nameSource+" ="+ locked);
        await sendCommand('SetSceneItemProperties', { 'scene-name': nameScene, item: { name: nameSource },  locked: locked });
  }

  async function SetSourceAudioMuted(SourceName, muted) {
    console.log('SetSourceAudioMuted');
    let data = await sendCommand('SetMute', { source: SourceName, mute: muted });

  }

  async function SetSourceAudio(nameSource, valueSource) {
    console.log('SetSourceAudio');
    await sendCommand('SetSourceSettings', { sourceName: nameSource, sourceSettings: { device_id: valueSource } });
  }

  async function SetSourceAudioInOut(nameSource, valueSource) {
    console.log('SetSourceAudioInOut ' + nameSource);
    let data = await sendCommand('SetSourceSettings', { sourceName: nameSource, sourceSettings: { device_id: valueSource } });
    console.log(data);
  }

  async function SetSourceAudioNDI(sourceName, ndi_source_name) {
    await sendCommand('SetSourceSettings', { sourceName: sourceName, sourceSettings: { ndi_source_name: ndi_source_name } });
    console.log('SetSourceAudioNDI NDI');
  }

  /////////////////////28-09///////////////////////////

  async function CreateSourceMediaImage(nameSource, KindSource, valueSource, visible) {
    console.log('CreateSourceMediaImage');
    let data = await sendCommand('CreateSource', { sceneName: nameSceneMedImgActive, sourceName: nameSource, sourceKind: KindSource, sourceSettings: valueSource, setVisible: visible });
    if (data && data.status == 'ok') {
      await updateScenes();
      //choiseSourceMeIm = false;
      inputSourceImage = '';
      inputSourceMedia = '';
      checkVisibleImage = false;
      checkVisibleMedia = false;
      selectedMedImg = false;
    } else {
      erreurChoiseSourceMeIm = true;
    }
  }

  async function SetSourceMediaImage(nameSource, valueSource) {
    console.log('SetSourceSettings ' + nameSource);
    let SourceSettings;
    if (nameSource.indexOf('mage') != -1) {
      SourceSettings = { file: valueSource };
      console.log('image');
    } else {
      SourceSettings = { local_file: valueSource };
      console.log('media');
    }
    let data = await sendCommand('SetSourceSettings', { sourceName: nameSource, sourceSettings: SourceSettings });
    console.log(data);
  }

  async function SetSourceMedImgLocked(nameScene, nameSource, Locked) {
    await sendCommand('SetSceneItemProperties', { 'scene-name': nameScene, item: { name: nameSource }, locked: Locked });
  }

  async function SetSourceMedImgVisible(nameScene, nameSource, Visible) {
    await sendCommand('SetSceneItemProperties', { 'scene-name': nameScene, item: { name: nameSource }, visible: Visible });
  }

  async function updateTransformSourceMedImg(seneName, sourceName) {
    console.log('updateTransformSourceMedImg');
    console.log(sourceName);
    if (sourceName) {
      showTransformSourceMedImg = true;
      let data = await sendCommand('GetSceneItemProperties', { 'scene-name': seneName, item: { name: sourceName } });
      // position
      console.log(data);
      transformObj.position.x = data.position.x;
      transformObj.position.y = data.position.y;
      // size
      transformObj.size.x = data.width;
      transformObj.size.y = data.height;
      // transform
      transformObj.rotation = data.rotation;
      transformObj.scale.x = data.scale.x;
      transformObj.scale.y = data.scale.y;
      // crop
      transformObj.crop.left = data.crop.left;
      transformObj.crop.right = data.crop.right;
      transformObj.crop.top = data.crop.top;
      transformObj.crop.bottom = data.crop.bottom;
    }
  }

  async function resetTransformSource(nameScene, nameSource) {
    console.log('resetTransformSource');
    let data = await sendCommand('SetSceneItemPosition', { 'scene-name': nameScene, item: nameSource, x: 0, y: 0 });
    let data0 = await sendCommand('SetSceneItemTransform', { 'scene-name': nameScene, item: nameSource, 'x-scale': 1, 'y-scale': 1, rotation: 0 });
    let data1 = await sendCommand('SetSceneItemCrop', { 'scene-name': nameScene, item: nameSource, bottom: 0, left: 0, right: 0, top: 0 });
    transformObj.position.x = 0;
      transformObj.position.y = 0;
      // size
      //transformObj.size.x = data.width;
      //transformObj.size.y = data.height;
      // transform
      transformObj.rotation = 0 ;
      transformObj.scale.x  = 1 ;
      transformObj.scale.y  = 1 ;
      // crop
      transformObj.crop.left = 0;
      transformObj.crop.right = 0;
      transformObj.crop.top = 0;
      transformObj.crop.bottom = 0;
    console.log(data);
    console.log(data0);
    console.log(data1);
  }

  async function SetSceneItemSize(nameScene, nameSource, Width, Height) {
    let data = await sendCommand('SetSceneItemProperties', { 'scene-name': nameScene, item: { name: nameSource }, bounds: { x: Width, y: Height } });
    console.log('SetSceneItemSize');
    console.log(data);
  }
  ////////////////////////////////////////////////
  function readTextFile(file){
    console.log("readTextFile");
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    console.log(rawFile);

    rawFile.onreadystatechange = function (){
    console.log("onreadystatechange readyState="+rawFile.readyState);

        if(rawFile.readyState === 4){
    console.log("onreadystatechange status="+rawFile.status);

            if(rawFile.status === 200 || rawFile.status == 0){
                var allText = rawFile.responseText;
                alert(allText);
            }
        }
    }
    console.log(rawFile);

    rawFile.send(null);
    console.log(rawFile);

}
  async function updateScenes() {
    console.log('updateScenes');
    var url = window.location;
    console.log("url")
    console.log(url)
    let data = await sendCommand('GetSceneList');
    currentScene = data.currentScene;
    scenes = data.scenes.filter((scene) => {
      return scene.name.indexOf('Scene ') != -1;
    });
    if (isStudioMode) {
      obs
        .send('GetPreviewScene')
        .then((data) => (currentPreviewScene = data.name))
        .catch((_) => {
          // Switching off studio mode calls SwitchScenes, which will trigger this
          // before the socket has recieved confirmation of disabled studio mode.
        });
    }
    console.log(data);
    sceneModerators = data.scenes.filter((scene) => {
      return scene.name.indexOf('Moderator') != -1;
    });

    sceneIntervenants = data.scenes.filter((scene) => {
      return scene.name.indexOf('Intervenant') != -1;
    });

    scenePopulates = data.scenes.filter((scene) => {
      return scene.name.indexOf('[ns]') != -1;
    });


    ////////////audio  /////////////
    
    AllScenesAudio = data.scenes.filter((scene) => {
      return scene.name.indexOf('AllScenesAudio') != -1;
    });

    sceneAudio = data.scenes.filter((scene) => {
      return scene.name.indexOf('audio') != -1;
    });

    sceneAudio = JSON.parse(JSON.stringify(sceneAudio[0].sources));
    await updateAudioSources();
    console.log("sceneListeAllAudio");

    let sceneListeAddAudio = data.scenes.filter((scene) => {
      return scene.name.indexOf('AddAudio') != -1;
    });
    nameSourceAudioActive = sceneListeAddAudio[sceneListeAddAudio.length-1].name ;

    await updateNdiAudioSources(sceneListeAddAudio[sceneListeAddAudio.length-1].sources);
    await updateInAudioSources(sceneListeAddAudio[sceneListeAddAudio.length-1].sources);
    await updateOutAudioSources(sceneListeAddAudio[sceneListeAddAudio.length-1].sources);
    
    ////////////media and image /////////////
    
    AllSourceMedImg = data.scenes.filter((scene) => {
      return scene.name.indexOf('AllSourceMedImg') != -1;
    });

    let sourceMediaWithImage = data.scenes.filter((scene) => {
      return scene.name.indexOf('AddSource') != -1;
    });

    nameSceneMedImgActive = sourceMediaWithImage[sourceMediaWithImage.length-1].name ;
    await updateImageSources(sourceMediaWithImage[sourceMediaWithImage.length-1].sources);
    await updateMediaSources(sourceMediaWithImage[sourceMediaWithImage.length-1].sources);
    ////////////////////////
    for (let i = 0; i < scenePopulates.length; i++) {
      let obj = {};
      obj['name'] = scenePopulates[i].name.replace('[ns]', '');
      obj['status'] = false;
      obj['conncet'] = '';
      for (let j = 0; j < scenePopulates[i].sources.length; j++) {
        if(scenePopulates[i].sources[j].render){
          console.log("scenePopulates[i].sources[j].render = "+i+"  "+j);
          obj['status'] = true;
          obj['conncet'] = scenePopulates[i].sources[j].name;
        }
      }
      namePopulates[i] = obj;
    }
    console.log("sceneModerators");

    for (let i = 0; i < sceneModerators.length; i++) {
      sceneModerators[i].id = i;
      sceneModerators[i].sources[0].groupChildren = await updateSources(sceneModerators[i]);
    }

    for (let i = 0; i < sceneIntervenants.length; i++) {
      sceneIntervenants[i].id = i;
      sceneIntervenants[i].sources[0].groupChildren = await updateSources(sceneIntervenants[i]);
    }

    GetSourcesAudio()
    console.log('Scenes updated');
  }

  async function updateSources(e ) {
    console.log("updateSources");
    let varUpdateSources = e.sources[0].groupChildren ;
    let interModer = [];
    let obj = {};
    for (let i = 0; i < varUpdateSources.length; i++) {
      if (varUpdateSources[i].type == 'browser_source') {
        obj['browser'] = await sendCommand('GetSceneItemProperties', { 'scene-name' : e.name , item: { name: varUpdateSources[i].name } });
        let data = await sendCommand('GetSourceSettings', { sourceName: varUpdateSources[i].name })
        obj.browser["sourceSettings"] = data.sourceSettings;
        obj.browser.sourceName = data.sourceName ;
        obj.browser.sourceType = data.sourceType ;
      }
      if (varUpdateSources[i].type == 'ndi_source') {
        obj['ndi'] = await sendCommand('GetSceneItemProperties', { 'scene-name' : e.name , item: { name: varUpdateSources[i].name } });
        let data = await sendCommand('GetSourceSettings', { sourceName: varUpdateSources[i].name })
        obj.ndi["sourceSettings"] = data.sourceSettings;
        obj.ndi.sourceName = data.sourceName ;
        obj.ndi.sourceType = data.sourceType ;
      }
      if (varUpdateSources[i].type == 'dshow_input') {
        obj['video'] = await sendCommand('GetSceneItemProperties', { 'scene-name' : e.name , item: { name: varUpdateSources[i].name } });
        let data = await sendCommand('GetSourceSettings', { sourceName: varUpdateSources[i].name })
        obj.video["sourceSettings"] = data.sourceSettings;
        obj.video.sourceName = data.sourceName ;
        obj.video.sourceType = data.sourceType ;
      }
    }
    interModer.push(obj);
    return interModer;
  }

  async function updateAudioSources() {
    console.log("updateAudioSources");
    for (let i = 0; i < sceneAudio.length; i++) {
      let sceneAudioSources = await sendCommand('GetSourceSettings', { sourceName: sceneAudio[i].name });
      sceneAudio[i].sourceSettings = sceneAudioSources.sourceSettings;
    }
    let objSourcesAudio = { ndi: { name: '', value: '' }, output: { name: '', value: '' }, input: { name: '', value: '' } };
    objSourcesAudio.ndi.value = sceneAudio[sceneAudio.findIndex((audios) => audios.type.includes('ndi'))].sourceSettings.ndi_source_name;
    objSourcesAudio.ndi.name = sceneAudio[sceneAudio.findIndex((audios) => audios.type.includes('ndi'))].name;
    objSourcesAudio.output.value = sceneAudio[sceneAudio.findIndex((audios) => audios.type.includes('output'))].sourceSettings.device_id;
    objSourcesAudio.output.name = sceneAudio[sceneAudio.findIndex((audios) => audios.type.includes('output'))].name;
    objSourcesAudio.input.value = sceneAudio[sceneAudio.findIndex((audios) => audios.type.includes('input'))].sourceSettings.device_id;
    objSourcesAudio.input.name = sceneAudio[sceneAudio.findIndex((audios) => audios.type.includes('input'))].name;
    valueAudioSources = JSON.parse(JSON.stringify(objSourcesAudio));
  }

  async function updateImageSources(sources) {
    console.log("updateImageSources");
    sceneSourceImages = sources.filter((image) => {
      return image.type.indexOf('image_source') != -1;
    });
    for (let i = 0; i < sceneSourceImages.length; i++) {
      let imageSources = await sendCommand('GetSourceSettings', { sourceName: sceneSourceImages[i].name });
      sceneSourceImages[i].sourceSettings = imageSources.sourceSettings;
    }
  }

  async function updateMediaSources(sources) {
    console.log('updateMediaSources');
    sceneSourceMedias = sources.filter((media) => {
      return media.type.indexOf('ffmpeg_source') != -1;
    });

    for (let i = 0; i < sceneSourceMedias.length; i++) {
      let mediaSources = await sendCommand('GetSourceSettings', { sourceName: sceneSourceMedias[i].name });
      sceneSourceMedias[i].sourceSettings = mediaSources.sourceSettings;
    }
  }

  async function updateNdiAudioSources(sources) {
    console.log("updateNdiAudioSources");
    sceneSourceNdiAudios = sources.filter((image) => {
      return image.type.indexOf('ndi_source') != -1;
    });
    for (let i = 0; i < sceneSourceNdiAudios.length; i++) {
      let imageSources = await sendCommand('GetSourceSettings', { sourceName: sceneSourceNdiAudios[i].name });
      sceneSourceNdiAudios[i].sourceSettings = imageSources.sourceSettings;
    }
    console.log(sceneSourceNdiAudios);

  }

  async function updateInAudioSources(sources) {
    console.log("updateInAudioSources");
    sceneSourceInAudios = sources.filter((image) => {
      return image.type.indexOf('wasapi_input_capture') != -1;
    });
    for (let i = 0; i < sceneSourceInAudios.length; i++) {
      let imageSources = await sendCommand('GetSourceSettings', { sourceName: sceneSourceInAudios[i].name });
      sceneSourceInAudios[i].sourceSettings = imageSources.sourceSettings;
    }
    console.log(sceneSourceInAudios);
  }

  async function updateOutAudioSources(sources) {
    console.log("updateOutAudioSources");
    sceneSourceOutAudios = sources.filter((image) => {
      return image.type.indexOf('wasapi_output_capture') != -1;
    });
    for (let i = 0; i < sceneSourceOutAudios.length; i++) {
      let imageSources = await sendCommand('GetSourceSettings', { sourceName: sceneSourceOutAudios[i].name });
      sceneSourceOutAudios[i].sourceSettings = imageSources.sourceSettings;
    }
    console.log(sceneSourceOutAudios);
  }

  async function updateTransform(seneName, sourceName) {
    console.log('updateTransform');
    console.log(seneName + '  ' + sourceName);
    if (sourceName != '' && sourceName != false) {
      showTransform = true;
      let data = await sendCommand('GetSceneItemProperties', { 'scene-name': seneName, item: { name: sourceName } });
      // position
      transformObj.position.x = data.position.x;
      transformObj.position.y = data.position.y;
      // size
      transformObj.size.x = data.width;
      transformObj.size.y = data.height;
      // transform
      transformObj.rotation = data.rotation;
      transformObj.scale.x = data.scale.x;
      transformObj.scale.y = data.scale.y;
      // crop
      transformObj.crop.left = data.crop.left;
      transformObj.crop.right = data.crop.right;
      transformObj.crop.top = data.crop.top;
      transformObj.crop.bottom = data.crop.bottom;
    } else {
      showTransform = false;
    }
  }

  async function clickIntervenant(e) {
    console.log('clickIntervenant');

    visibilityFiltreModerator = false;
    nameIntervenantActive = e.name;
    handleFiltreCropChroma = [true, true];

    varSources = e.sources[0].groupChildren[0];
    nameBrowser = varSources.browser.sourceName;
    ChargeSourceBrowserActive(nameBrowser);

    nameNDI = varSources.ndi.sourceName;
    valueNDI = varSources.ndi.sourceSettings.ndi_source_name;
    nameVideoCaptureDevice = varSources.video.sourceName;

    valueVideoCaptureDevice = varSources.video.sourceSettings.ndi_source_name;
    if(varSources.browser.visible){
      selectedSourcesBVN = 'Browser'
    }else if (varSources.video.visible){
      selectedSourcesBVN = 'VideoCaptureDevice'
    }else if (varSources.ndi.visible) {
      selectedSourcesBVN = 'NDI'
    } else {
      selectedSourcesBVN = ''
    }
  }

  async function handleFiltreClose(filtre) {
    //handleFiltreCropChroma[filtre] = false;
    console.log('handleFiltreClose');
    //handleFiltreCropChroma[filtre] = false ;
    //if (handleFiltreCropChroma[0] == false && handleFiltreCropChroma[1] == false) {
      visibilityFiltreModerator = false;
    //}
  }

  async function handleFiltreChanncel(filterName , i) {
    console.log('handleFiltreChanncel');
    console.log(filterName ,+" "+ i)
    //handleFiltreCropChroma[filterName] = false;
    let filterSettings = JSON.parse(JSON.stringify(saveSourcesFiltres[i]));
    filterSettings.enabled = true;
    let data = await sendCommand('SetSourceFilterSettings', { sourceName: nameSourceFilterActivite, filterName: filterName, filterSettings: filterSettings.settings });
    await inserSourcesFiltre([filterSettings]);
    console.log(data);
    
    if (handleFiltreCropChroma[0] == false && handleFiltreCropChroma[1] == false) {
      visibilityFiltreModerator = false;
    }
  }

  function androidToHex(color) {
    console.log('androidToHex');
    const [, alpha, ...colorArray] = ('00000000' + color.toString(16)).slice(-8).match(/([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i);
    let permitasion = colorArray[0];
    colorArray[0] = colorArray[2];
    colorArray[2] = permitasion;
    let colorToString = `#${colorArray.join('')}`;
    return colorToString;
  }

  function hexToAndroid(color) {
    console.log('hexToAndroid');
    color = color.substring(1);
    const [, alpha, ...colorArray] = ('00000000' + color.toString(16)).slice(-8).match(/([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i);
    let permitasion = colorArray[0];
    colorArray[0] = colorArray[2];
    colorArray[2] = permitasion;
    let colorToString = `ff${colorArray.join('')}`;
    let yourNumber = parseInt(colorToString, 16);
    return yourNumber;
  }

  async function inserSourcesFiltre(modirator) {
    console.log('inserSourcesFiltre');
    console.log(modirator)
    let e = JSON.parse(JSON.stringify(modirator)); // 10/09 ajouter
    for (let i = 0; i < modirator.length; i++) {
      for (let j = 0; j < saveSourcesFiltresArray.length; j++) {
        if (e[i].type.includes('chroma_key') && saveSourcesFiltresArray[j].type.includes('chroma_key')) {
          saveSourcesFiltresArray[j].enabled = e[i].enabled;
          saveSourcesFiltresArray[j].name = e[i].name;
          if (e[i].settings.key_color_type) {
            saveSourcesFiltresArray[j].settings.key_color_type.courant = e[i].settings.key_color_type;
            if (e[i].settings.key_color_type == 'custom') {
              if (e[i].settings.key_color) {
                saveSourcesFiltresArray[j].settings.key_color_type.key_color = androidToHex(e[i].settings.key_color);
                modirator[i].settings.key_color = androidToHex(e[i].settings.key_color);
              } else {
                modirator[i].settings.key_color = '#00ff00';
              }
            }
          } else {modirator[i].settings.key_color_type = 'green';}

          if ((e[i].settings.similarity)||(e[i].settings.similarity == 0)) {saveSourcesFiltresArray[j].settings.similarity.courant = e[i].settings.similarity;} 
          else {modirator[i].settings.similarity = 400;}
          
          if ((e[i].settings.smoothness)||(e[i].settings.smoothness == 0)) {saveSourcesFiltresArray[j].settings.smoothness.courant = e[i].settings.smoothness;} 
          else {modirator[i].settings.smoothness = 80;}

          if ((e[i].settings.spill)||(e[i].settings.spill == 0)) {saveSourcesFiltresArray[j].settings.spill.courant = e[i].settings.spill;} 
          else {modirator[i].settings.spill = 100;}

          if ((e[i].settings.opacity)||(e[i].settings.opacity == 0)) {saveSourcesFiltresArray[j].settings.opacity.courant = e[i].settings.opacity;
          } else {modirator[i].settings.opacity = 1;
          }

          if ((e[i].settings.contrast)||(e[i].settings.contrast == 0)) {saveSourcesFiltresArray[j].settings.contrast.courant = e[i].settings.contrast;
          } else {modirator[i].settings.contrast = 0;
          }

          if ((e[i].settings.brightness)||(e[i].settings.brightness == 0)) {saveSourcesFiltresArray[j].settings.brightness.courant = e[i].settings.brightness;
          } else {modirator[i].settings.brightness = 0;
          }

          if ((e[i].settings.gamma)||(e[i].settings.gamma == 0)) {saveSourcesFiltresArray[j].settings.gamma.courant = e[i].settings.gamma;
          } else {modirator[i].settings.gamma = 0;
          }
        }

        if (e[i].type.includes('crop_filter') && saveSourcesFiltresArray[j].type.includes('crop_filter')) {
          //console.log("if crop_filter");
          saveSourcesFiltresArray[j].enabled = e[i].enabled;
          saveSourcesFiltresArray[j].name = e[i].name;
          if ((e[i].settings.bottom)||(e[i].settings.bottom == 0)) {
            saveSourcesFiltresArray[j].settings.bottom.courant = e[i].settings.bottom;
          } else {
            modirator[i].settings.bottom = 0;
          }

          if ((e[i].settings.left)||(e[i].settings.left == 0)) {
            saveSourcesFiltresArray[j].settings.left.courant = e[i].settings.left;
          } else {
            modirator[i].settings.left = 0;
          }

          if ((e[i].settings.right)||(e[i].settings.right == 0)) {
            saveSourcesFiltresArray[j].settings.right.courant = e[i].settings.right;
          } else {
            modirator[i].settings.right = 0;
          }

          if ((e[i].settings.top)||(e[i].settings.top == 0)) {
            saveSourcesFiltresArray[j].settings.top.courant = e[i].settings.top;
          } else {
            modirator[i].settings.top = 0;
          }
        }
      }
    }
  }

  async function setSourcesFiltre(entre, sortie) {
    console.log('setSourcesFiltre');
    for (let i = 0; i < sortie.length; i++) {
      console.log('sortie[i] i = ' + i);
      for (let j = 0; j < entre.length; j++) {
        if (sortie[i].type.includes('chroma_key') && entre[j].type.includes('chroma_key')) {
          sortie[i].enabled = entre[j].enabled;
          sortie[i].settings.key_color_type = entre[j].settings.key_color_type.courant;
          if (sortie[i].settings.key_color_type == 'custom') {
            if (sortie[i].settings.key_color) {
              sortie[i].settings.key_color = entre[j].settings.key_color_type.key_color;
            }
          }
          sortie[i].settings.similarity = entre[j].settings.similarity.courant;
          sortie[i].settings.smoothness = entre[j].settings.smoothness.courant;
          sortie[i].settings.spill = entre[j].settings.spill.courant;
          sortie[i].settings.opacity = entre[j].settings.opacity.courant;
          sortie[i].settings.contrast = entre[j].settings.contrast.courant;
          sortie[i].settings.brightness = entre[j].settings.brightness.courant;
          sortie[i].settings.gamma = entre[j].settings.gamma.courant;
        }

        if (sortie[i].type.includes('crop_filter') && entre[j].type.includes('crop_filter')) {
          ///*
          console.log('if crop_filter');
          sortie[i].enabled = entre[j].enabled;
          sortie[i].settings.bottom = entre[j].settings.bottom.courant;
          sortie[i].settings.left = entre[j].settings.left.courant;
          sortie[i].settings.right = entre[j].settings.right.courant;
          sortie[i].settings.top = entre[j].settings.top.courant;
        }
        //}
      }
    }
    console.log('sortie');
  }

  async function clickModerator(e) {
    console.log('clickModerator = ');
    nameSourceFilterActivite = e.sources[0].name;
    let filtreModerator = await GetSourceFilters(nameSourceFilterActivite);
    await inserSourcesFiltre(filtreModerator);
    nameIntervenantActive = e.name;
    varSources = e.sources[0].groupChildren[0];
    nameBrowser = varSources.browser.sourceName;
    ChargeSourceBrowserActive(varSources.browser.sourceName);
    nameNDI = varSources.ndi.sourceName;
    valueNDI = varSources.ndi.sourceSettings.ndi_source_name;
    nameVideoCaptureDevice = varSources.video.sourceName;

    valueVideoCaptureDevice = varSources.video.sourceSettings.video_device_id;
    visibilityFiltreModerator = false;
    wantToAddInterModerator = false;

    if(varSources.browser.visible){
      selectedSourcesBVN = 'Browser'
    }else if (varSources.video.visible){
      selectedSourcesBVN = 'VideoCaptureDevice'
    }else if (varSources.ndi.visible) {
      selectedSourcesBVN = 'NDI'
    } else {
      selectedSourcesBVN = ''
    }
  }

  async function afficherConsole(e) {
    console.log(e);
  }

  async function getScreenshot() {
    if (connected) {
      let data = await sendCommand('TakeSourceScreenshot', { sourceName: currentScene, embedPictureFormat: 'png', width: 480, height: 270 });
      if (data && data.img) {
        document.querySelector('#program').src = data.img;
        document.querySelector('#program').className = '';
      }

      if (isStudioMode) {
        //let data = await sendCommand('TakeSourceScreenshot', { sourceName: currentPreviewScene, embedPictureFormat: 'png', width: 960, height: 540 });
        let data = await sendCommand('TakeSourceScreenshot', { sourceName: currentPreviewScene, embedPictureFormat: 'png', width: 480, height: 270 });
        if (data && data.img) {
          document.querySelector('#preview').src = data.img;
          document.querySelector('#preview').classList.remove('is-hidden');
        }
      }
    }
    setTimeout(getScreenshot, 20);
  }

  async function getScreenshotModeOrInt() {
    if (showScreenInterOrModer && nameIntervenantActive) {
      let data = await sendCommand('TakeSourceScreenshot', { sourceName: nameIntervenantActive, embedPictureFormat: 'png', width: 480, height: 270 });
      if (data && data.img) {
        if (document.querySelector('#interOrModer1')) {
          document.querySelector('#interOrModer1').src = data.img;
          document.querySelector('#interOrModer1').classList.remove('is-hidden');
        }
      }
    }
    setTimeout(getScreenshotModeOrInt, 20);
  }

  async function getScreenshotSourcesAdd() {
    if (showScreenSourcesAdd && nameSourceMedImgActive) {
      let data = await sendCommand('TakeSourceScreenshot', { sourceName: nameSceneMedImgActive, embedPictureFormat: 'png', width: 480, height: 270 });
      if (data && data.img) {
        if (document.querySelector('#SourcesAdd')) {
          document.querySelector('#SourcesAdd').src = data.img;
          document.querySelector('#SourcesAdd').classList.remove('is-hidden');
        }
      }
    }
    setTimeout(getScreenshotSourcesAdd, 20);
  }

  async function connect() {
    console.log('function connect');
    host = host || 'localhost:4440';
    let secure = location.protocol === 'https:' || host.endsWith(':443');
    if (host.indexOf('://') !== -1) {
      let url = new URL(host);
      secure = url.protocol === 'wss:' || url.protocol === 'https:';
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
 /*  obs.on('SourceDestroyed',( )=>{
    console.log('SourceDestroyed');

  }) */

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
    await getScreenshotSourcesAdd();
    await getScreenshotModeOrInt();
    document.querySelector('#program').classList.remove('is-hidden');
    await StopVirtualCameraInDepart();
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

  obs.on('BroadcastCustomMessage', async (data) => {
    console.log(`BroadcastCustomMessage: ${data.realm}`);
    await updateScenes();
  });

  obs.on('GetSceneItemProperties', async (data) => {
    console.log(`GetSceneItemProperties Bouker: ${data.sceneName}`);
    console.log(data)
    //await updateScenes();
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

  function functionVisibleHost() {
    console.log('functionVisibleHost');
    if (visibleHost == false) {
      console.log('in if');
      visibleSpeaker = false;
    }
    visibleBrowser = false;
    visibleNDI = false;
    visibleVideo = false;
  }

  function functionVisibleSpeaker() {
    console.log('functionVisibleSpeaker');

    if (visibleSpeaker == false) {
      console.log('in if');
      visibleHost = false;
    }
    visibleBrowser = false;
    visibleNDI = false;
    visibleVideo = false;
  }

  const handleKeyup = (event) => {
    console.log('handleKeyup');
    if (event.code == 'Enter') {
      event.preventDefault();
      console.log(event.preventDefault());

      event.target.value;
      value = event.target.value;
      console.log(value);

      return false;
    }
  };
  //////////////////////////////////
  async function onFileSelected(e , imgVideo) {
    readTextFile(e)
    console.log('onFileSelected');
    console.log(e);
    let image = e.target.files[0];
    let typeImage = image.type.slice(6);
    timeStampsForImg = new Date().getTime();
    if (imgVideo == 'image'){
      inputSourceImage = 'H:/Téléchargements/'.concat(timeStampsForImg).concat(".").concat(typeImage);
    }
    if (imgVideo == 'video'){
      inputSourceMedia = 'H:/Téléchargements/'.concat(timeStampsForImg).concat(".").concat(typeImage);
    }
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = (e) => {
      forceDownload(e.target.result, timeStampsForImg);
    };
  }

  function forceDownload(url, name) {
    var newImg = document.createElement('img'); // create img tag
    newImg.src = url;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = function () {
      var urlCreator = window.URL || window.webkitURL;
      var imageUrl = urlCreator.createObjectURL(this.response);
      var tag = document.createElement('a');
      tag.href = imageUrl;
      tag.download = name;
      document.body.appendChild(tag);
      tag.click();
      document.body.removeChild(tag);
    };
    xhr.send();
  }

  //////////////////////////////////
</script>

<!-- svelte-ignore non-top-level-reactive-declaration -->
<!-- svelte-ignore non-top-level-reactive-declaration -->
<svelte:head>
  <title>incept-video-web - control video from anywhere</title>
  <link rel="stylesheet" href="https://unpkg.com/mono-icons@1.0.5/iconfont/icons.css" />
</svelte:head>
<!--  navbar -->
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
            <!-- --------------- 22-09------------------- -->
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
            <!-- ---------------------------------- -->
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

<section class="section">
  <div class="container" style="display:block">
    {#if connected}
      <div style="margin-left: 750px;margin-bottom: 50px;">
        <button style="width: 250px;height: 60px;margin-left: 5px;" on:click={() => DefaultAllSources()}> Reset All Sources</button>
        <button style="width: 250px;height: 60px;" on:click={() => updateInvisibleAllGroup()}> uinvisible All Group</button>
      </div>
      <div>
        {#if !isSceneOnTop}
          <SceneView {isStudioMode} {transitionScene} />
        {/if}
      </div>
      <!-- //////////////////////TaddModerInter////////////////////////////// -->
      <strong style="margin-top: 20px;margin-left: 10px;display: inline-block;">Etape 1: Rajout d'un Intervenant/Moderateur </strong><br />

      <div style="border: 5px solid #ccc; padding: 5px; border-radius: 10px;padding-bottom: 55px;width : auto">
        {#if !wantToAddInterModerator}
          <!-- <h1 style="margin-top: 20px;margin-left: 10px;">want to add intervenant or moderator ?</h1> -->
          <Button
            on:click={() => {
              wantToAddInterModerator = true;
              nameIntervenantActive = false;
              selectModeratotr = false;
              showTransform = false;
              selectIntervenant = false;
            }}
            type="flat"
            status="positive"
            iconRight="chevron-right"
            style="margin-bottom: 20px;margin-left: 10px;background: aqua;"
          >
            want to add intervenant or moderator
          </Button>
        {:else}
          <h1>What do you want to add ?</h1>
          <br />
          <div class="tile is-ancestor">
            <div class="column is-narrow">
              <label style="display: block;">
                <input type="checkbox" bind:checked={visibleHost} on:click={functionVisibleHost} />
                Host (Physical)
              </label>
              <label>
                <input type="checkbox" bind:checked={visibleSpeaker} on:click={functionVisibleSpeaker} />
                Virtual Speaker
              </label>
            </div>
            <div class="tile is-ancestor">
              {#if visibleHost || visibleSpeaker}
                <Button on:click={() => AddIntervenants()} style="margin-top: 20px;margin-left: 100px;height: 50px;background: darkkhaki;">+ Add</Button>
              {:else}
                <Button
                  on:click={() => {
                    wantToAddInterModerator = !wantToAddInterModerator;
                  }}
                  style="margin-top: 20px;margin-left: 100px;height: 50px;background: azure;"
                >
                  Hide
                </Button>
              {/if}
            </div>
          </div>
        {/if}
        <!-- /////////////////////// -->
        <div class="tile is-ancestor">
          {#each sceneModerators as sceneModerator, i}
            {#if sceneModerator.sources[0].render}
              <div class="tile is-parent">
                <!-- svelte-ignore a11y-missing-attribute -->
                {#if nameIntervenantActive == sceneModerator.name && selectModeratotr}
                  <a
                    on:click={() => {
                      selectModeratotr = false;
                      showTransform = false;
                      selectIntervenant = false;
                      nameIntervenantActive = false;
                    }}
                    class="tile is-child is-primary notification"
                  >
                    <p class="title has-text-centered is-size-6-mobile">{sceneModerator.name}</p>
                  </a>
                {:else}
                  <a
                    on:click={() => {
                      clickModerator(sceneModerator);
                      selectModeratotr = true;
                      showTransform = false;
                      selectIntervenant = false;
                    }}
                    class="tile is-child is-info notification"
                  >
                    <p class="title has-text-centered is-size-6-mobile">{sceneModerator.name}</p>
                  </a>
                {/if}
              </div>
            {/if}
          {/each}
          <!-- /////////////////////////////// -->
          {#each sceneIntervenants as sceneIntervenant, j}
            {#if sceneIntervenant.sources[0].render}
              <div class="tile is-parent">
                {#if nameIntervenantActive == sceneIntervenant.name && selectIntervenant}
                  <!-- svelte-ignore a11y-missing-attribute -->
                  <a
                    on:click={() => {
                      selectModeratotr = false;
                      showTransform = false;
                      selectIntervenant = false;
                      nameIntervenantActive = false;
                    }}
                    class="tile is-child is-primary notification"
                  >
                    <p class="title has-text-centered is-size-6-mobile">{sceneIntervenant.name}</p>
                  </a>
                {:else}
                  <!-- svelte-ignore a11y-missing-attribute -->
                  <a
                    on:click={() => {
                      clickIntervenant(sceneIntervenant);
                      selectModeratotr = false;
                      showTransform = false;
                      selectIntervenant = true;
                    }}
                    class="tile is-child is-info notification"
                  >
                    <p class="title has-text-centered is-size-6-mobile">{sceneIntervenant.name}</p>
                  </a>
                {/if}
              </div>
            {/if}
          {/each}
        </div>
        <div class="tile is-ancestor">
          {#if nameIntervenantActive}
            <Button on:click={() => DeleteIntervenant()} status="negative" style="margin-top: 20px;margin-left: 10px;background: burlywood;">Delete</Button>
          {/if}
        </div>
      </div>

      <!-- ------------------------------------------------------------------------ -->
      <!-- <div>
        {#if isSceneOnTop}
          <SceneView {isStudioMode} {transitionScene} />
        {/if}
      </div> -->

      {#if nameIntervenantActive}
        <!-- ------------------------------Tsource------------------------------------------ -->
        <strong style="margin-top: 20px;margin-left: 10px;display: inline-block;">1.1 Choix de la Source</strong>

        <div style="border: 5px solid #ccc; padding: 5px; border-radius: 10px;padding-bottom: 55px;width : 650px">
          <!--{#if !choiseSourceInterModer}
            <h1 style="margin-top: 20px;margin-left: 10px;display: inline;">What do you want to choose source ?</h1>
            <button on:click={()=> choiseSourceInterModer = true } style="margin-top: 20px;margin-left: 10px;"> choise Source </button>
          {:else} -->

          <div>
            <Container>
              <Row>
                <h1 style="margin-top: 20px;margin-left: 10px;display: inline;">choise source in {nameIntervenantActive} ?</h1>

                <div style="display: block;padding-left: 50px;">
                  <label>
                    <input type="radio" on:click={() => SetSourceVisibleLocked(nameIntervenantActive, varSources, sourceBrowserActive.source)} bind:group={selectedSourcesBVN} value="Browser" />
                    {nameBrowser}
                  </label>
                  <br />
                  <div style="display: block;padding-left: 50px; background-color: lightblue;">
                    {#if selectedSourcesBVN == 'Browser'}
                      <label>
                        <!-- SetBrowserSourcePropertiesData ou SetSourceSettingsBrowserVariable-->
                        <h1 style="margin-top: 20px;margin-left: 10px;display: inline;max-width : 200px">Url</h1>
                        <input
                          type="text"
                          bind:value={sourceBrowserActive.url}
                          style="width: 320px;"
                          on:input={() => SetSourceSettingsBrowserVariable(sourceBrowserActive.source, { url: sourceBrowserActive.url })}
                        />
                        <br />
                        <!-- 24-09 -->
                        <h1 style="margin-top: 20px;margin-left: 10px;display: inline;max-width : 200px">Width</h1>
                        <input
                          type="number"
                          bind:value={sourceBrowserActive.width}
                          step={1}
                          style="width: 100px;"
                          on:input={() => SetSourceSettingsBrowserVariable(sourceBrowserActive.source, { width: sourceBrowserActive.width })}
                        />
                        <br />
                        <h1 style="margin-top: 20px;margin-left: 10px;display: inline;max-width : 200px">Height</h1>
                        <input
                          type="number"
                          bind:value={sourceBrowserActive.height}
                          step={1}
                          style="width: 100px;"
                          on:input={() => SetSourceSettingsBrowserVariable(sourceBrowserActive.source, { height: sourceBrowserActive.height })}
                        />
                        <br />
                        <input
                          type="checkbox"
                          bind:value={sourceBrowserActive.fps_custom}
                          bind:checked={sourceBrowserActive.fps_custom}
                          on:input={() => SetSourceSettingsBrowserVariable(sourceBrowserActive.source, { fps_custom: !sourceBrowserActive.fps_custom })}
                        />
                        Use custom frame rate
                        <br />
                        {#if sourceBrowserActive.fps_custom}
                          <input
                            type="number"
                            bind:value={sourceBrowserActive.fps}
                            step={1}
                            style="width: 100px;"
                            on:input={() => SetSourceSettingsBrowserVariable(sourceBrowserActive.source, { fps: sourceBrowserActive.fps })}
                          />
                          <br />
                        {/if}
                        <input
                          type="checkbox"
                          bind:value={sourceBrowserActive.reroute_audio}
                          bind:checked={sourceBrowserActive.reroute_audio}
                          on:input={() => {
                            SetSourceSettingsBrowserVariable(sourceBrowserActive.source, { reroute_audio: !sourceBrowserActive.reroute_audio }),
                              console.log(CanncelSourceBrowserActive.reroute_audio);
                          }}
                        />
                        Control audio via OBS
                        <br />
                        <input
                          type="checkbox"
                          bind:value={sourceBrowserActive.shutdown}
                          bind:checked={sourceBrowserActive.shutdown}
                          on:input={() => SetSourceSettingsBrowserVariable(sourceBrowserActive.source, { shutdown: !sourceBrowserActive.shutdown })}
                        />
                        Shutdown source when not visible
                        <br />
                        <input
                          type="checkbox"
                          bind:value={sourceBrowserActive.restart_when_active}
                          bind:checked={sourceBrowserActive.restart_when_active}
                          on:input={() => SetSourceSettingsBrowserVariable(sourceBrowserActive.source, { restart_when_active: !sourceBrowserActive.restart_when_active })}
                        />
                        Refresh browser when scene becomes active
                        <br />

                        <button
                          class="todobutton"
                          on:click={() => {
                            SetSourceSettingsBrowserDefault();
                            choiseSourceInterModer = false;
                        }}>Reset</button>
                        <button
                          class="todobutton"
                          style="float: right;"
                          on:click={() => {
                            selectedSourcesBVN = '';
                            choiseSourceInterModer = false;
                        }}> Hide</button>
                        <!-- CanncelSourceBrowserActive = JSON.parse(JSON.stringify(sourceBrowserActive)) ; -->
                      </label>
                    {/if}
                  </div>
                </div>

                <div style="display: block;padding-left: 50px;">
                  <label>
                    <input
                      type="radio"
                      on:click={() => {
                        SetSourceVisibleLocked(nameIntervenantActive, varSources, nameNDI);
                      }}
                      bind:group={selectedSourcesBVN}
                      value="NDI"
                    />
                    {nameNDI}
                  </label>
                  {#if selectedSourcesBVN == 'NDI'}
                    <p>
                      <input type="text" style="width: 450px;" bind:value={valueNDI} />
                      <button
                        on:click={() => {
                          SetSourceSettingsNDI(nameNDI, valueNDI);
                          selectedSourcesBVN = '';
                        }}
                        class="todobutton">Set NDI</button
                      >
                    </p>
                  {/if}
                </div>

                <div style="display: block;padding-left: 50px;">
                  <label>
                    <input
                      type="radio"
                      on:click={() => {
                        SetSourceVisibleLocked(nameIntervenantActive, varSources, nameVideoCaptureDevice);
                      }}
                      bind:group={selectedSourcesBVN}
                      value="VideoCaptureDevice"
                    />
                    {nameVideoCaptureDevice}
                  </label>
                  {#if selectedSourcesBVN == 'VideoCaptureDevice'}
                    <p>
                      <input type="text" style="width: 450px;" bind:value={valueVideoCaptureDevice} />
                      <button
                        on:click={() => {
                          SetSourceSettingsVideo(nameVideoCaptureDevice, valueVideoCaptureDevice);
                          selectedSourcesBVN = '';
                        }}
                        class="todobutton">Set Video Capture Device</button
                      >
                    </p>
                  {/if}
                </div>
              </Row>
              <!-- <button on:click={()=> choiseSourceInterModer = false } style="margin-top: 20px;margin-left: 10px; float:right"> ok  </button> -->
            </Container>
          </div>
          <!---->
          <!-- {/if} -->
        </div>
        <!-- ------------------------------Tfiltre------------------------------------------ -->
        {#if nameIntervenantActive.indexOf('derator') != -1}
          <strong style="margin-top: 20px;margin-left: 10px;display: inline-block;">1.3 Appliquer filtres sur la Source (pour moderateur selement)</strong>
          <div class="is-ancestor" style="border: 5px solid #ccc; padding: 5px; border-radius: 10px;width : 650px">
            {#if !visibilityFiltreModerator}
              <h1 style="margin-top: 20px;margin-left: 10px;display: inline-block;">you need show filtre</h1>
              <button
                on:click={() => {
                  visibilityFiltreModerator = true;
                  handleFiltreCropChroma[0] = true;
                  handleFiltreCropChroma[1] = true;
                }}
                style="margin-top: -10px;margin-left: 10px;">
                filtre
              </button>
            {:else}
              <div class="column">
                <p class="title has-text-centered is-size-6-mobile">filtre</p>
                <Container>
                  {#each saveSourcesFiltresArray as filtreModerator, i}
                      <!-- {#if filtreModerator.enabled} -->
                      <Col>
                        <label>
                          <input
                            type="checkbox"
                            bind:value={filtreModerator.enabled}
                            bind:checked={filtreModerator.enabled}
                            on:click={() => SetSourceFilterVisibility(filtreModerator)}
                          />
                          <!--  -->
                          {filtreModerator.name}
                        </label>
                        <Row>
                            {#if filtreModerator.enabled}
                              {#each Object.entries(filtreModerator.settings) as [title, valuesSettings], j}
                                {#if title.includes('key_color')}
                                  <div style="display: flex;margin-left: 10px;">
                                    <p class="has-text-centered is-size-1-mobile" style="width: 200px;">{title}</p>
                                    <!-- <button on:click={()=> logAfficher(valuesSettings.courant)}> title5 </button> -->

                                    <select bind:value={valuesSettings.courant}>
                                      {#each valuesSettings.value as valueColor, k}
                                        <option
                                          value={valueColor}
                                          selectedSourcesBVN
                                          on:click={(event) => {
                                            (valuesSettings.courant = event.currentTarget.value), console.log(valuesSettings.courant);
                                          }}>{valueColor}</option
                                        >
                                      {/each}
                                    </select>
                                    {#if valuesSettings.courant == 'custom'}
                                      <input
                                        type="color"
                                        bind:value={valuesSettings.key_color}
                                        on:color={(event) => {
                                          valuesSettings.key_color = event.currentTarget.value;
                                          console.log(valuesSettings.key_color);
                                          console.log(valuesSettings.courant);
                                        }}
                                        on:change={() => SetSourceFilterSettingsCrop(nameSourceFilterActivite, filtreModerator.name, filtreModerator.settings)}
                                        style="height: 25px;"
                                      />
                                      <!-- <button on:click={()=> logAfficher(valuesSettings.key_color)}> title 6 </button> -->
                                      <div style="height: 25px; width: 80px;">{valuesSettings.key_color}</div>
                                    {/if}
                                  </div>
                                {:else}
                                  <label style="display: flex;margin-left: 10px;">
                                    <p class="has-text-centered is-size-1-mobile" style="    width: 200px;">{title}</p>
                                    <p class="has-text-centered is-size-1-mobile" style="    width: 100px;">{valuesSettings.min}</p>
                                    <input
                                      type="range"
                                      min={valuesSettings.min}
                                      max={valuesSettings.max}
                                      step={valuesSettings.step}
                                      label={true}
                                      bind:value={valuesSettings.courant}
                                      style="    width: 1000px;"
                                      on:input={() => SetSourceFilterSettingsCrop(nameSourceFilterActivite, filtreModerator.name, filtreModerator.settings)}
                                    />
                                    <input
                                      type="number"
                                      bind:value={valuesSettings.courant}
                                      min={valuesSettings.min}
                                      max={valuesSettings.max}
                                      step={valuesSettings.step}
                                      style="width: 100px;"
                                    />
                                    <p class="has-text-centered is-size-1-mobile" style="    width: 100px;">{valuesSettings.max}</p>
                                  </label>
                                {/if}
                              {/each}
                            {/if}
                        </Row>
                      </Col>
                      {#if filtreModerator.enabled}
                          <div style="margin-top: 10px;">
                            <!-- <button on:click={() => handleFiltreChanncel(i)}> Canncel </button> -->
                            <button on:click={() => handleFiltreChanncel(filtreModerator.name , i)}> Defaults </button>
                          </div>
                      {/if}

                    <!-- {/if} -->
                  {/each}
                  <button style="float: right;" on:click={() => handleFiltreClose()}> Close </button>

                </Container>
                <br /> <br />
              </div>
              <!---->
            {/if}
          </div>
        {/if}
        <!-- ------------------------------Ttransfo------------------------------------------ -->
        <strong style="margin-top: 20px;margin-left: 10px;display: inline-block;">1.4 Appliquer transformations sur la Source (you have to select source)</strong>
        <div style="border: 5px solid #ccc; padding: 5px; border-radius: 10px;width : 650px">
          {#if !showTransform}
            <div class="tile is-ancestor">
              <h1 style="margin-top: 20px;margin-left: 10px;">you need to do transform :</h1>
              <button on:click={() => updateTransform(nameIntervenantActive, nameSourceActive)} style="margin-top: 20px;margin-left: 10px;"> show transform </button>
            </div>
            <div />
          {:else}
            <Container style="background-color: lightblue;">
              <h2 class="title" style="margin-top: 20px;margin-left: 10px;">Scene Item Transform</h2>

              <Row>
                <h1 style="margin-top: 20px;margin-left: 10px;display: inline;max-width : 200px">Position</h1>
                <input
                  type="number"
                  bind:value={transformObj.position.x}
                  step={1}
                  style="width: 100px;"
                  on:input={() => SetSceneItemPosition(nameIntervenantActive, nameSourceActive, transformObj.position.x, transformObj.position.y)}
                />
                <input
                  type="number"
                  bind:value={transformObj.position.y}
                  step={1}
                  style="width: 100px;"
                  on:input={() => SetSceneItemPosition(nameIntervenantActive, nameSourceActive, transformObj.position.x, transformObj.position.y)}
                />
              </Row>
              <h1 style="margin-top: 20px;margin-left: 10px;">Transform</h1>
              <Row>
                <h1 style="margin-top: 20px;margin-left: 10px;display: inline;">Rotation</h1>
                <input
                  type="number"
                  bind:value={transformObj.rotation}
                  min={-360}
                  max={360}
                  step={0.01}
                  style="width: 100px;"
                  on:input={() => SetSceneItemTransform(nameIntervenantActive, nameSourceActive, transformObj.scale.x, transformObj.scale.y, transformObj.rotation)}
                />
              </Row>
              <Row>
                <h1 style="margin-top: 20px;margin-left: 10px;display: inline;max-width : 200px">Scale</h1>
                <input
                  type="number"
                  bind:value={transformObj.scale.x}
                  step={1}
                  style="width: 100px;"
                  on:input={() => SetSceneItemTransform(nameIntervenantActive, nameSourceActive, transformObj.scale.x, transformObj.scale.y, transformObj.rotation)}
                />
                <input
                  type="number"
                  bind:value={transformObj.scale.y}
                  step={1}
                  style="width: 100px;"
                  on:input={() => SetSceneItemTransform(nameIntervenantActive, nameSourceActive, transformObj.scale.x, transformObj.scale.y, transformObj.rotation)}
                />
              </Row>

              <Row>
                <h1 style="margin-top: 20px;margin-left: 10px;">Crop</h1>
              </Row>
              <Row>
                <h1 style="margin-top: 20px;margin-left: 10px;display: inline;">Left</h1>
                <input
                  type="number"
                  bind:value={transformObj.crop.left}
                  step={1}
                  style="width: 100px;"
                  on:input={() =>
                    SetSceneItemCrop(nameIntervenantActive, nameSourceActive, transformObj.crop.left, transformObj.crop.right, transformObj.crop.top, transformObj.crop.bottom)}
                />
                <h1 style="margin-top: 20px;margin-left: 10px;display: inline;">Right</h1>
                <input
                  type="number"
                  bind:value={transformObj.crop.right}
                  step={1}
                  style="width: 100px;"
                  on:input={() =>
                    SetSceneItemCrop(nameIntervenantActive, nameSourceActive, transformObj.crop.left, transformObj.crop.right, transformObj.crop.top, transformObj.crop.bottom)}
                />
              </Row>
              <Row>
                <h1 style="margin-top: 20px;margin-left: 10px;display: inline;">Top</h1>
                <input
                  type="number"
                  bind:value={transformObj.crop.top}
                  step={1}
                  style="width: 100px;"
                  on:input={() =>
                    SetSceneItemCrop(nameIntervenantActive, nameSourceActive, transformObj.crop.left, transformObj.crop.right, transformObj.crop.top, transformObj.crop.bottom)}
                />
                <h1 style="margin-top: 20px;margin-left: 10px;display: inline;">Botttom</h1>
                <input
                  type="number"
                  bind:value={transformObj.crop.bottom}
                  step={1}
                  style="width: 100px;"
                  on:input={() =>
                    SetSceneItemCrop(nameIntervenantActive, nameSourceActive, transformObj.crop.left, transformObj.crop.right, transformObj.crop.top, transformObj.crop.bottom)}
                />
              </Row>

              <div >
                <button
                  on:click={() => {
                    resetTransformSource(nameIntervenantActive, nameSourceActive);
                  }}
                  style="margin-top: 20px;margin-left: 10px;">Reset
                </button>
                <button
                  on:click={() => {
                    showTransform = false;
                  }}
                  style="margin-top: 20px;margin-left: 10px;float: right;"
                >
                  Colse
                </button>

              </div>
            </Container>
          {/if}
        </div>

        <!-- ------------------------------Tpreview------------------------------------------ -->

        <strong style="margin-top: 20px;margin-left: 10px;display: inline-block;">1.5 Preview de la Source </strong>

        <div style="border: 5px solid #ccc; padding: 5px; border-radius: 10px;width : 650px">
          {#if !showScreenInterOrModer}
            <h1 style="margin-top: 20px;margin-left: 10px;display: inline-block;">What do you want to show screen ?</h1>
            <button on:click={() => (showScreenInterOrModer = true)} style="margin-top: 20px;margin-left: 10px;"> show Screen </button>
          {:else}
            <h1 style="margin-top: 20px;margin-left: 10px;">show screen {nameIntervenantActive}</h1>
            <img id="interOrModer1" class="is-hidden" alt="interOrModer1" style="border: 2px solid rgb(52 52 52); background-color: rgb(54, 54, 54);" />

            <button on:click={() => (showScreenInterOrModer = false)} style="margin-top: 20px;margin-left: auto;display: block; margin-right: 0;"> show off Screen </button>
          {/if}
        </div>
      {/if}
      <!-- // nameIntervenantActive -->

      <!-- /////////////////////////Tmedia////////////////////////////////// -->
      <strong style="margin-top: 20px;margin-left: 10px;display: inline-block;">2.1 Choix du contenu à rajouter</strong>
      <div style="border: 5px solid #ccc; padding: 5px; border-radius: 10px;padding-bottom: 55px;width : auto">
        {#if !choiseSourceMeIm}
          <h1 style="margin-top: 20px;margin-left: 10px;display: inline;">What do you want to choose input type source media or image ?</h1>
          <button on:click={() => (choiseSourceMeIm = true)} style="margin-top: 20px;margin-left: 10px;"> choice Source </button>
        {:else}
          <div>
            <Container>
              <div style="display: block;">
                <h1 style="margin-top: 20px;margin-left: 10px;display: inline;">choose source ?</h1>
                <div style="display: block;padding-left: 50px;">
                  <label>
                    <input type="radio" bind:group={selectedMedImg} value="image" />
                    Image
                  </label>
                  {#if selectedMedImg == 'image'}
                    <label style="display: block;">
                      <p style="display: inline-block;">Choose Image</p>
                      <!--  -->
                      <input type="file" accept=".jpg, .jpeg, .png"  id="fileImage"
                      on:change={(e) => onFileSelected(e , 'image')} 
                      allowdirs />
                      <!--  -->
                          <!-- <p style="display: inline-block;">visible</p>
                          <input type="checkbox" bind:value={checkVisibleImage} bind:checked={checkVisibleImage} /> -->
                    </label>
                    <button
                      style="margin: 5px;margin-left: 550px;"
                      on:click={() => CreateSourceMediaImage('Image '.concat(timeStampsForImg), 'image_source', { file: inputSourceImage }, checkVisibleImage)}
                    >
                      CreateSourceImage
                    </button>
                  {/if}
                </div>

                <div style="display: block;padding-left: 50px;">
                  <label>
                    <input type="radio" bind:group={selectedMedImg} value="media" />
                    Media Source
                  </label>
                  {#if selectedMedImg == 'media'}
                    <label style="display: block;">
                      <p style="display: inline-block;">Choose video</p>
                      <input type="file" accept="video/mp4,video/x-m4v,video/*" on:change={(e)=>onFileSelected(e ,"video")} bind:this={inputSourceMedia} >
                      <input type="text" style="width: 400px;" bind:value={inputSourceMedia} />
                      <p style="display: inline-block;">visible</p>
                      <!-- <input type="checkbox" bind:value={checkVisibleMedia} bind:checked={checkVisibleMedia} /> -->
                    </label>
                    <button
                      style="margin: 5px;margin-left: 550px;"
                      on:click={() =>
                        CreateSourceMediaImage('Media Source '.concat(timeStampsForImg), 'ffmpeg_source', { local_file: inputSourceMedia }, checkVisibleMedia)}
                    >
                      CreateSourceMedia
                    </button>
                  {/if}
                </div>

                {#if erreurChoiseSourceMeIm}
                  <div style="display: block;padding-left: 50px;">
                    <p>errur d'envoyer</p>
                  </div>
                {/if}
              </div>

              <div style="display :inline-flex">
                <div style="border: 5px solid #ccc; padding: 5px; border-radius: 10px;display: inline-block;">
                  <div style="height: 350px; width: 350px; overflow: scroll; border: 1px solid #ccc; padding: 5px;background: #1f1e1f;">
                    <h3 style="width: auto;background: #45A183;">Source media and image active</h3>
                    {#if sceneSourceImages.length != 0}
                      <!-- svelte-ignore a11y-label-has-associated-control -->
                      {#each sceneSourceImages as sceneSourceImage}
                        <div class="flex-shrink-3" style="display: block;padding: 5px;">
                          {#if nameSourceMedImgActive == sceneSourceImage.name}
                              <button
                                  on:click={() => { nameSourceMedImgActive = '';
                                  inputSourceMedImg = '';showScreenSourcesAdd = false ;
                                  showTransformSourceMedImg = false;
                                  console.log("nameSourceMedImgActive" +nameSourceMedImgActive);}} 
                                class="todobutton" style="width: 150px; background: aqua;">
                                {sceneSourceImage.name}</button>
                          {:else}
                              <button
                              on:click={() => {
                                (showScreenSourcesAdd = true);
                                  (showTransformSourceMedImg = true);
                                  (nameSourceMedImgActive = sceneSourceImage.name);
                                  (inputSourceMedImg = sceneSourceImage.sourceSettings.file);
                                  console.log(nameSourceMedImgActive);
                                  updateTransformSourceMedImg(nameSceneMedImgActive, nameSourceMedImgActive);
                              }}
                              class="todobutton"
                              style="width: 150px; "
                            >
                              {sceneSourceImage.name}</button
                            >
                          {/if}
                          
                          <input
                            type="checkbox"
                            on:click={() => SetSourceMedImgVisible(nameSceneMedImgActive, sceneSourceImage.name, !sceneSourceImage.render)}
                            bind:value={sceneSourceImage.render}
                            bind:checked={sceneSourceImage.render}
                          />
                          <label for="scales" style="color: white;">visible</label>
                          <input
                            type="checkbox"
                            on:click={() => SetSourceMedImgLocked(nameSceneMedImgActive, sceneSourceImage.name, !sceneSourceImage.locked)}
                            bind:value={sceneSourceImage.locked}
                            bind:checked={sceneSourceImage.locked}
                          />
                          <label for="scales" style="color: white;">locked</label>
                        </div>
                      {/each}
                    {/if}
                    {#if sceneSourceMedias.length != 0}
                      <!-- svelte-ignore a11y-label-has-associated-control -->
                      {#each sceneSourceMedias as sceneSourceMedia}
                        <!--  <strong style="display : block ; color: white;">{sceneSourceImage.name}</strong> -->
                        <div class="flex-shrink-3" style="display: block;padding: 5px;">
                            {#if nameSourceMedImgActive == sceneSourceMedia.name}
                                <button
                                on:click={() => { nameSourceMedImgActive = '';
                                inputSourceMedImg = '';showScreenSourcesAdd = false ;
                                showTransformSourceMedImg = false;
                                console.log("nameSourceMedImgActive" +nameSourceMedImgActive);}} 
                              class="todobutton" style="width: 150px; background: aqua;">
                              {sceneSourceMedia.name}</button>
                            {:else}
                              
                              <button
                                on:click={() => {
                                  (showScreenSourcesAdd = true),
                                    (showTransformSourceMedImg = true),
                                    (nameSourceMedImgActive = sceneSourceMedia.name),
                                    (inputSourceMedImg = sceneSourceMedia.sourceSettings.local_file);
                                    updateTransformSourceMedImg(nameSceneMedImgActive, nameSourceMedImgActive);
                                }}
                                class="todobutton"
                                style="width: 150px;"
                              >
                                {sceneSourceMedia.name}</button
                              >
                            {/if}

                              <input
                                type="checkbox"
                                on:click={() => SetSourceMedImgVisible(nameSceneMedImgActive, sceneSourceMedia.name, !sceneSourceMedia.render)}
                                bind:value={sceneSourceMedia.render}
                                bind:checked={sceneSourceMedia.render}
                              />
                              <label for="scales" style="color: white;">visible</label>
                              <input
                                type="checkbox"
                                on:click={() => SetSourceMedImgLocked(nameSceneMedImgActive, sceneSourceMedia.name, !sceneSourceMedia.locked)}
                                bind:value={sceneSourceMedia.locked}
                                bind:checked={sceneSourceMedia.locked}
                              />
                              <label for="scales" style="color: white;">locked</label>
                      
                        </div>
                      {/each}
                    {/if}
                  </div>
                </div>

                <div style="border: 5px solid #ccc; padding: 5px; border-radius: 10px;display: inline-block;width: 450px;">
                  <strong style="margin-top: 20px;margin-left: 10px;display: inline-block;">2.3 Preview du contenu</strong><br />
                  {#if !showScreenSourcesAdd}
                    <h1 style="margin-top: 20px;margin-left: 10px;display: inline-block;">What do you want to show screen ?</h1>
                    <button on:click={() => (showScreenSourcesAdd = true)} style="margin-top: 20px;margin-left: 10px;"> show Screen </button>
                  {:else}
                    <h1 style="margin-top: 20px;margin-left: 10px;">show screen {nameSourceMedImgActive}</h1>
                    <img style="border: 2px solid rgb(52 52 52)" id="SourcesAdd" class="is-hidden" alt="SourcesAdd" />

                    <button on:click={() => (showScreenSourcesAdd = false)} style="margin-top: 20px;margin-left: auto;display: block; margin-right: 0;"> show off Screen </button>
                  {/if}
                </div>

                <div style="border: 5px solid #ccc; padding: 5px; border-radius: 10px;display: inline-block;width: 450px;">
                  <strong style="margin-top: 20px;margin-left: 10px;display: inline-block;">2.2 Appliquer transformations sur le contenu </strong><br />
                  {#if !showTransformSourceMedImg}
                    <div class="tile is-ancestor">
                      <h1 style="margin-top: 20px;margin-left: 10px;">you need to do transform :</h1>
                      <button on:click={() => updateTransformSourceMedImg(nameSceneMedImgActive, nameSourceMedImgActive)} style="margin-top: 20px;margin-left: 10px;">
                        show transform
                      </button>
                    </div>
                  {:else}
                    <Container style="background-color: lightblue;">
                      <h2 class="title" style="margin-top: 20px;margin-left: 10px;">Scene Item Transform</h2>

                      <Row>
                        <h1 style="margin-top: 20px;margin-left: 10px;display: inline;max-width : 200px">Position</h1>
                        <input
                          type="number"
                          bind:value={transformObj.position.x}
                          step={1}
                          style="width: 100px;"
                          on:input={() => SetSceneItemPosition(nameSceneMedImgActive, nameSourceMedImgActive, transformObj.position.x, transformObj.position.y)}
                        />
                        <input
                          type="number"
                          bind:value={transformObj.position.y}
                          step={1}
                          style="width: 100px;"
                          on:input={() => SetSceneItemPosition(nameSceneMedImgActive, nameSourceMedImgActive, transformObj.position.x, transformObj.position.y)}
                        />
                      </Row>
                      <h1 style="margin-top: 20px;margin-left: 10px;">Transform</h1>
                      <Row>
                        <h1 style="margin-top: 20px;margin-left: 10px;display: inline;">Rotation</h1>
                        <input
                          type="number"
                          bind:value={transformObj.rotation}
                          min={-360}
                          max={360}
                          step={0.01}
                          style="width: 100px;"
                          on:input={() => SetSceneItemTransform(nameSceneMedImgActive, nameSourceMedImgActive, transformObj.scale.x, transformObj.scale.y, transformObj.rotation)}
                        />
                      </Row>
                      <Row>
                        <h1 style="margin-top: 20px;margin-left: 10px;display: inline;max-width : 200px">Scale</h1>
                        <input
                          type="number"
                          bind:value={transformObj.scale.x}
                          step={0.1}
                          style="width: 100px;"
                          on:input={() => SetSceneItemTransform(nameSceneMedImgActive, nameSourceMedImgActive, transformObj.scale.x, transformObj.scale.y, transformObj.rotation)}
                        />
                        <input
                          type="number"
                          bind:value={transformObj.scale.y}
                          step={0.1}
                          style="width: 100px;"
                          on:input={() => SetSceneItemTransform(nameSceneMedImgActive, nameSourceMedImgActive, transformObj.scale.x, transformObj.scale.y, transformObj.rotation)}
                        />
                      </Row>

                      <Row>
                        <h1 style="margin-top: 20px;margin-left: 10px;">Crop</h1>
                      </Row>
                      <Row>
                        <h1 style="margin-top: 20px;margin-left: 10px;display: inline;">Left</h1>
                        <input
                          type="number"
                          bind:value={transformObj.crop.left}
                          step={1}
                          style="width: 100px;"
                          on:input={() =>
                            SetSceneItemCrop(nameSceneMedImgActive, nameSourceMedImgActive, transformObj.crop.left, transformObj.crop.right, transformObj.crop.top, transformObj.crop.bottom)}
                        />
                        <h1 style="margin-top: 20px;margin-left: 10px;display: inline;">Right</h1>
                        <input
                          type="number"
                          bind:value={transformObj.crop.right}
                          step={1}
                          style="width: 100px;"
                          on:input={() =>
                            SetSceneItemCrop(nameSceneMedImgActive, nameSourceMedImgActive, transformObj.crop.left, transformObj.crop.right, transformObj.crop.top, transformObj.crop.bottom)}
                        />
                      </Row>
                      <Row>
                        <h1 style="margin-top: 20px;margin-left: 10px;display: inline;">Top</h1>
                        <input
                          type="number"
                          bind:value={transformObj.crop.top}
                          step={1}
                          style="width: 100px;"
                          on:input={() =>
                            SetSceneItemCrop(nameSceneMedImgActive, nameSourceMedImgActive, transformObj.crop.left, transformObj.crop.right, transformObj.crop.top, transformObj.crop.bottom)}
                        />
                        <h1 style="margin-top: 20px;margin-left: 10px;display: inline;">Botttom</h1>
                        <input
                          type="number"
                          bind:value={transformObj.crop.bottom}
                          step={1}
                          style="width: 100px;"
                          on:input={() =>
                            SetSceneItemCrop(nameSceneMedImgActive, nameSourceMedImgActive, transformObj.crop.left, transformObj.crop.right, transformObj.crop.top, transformObj.crop.bottom)}
                        />
                      </Row>

                      <div class="tile is-ancestor">
                        <button
                          on:click={() => {
                            showTransformSourceMedImg = false;
                          }}
                          style="margin-top: 20px;margin-left: 10px;"
                        >
                          Colse
                        </button>
                        <button
                          on:click={() => {
                            resetTransformSource(nameSceneMedImgActive, nameSourceMedImgActive);
                          }}
                          style="margin-top: 20px;margin-left: 10px;"
                        >
                          Reset
                        </button>
                      </div>
                    </Container>
                  {/if}
                </div>
              </div>

              <div style="display: inline-block;">
                {#if showScreenSourcesAdd}
                  <input type="text" style="width: 400px;" bind:value={inputSourceMedImg} />
                  <button
                    style="margin: 5px;margin-left: 550px;"
                    on:click={() => {
                      SetSourceMediaImage(nameSourceMedImgActive, inputSourceMedImg);
                    }}
                  >
                    change Source
                  </button>
                {/if}
              </div>
              <div style="margin-top: 20px;margin-left: 10px; display: grid;align-content: stretch;justify-content: end;">
                <button
                  on:click={() => {
                    (choiseSourceMeIm = false), (selectedMedImg = false), (erreurChoiseSourceMeIm = false), (nameSourceMedImgActive = ''), (showScreenSourcesAdd = false);
                  }}
                >
                  ok
                </button>
              </div>
            </Container>
          </div>
          <!---->
        {/if}
      </div>

      <!-- ------------------------------TinterModer------------------------------------------------------ -->
      <strong style="margin-top: 20px;margin-left: 10px;display: inline-block;">
        3.1 Lier les intervenant/modérateur dans la Scène (main Stage /left Screen /Right screen Top & bottom)</strong
      >
      <div style="border: 5px solid #ccc; padding: 5px; border-radius: 10px;padding-bottom: 35px;width: auto;">
        {#if !showPopulates}
          <div class="tile is-ancestor" style="padding: 20px;">
            <h1 style="margin-top: 20px;margin-left: 10px;">you need show Contenu :</h1>
            <button
              on:click={() => {
                showPopulates = true;
                visibilityFiltreModerator = true;
                handleFiltreCropChroma[0] = true;
                handleFiltreCropChroma[1] = true;
              }}
              style="margin-top: 20px;margin-left: 10px;"
            >
              show populate
            </button>
          </div>
        {:else}
          <h1 style="margin-top: 20px;margin-left: 10px;">Contenu :</h1>

          <div class="tile is-ancestor">
            {#each namePopulates as namePopulate, i}
              <div class="tile is-parent">
                <!-- svelte-ignore a11y-missing-attribute -->
                {#if namePopulate.name == selectPopulate && !namePopulate.status}
                  <button
                    on:click={() => {
                      selectPopulate = namePopulate.name;
                      selectIntervenantForPopulalte = -1;
                      console.log('selectPopulate = ' + selectPopulate + ' || i = ' + i);
                      console.log('bouker 0');
                    }}
                    class="tile is-child is-primary notification"
                  >
                    <p class="title has-text-centered is-size-6-mobile">{namePopulate.name}</p>
                  </button>
                  {#if selectPopulate != -1 && (selectModeratotrForPopulalte != -1 || selectIntervenantForPopulalte != -1 || selectMedImgForPopulalte)}
                    <!-- {#if (namePopulates.findIndex(namePopulate => namePopulate.conncet == nameInterforPopulateActive) == -1) } -->
                    <button
                      on:click={() => {
                        selectPopulate = -1;
                        namePopulate.conncet = nameInterforPopulateActive;
                        namePopulate.status = true;
                        selectModeratotrForPopulalte = -1;
                        console.log(nameInterforPopulateActive);
                        console.log(namePopulates.findIndex((namePopulate) => namePopulate.name == nameInterforPopulateActive));
                      }}
                      style="margin-top: 20px;margin-left: 10px;"
                    >
                      Add
                    </button>
                    <!--{:else}
                              <p>"Hello! I am an alert box!!";</p> 
                            {/if} -->
                  {/if}
                {:else if namePopulate.status}
                  <button
                    on:click={() => {
                      namePopulate.conncet = '';
                        console.log('bouker 1');
                      namePopulate.status = false;
                    }}
                    class="tile is-child is-primary notification"
                    style="background-color: tomato;"
                  >
                    <p class="title has-text-centered is-size-6-mobile">{namePopulate.name} with {namePopulate.conncet}</p>
                  </button>
                {:else}
                  <button
                    on:click={() => {
                      selectPopulate = namePopulate.name;
                      selectIntervenantForPopulalte = -1;
                        console.log('bouker 2');
                      console.log(':else selectPopulate = ' + selectPopulate + ' || i = ' + i);
                    }}
                    class="tile is-child is-info notification"
                  >
                    <p class="title has-text-centered is-size-6-mobile">{namePopulate.name}</p>
                  </button>
                {/if}
              </div>
            {/each}
          </div>

          <h1>Select who is in Main Stage:</h1>
          <!-- <div class="is-ancestor"> -->
          {#each sceneModerators as sceneModerator, i}
            {#if sceneModerator.sources[0].render}
              <div>
                <!-- svelte-ignore a11y-missing-attribute -->
                {#if i == selectModeratotrForPopulalte}
                  <a
                    style="height : 20px;width:180px;padding: 15px;"
                    on:click={() => {
                      selectModeratotrForPopulalte = i;
                      selectIntervenantForPopulalte = -1;
                      selectMedImgForPopulalte = false;
                      nameInterforPopulateActive = sceneModerator.name;
                      console.log('nameInterforPopulateActive = ' + nameInterforPopulateActive);
                    }}
                    class="tile is-child is-primary notification"
                  >
                    <p class="has-text-centered is-size-1-mobile" style="margin-top: -10px;">{sceneModerator.name}</p>
                  </a>
                {:else}
                  <a
                    style="height : 20px;width:180px;padding: 15px;"
                    on:click={() => {
                      selectModeratotrForPopulalte = i;
                      selectIntervenantForPopulalte = -1;
                      selectMedImgForPopulalte = false;
                      nameInterforPopulateActive = sceneModerator.name;
                      console.log('nameInterforPopulateActive = ' + nameInterforPopulateActive);
                    }}
                    class="tile is-child is-info notification"
                  >
                    <p class="has-text-centered is-size-1-mobile" style="margin-top: -10px;">{sceneModerator.name}</p>
                  </a>
                {/if}
              </div>
            {/if}
          {/each}
          {#each sceneIntervenants as sceneIntervenant, j}
            {#if sceneIntervenant.sources[0].render}
              <div>
                {#if j == selectIntervenantForPopulalte}
                  <!-- svelte-ignore a11y-missing-attribute -->
                  <a
                    style="height : 20px;width:180px;padding: 15px;"
                    on:click={() => {
                      selectModeratotrForPopulalte = -1;
                      selectIntervenantForPopulalte = j;
                      selectMedImgForPopulalte = false;
                      nameInterforPopulateActive = sceneIntervenant.name;
                      console.log('nameInterforPopulateActive = ' + nameInterforPopulateActive + ' || j = ' + j);
                    }}
                    class="tile is-child is-primary notification"
                  >
                    <p class="has-text-centered is-size-6-mobile" style="margin-top: -10px;">{sceneIntervenant.name}</p>
                  </a>
                {:else}
                  <!-- svelte-ignore a11y-missing-attribute -->
                  <a
                    style="height : 20px;width:180px;padding: 15px;"
                    on:click={() => {
                      selectModeratotrForPopulalte = -1;
                      selectIntervenantForPopulalte = j;
                      selectMedImgForPopulalte = false;
                      nameInterforPopulateActive = sceneIntervenant.name;
                      console.log('nameInterforPopulateActive = ' + nameInterforPopulateActive + ' || j = ' + j);
                    }}
                    class="tile is-child is-info notification"
                  >
                    <p class="has-text-centered is-size-6-mobile" style="margin-top: -10px;">{sceneIntervenant.name}</p>
                  </a>
                {/if}
              </div>
            {/if}
          {/each}
          <div>
            <!-- svelte-ignore a11y-missing-attribute -->
            {#if ' left' == selectPopulate}

                {#if true == selectMedImgForPopulalte}
                  <a
                    style="height : 20px;width:180px;padding: 15px;"
                    on:click={() => {
                      selectModeratotrForPopulalte = -1;
                      selectIntervenantForPopulalte = -1;
                      selectMedImgForPopulalte = false ;
                      nameInterforPopulateActive = "";
                      console.log('nameInterforPopulateActive = ' + nameInterforPopulateActive);
                    }}
                    class="tile is-child is-primary notification"
                  >
                    <p class="has-text-centered is-size-1-mobile" style="margin-top: -10px;">{"AllSourceMedImg"}</p>
                  </a>
                {:else}
                  <a
                    style="height : 20px;width:180px;padding: 15px;"
                    on:click={() => {
                      selectModeratotrForPopulalte = -1;
                      selectIntervenantForPopulalte = -1;
                      selectMedImgForPopulalte = true;
                      nameInterforPopulateActive = 'AllSourceMedImg';
                      console.log('nameInterforPopulateActive = ' + nameInterforPopulateActive);
                    }}
                    class="tile is-child is-info notification"
                  >
                    <p class="has-text-centered is-size-1-mobile" style="margin-top: -10px;">{"AllSourceMedImg"}</p>
                  </a>
                {/if}
            {/if}
          </div>
          <!-- </div>   -->
          <!--           {#if (namePopulates.findIndex(namePopulate => namePopulate.status == false ) == -1) }

            {/if} -->
          <div style="margin-top: -10px;margin-left: 10px;    float: right;">
            <button on:click={()=> { SetPositionInterModer()}}> ok </button>
            <button
              on:click={() => {
                showPopulates = false;
                selectPopulate = -1;
                selectModeratotrForPopulalte = -1;
                selectIntervenantForPopulalte = -1;
                selectMedImgForPopulalte = false;

              }}
            >
              canncel
            </button>
          </div>
        {/if}
      </div>
      <!-- //////////////////////Tscenes////////////////////////////// -->
      <strong style="margin-top: 20px;margin-left: 10px;display: inline-block;">4.1 Choix entre les vues laquelle est l'output </strong>
      <div class="tile is-ancestor" style="border: 5px solid #ccc; border-radius: 10px;margin-top: 5px;">
        {#each scenes as sc}
          <div class="tile is-parent">
            <!-- svelte-ignore a11y-missing-attribute -->
            {#if currentScene == sc.name}
              <a class="tile is-child is-warning notification">
                <p class="title has-text-centered is-size-6-mobile">{sc.name}</p>
              </a>
            {:else if currentPreviewScene == sc.name}
              <a on:click={setScene} class="tile is-child is-primary notification">
                <p class="title has-text-centered is-size-6-mobile">{sc.name}</p>
              </a>
            {:else}
              <a on:click={isStudioMode ? setPreview : setScene} class="tile is-child is-info notification">
                <p class="title has-text-centered is-size-6-mobile">{sc.name}</p>
              </a>
            {/if}
          </div>
        {/each}
      </div>
      <div>
        {#if isSceneOnTop}
          <SceneView {isStudioMode} {transitionScene} />
        {/if}
      </div>
      <!-- /////////////////////////Taudio////////////////////////////////// -->
      <strong style="margin-top: 20px;margin-left: 10px;display: inline-block;">4.2 Contrôle de l'audio Master </strong><br />

      <strong style="margin-top: 20px;margin-left: 10px;display: inline-block;">4.2.1 Ajouter des sources audio (input / output / NDI) </strong>

      <div style="border: 5px solid #ccc; padding: 5px; border-radius: 10px;padding-bottom: 55px;width : auto">
        {#if !choiseSourceAudio}
          <h1 style="margin-top: 20px;margin-left: 10px;display: inline;">What do you want to choose input type source audio ?</h1>
          <button on:click={() => (choiseSourceAudio = true)} style="margin-top: 20px;margin-left: 10px;"> choice Source </button>
        {:else}
          <div>
            <Container>
              <Row>
                <Col>
                  <h1 style="margin-top: 20px;margin-left: 10px;display: inline;">choose source Audio?</h1>
                  <div style="display: block;padding-left: 50px;">
                    <label>
                      <!-- <input type="radio" on:click={() => SetSourceAudioVisibleLocked(nameSourceAudioActive, valueAudioSources.input.name, selectedAudio)} bind:group={selectedAudio} value="input" /> -->
                      <input type="radio"  bind:group={selectedAudio} value="input" />
                      input Source Audio
                    </label>
                    {#if selectedAudio == 'input'}
                      <p>
                        <input type="text" style="width: 400px;" bind:value={inputSourceInAudio} />
                        <!-- <button on:click={() => CreateSourceAudio(valueAudioSources.input.name, valueAudioSources.input.value)} class="todobutton">Set Audio input Capture</button> -->
                        <button on:click={() => CreateSourceAudio("In_SourceAudio ", 'wasapi_input_capture' , {device_id : inputSourceInAudio} , true)} class="todobutton">Create Audio input Capture</button>
                      </p>
                    {/if}
                  </div>

                  <div style="display: block;padding-left: 50px;">
                    <label>
                      <input type="radio"  bind:group={selectedAudio} value="output" />
                      output Source Audio
                    </label>
                    {#if selectedAudio == 'output'}
                      <p>
                        <input type="text" style="width: 400px;" bind:value={valueAudioSources.output.value} />
                        <button on:click={() => CreateSourceAudio("OutSourceAudio ", 'wasapi_output_capture' , {device_id : inputSourceOutAudio} , true)} class="todobutton">Create Audio Output Capture</button>
                      </p>
                    {/if}
                  </div>

                  <div style="display: block;padding-left: 50px;">
                    <label>
                      <input type="radio" bind:group={selectedAudio} value="NDI" />
                      NDI Source Audio
                    </label>
                    {#if selectedAudio == 'NDI'}
                      <p>
                        <input type="text" style="width: 400px;" bind:value={valueAudioSources.ndi.value} />
                        <button on:click={() => CreateSourceAudio("NDISourceAudio ", 'ndi_source' , {ndi_source_name : inputSourceNdiAudio} , true)} class="todobutton">Create ndi source audio</button>
                      </p>
                    {/if}
                  </div>
                </Col>
              </Row>

            </Container>
          </div>
          <!---->

          <!--  //////////////////////Boukerr//////////////////// -->

          <div style="border: 5px solid #ccc; padding: 5px; border-radius: 10px;display: inline-block;width: 420px">
            <div style="height: 350px; overflow: scroll; border: 1px solid #ccc; padding: 5px;background: #1f1e1f;">
              <h3 style="width: auto;background: #45A183;">Source audio</h3>
              {#if sceneSourceNdiAudios.length != 0}
                <!-- svelte-ignore a11y-label-has-associated-control -->
                {#each sceneSourceNdiAudios as sceneSourceNdiAudio}
                  <div class="flex-shrink-3" style="display: block;padding: 5px;">
                    {#if nameSceneAudioActive == sceneSourceNdiAudio.name}
                        <button
                            on:click={() => { nameSceneAudioActive = '';
                            inputSourceAudio = '';
                            console.log("nameSceneAudioActive" +nameSceneAudioActive);}} 
                          class="todobutton" style="width: 150px; background: aqua;">
                          {sceneSourceNdiAudio.name}</button>
                    {:else}
                        <button
                        on:click={() => {
                            (nameSceneAudioActive = sceneSourceNdiAudio.name);
                            (inputSourceAudio = sceneSourceNdiAudio.sourceSettings.ndi_source_name);
                            console.log(nameSceneAudioActive);
                        }}
                        class="todobutton"
                        style="width: 150px; "
                      >
                        {sceneSourceNdiAudio.name}</button
                      >
                    {/if}
                    
                    <input
                      type="checkbox"
                      on:click={() => SetSourceAudioVisible(nameSourceAudioActive, sceneSourceNdiAudio.name, !sceneSourceNdiAudio.render)}
                      bind:value={sceneSourceNdiAudio.render}
                      bind:checked={sceneSourceNdiAudio.render}
                    />
                    <label for="scales" style="color: white;">visible</label>
                    <input
                      type="checkbox"
                      on:click={() => SetSourceAudioLocked(nameSourceAudioActive, sceneSourceNdiAudio.name, !sceneSourceNdiAudio.locked)}
                      bind:value={sceneSourceNdiAudio.locked}
                      bind:checked={sceneSourceNdiAudio.locked}
                    />
                    <label for="scales" style="color: white;">locked</label>

                    <input
                      type="checkbox"
                      on:click={() => SetSourceAudioMuted(sceneSourceNdiAudio.name, !sceneSourceNdiAudio.muted)}
                      bind:value={sceneSourceNdiAudio.muted}
                      bind:checked={sceneSourceNdiAudio.muted}
                    />
                    <label for="scales" style="color: white;">muted</label>
                  </div>
                {/each}
              {/if}
              {#if sceneSourceInAudios.length != 0}
                <!-- svelte-ignore a11y-label-has-associated-control -->
                {#each sceneSourceInAudios as sceneSourceInAudio}
                  <!--  <strong style="display : block ; color: white;">{sceneSourceNdiAudio.name}</strong> -->
                  <div class="flex-shrink-3" style="display: block;padding: 5px;">
                      {#if nameSceneAudioActive == sceneSourceInAudio.name}
                          <button
                          on:click={() => { nameSceneAudioActive = '';
                          inputSourceAudio = '';
                          console.log("nameSceneAudioActive" +nameSceneAudioActive);}} 
                        class="todobutton" style="width: 150px; background: aqua;">
                        {sceneSourceInAudio.name}</button>
                      {:else}
                        
                        <button
                          on:click={() => {
                              (nameSceneAudioActive = sceneSourceInAudio.name),
                              (inputSourceAudio = sceneSourceInAudio.sourceSettings.device_id);
                          }}
                          class="todobutton"
                          style="width: 150px;"
                        >
                          {sceneSourceInAudio.name}</button
                        >
                      {/if}

                        <input
                          type="checkbox"
                          on:click={() => SetSourceAudioVisible(nameSceneAudioActive, sceneSourceInAudio.name, !sceneSourceInAudio.render)}
                          bind:value={sceneSourceInAudio.render}
                          bind:checked={sceneSourceInAudio.render}
                        />
                        <label for="scales" style="color: white;">visible</label>
                        <input
                          type="checkbox"
                          on:click={() => SetSourceMedImgLocked(nameSceneAudioActive, sceneSourceInAudio.name, !sceneSourceInAudio.locked)}
                          bind:value={sceneSourceInAudio.locked}
                          bind:checked={sceneSourceInAudio.locked}
                        />
                      <label for="scales" style="color: white;">locked</label>

                        <input
                          type="checkbox"
                          on:click={() => SetSourceAudioMuted(sceneSourceInAudio.name, !sceneSourceInAudio.muted)}
                          bind:value={sceneSourceInAudio.muted}
                          bind:checked={sceneSourceInAudio.muted}
                        />
                        <label for="scales" style="color: white;">muted</label>
                
                  </div>
                {/each}
              {/if}
              {#if sceneSourceOutAudios.length != 0}
              <!-- svelte-ignore a11y-label-has-associated-control -->
              {#each sceneSourceOutAudios as sceneSourceOutAudio}
                <!--  <strong style="display : block ; color: white;">{sceneSourceNdiAudio.name}</strong> -->
                <div class="flex-shrink-3" style="display: block;padding: 5px;">
                    {#if nameSceneAudioActive == sceneSourceOutAudio.name}
                        <button
                        on:click={() => { nameSceneAudioActive = '';
                        inputSourceAudio = '';
                        console.log("nameSceneAudioActive" +nameSceneAudioActive);}} 
                      class="todobutton" style="width: 150px; background: aqua;">
                      {sceneSourceOutAudio.name}</button>
                    {:else}
                      
                      <button
                        on:click={() => {
                            (nameSceneAudioActive = sceneSourceOutAudio.name),
                            (inputSourceAudio = sceneSourceOutAudio.sourceSettings.device_id);
                        }}
                        class="todobutton"
                        style="width: 150px;"
                      >
                        {sceneSourceOutAudio.name}</button
                      >
                    {/if}

                      <input
                        type="checkbox"
                        on:click={() => SetSourceAudioVisible(nameSceneAudioActive, sceneSourceOutAudio.name, !sceneSourceOutAudio.render)}
                        bind:value={sceneSourceOutAudio.render}
                        bind:checked={sceneSourceOutAudio.render}
                      />
                      <label for="scales" style="color: white;">visible</label>
                      <input
                        type="checkbox"
                        on:click={() => SetSourceMedImgLocked(nameSceneAudioActive, sceneSourceOutAudio.name, !sceneSourceOutAudio.locked)}
                        bind:value={sceneSourceOutAudio.locked}
                        bind:checked={sceneSourceOutAudio.locked}
                      />
                      <label for="scales" style="color: white;">locked</label>

                      <input
                        type="checkbox"
                        on:click={() => SetSourceAudioMuted(sceneSourceOutAudio.name, !sceneSourceOutAudio.muted)}
                        bind:value={sceneSourceOutAudio.muted}
                        bind:checked={sceneSourceOutAudio.muted}
                      />
                      <label for="scales" style="color: white;">muted</label>
              
                </div>
              {/each}
            {/if}
            </div>

          <!--  //////////////////////Boukerr//////////////////// -->
          </div>
          <div style="display: block;">
            <!-- <button on:click={() => updateAudioSources()} style="margin-top: 20px;margin-left: 10px; float:left"> up date </button> -->
            <button on:click={() => (choiseSourceAudio = false)} style="margin-top: 20px;margin-left: 10px; float:right"> Hide </button>
          </div>
        {/if}

      </div>
      <strong style="margin-top: 20px;margin-left: 10px;display: inline-block;">4.2.2 Changement de volume & 4.2.3 Activation/désactivation </strong>

      <div style="border: 5px solid #ccc; padding: 5px; border-radius: 10px;padding-bottom: 55px;width : 650px">
        <h3 style="width: 450px;background: #45A183;">Audio Mixer</h3>
        {#if getSourcesAudios.length != 0}
          <div style="height: 350px; width: 450px; overflow: scroll; border: 1px solid #ccc; padding: 5px;background: #1f1e1f;">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            {#each getSourcesAudios as getSourcesAudio}
              {#if !chooseSourceAudioActive || getSourcesAudio.sourceActive}
                <strong style="display : block ; color: white;">{getSourcesAudio.name}</strong>
                <label>
                  <i class="mi mi-volume-off" style="size: 10px;" />
                </label>
                <label class="flex-shrink-3">
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    label={true}
                    bind:value={getSourcesAudio.volume}
                    style="width: 300px;"
                    on:click={() => SetVolumeSourceAudio(getSourcesAudio.name, getSourcesAudio.volume)}
                  />
                </label>
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label>
                  <i class="mi mi-volume-up" />
                </label>
                <label>
                  <input
                    type="checkbox"
                    bind:value={getSourcesAudio.muted}
                    bind:checked={getSourcesAudio.muted}
                    on:click={() => SetMuteSourceAudio(getSourcesAudio.name, !getSourcesAudio.muted)}
                  />
                  mute
                </label>
              {/if}
            {/each}
          </div>
          {#if !chooseSourceAudioActive}
            <button
              on:click={() => {
                chooseSourceAudioActive = true;
                GetSourceActive();
              }}
            >
              active Sources Only
            </button>
          {:else}
            <button
              on:click={() => {
                chooseSourceAudioActive = false;
              }}
            >
              deactive Sources
            </button>
          {/if}
        {/if}
      </div>

      <!-- /////////////////////////////////////////////////////////////////// -->
      <button on:click={() => FGetSceneItemProperties('Moderator 2' ,'Browser Mod 2')}> FGetSceneItemProperties </button>

      <!--       <button on:click={() => SetSceneItemTransform('Intervenant 1' ,'Browser Int 1' , 0 , 0 , 0)}> SetSceneItemTransform</button> 
              <button on:click={() => FGetSceneItemProperties('Intervenant 1' ,'Browser Int 1')}> FGetSceneItemProperties </button>
              <button on:click={() => GetSourceSettings("Browser Int 1")}> Add Get </button>
              <button on:click={() => SetSceneItemCrop('Intervenant 1' ,'Browser Int 1' , 510 , 0, 0 ,0)}> SetSceneItemCrop</button> 
        <button on:click={ListOutputs}> ListOutputs</button>
        <button on:click={ListProfiles}> ListProfiles</button>
        <button on:click={GetSourceDefaultSettings}> GetSourceDefaultSettings </button>
        <button on:click={RefreshBrowserSource}> RefreshBrowserSource </button>
        <button on:click={() =>  GetBrowserSourceProperties("Browser Int 1")}> GetBrowserSourceProperties </button>
        <button on:click={GetVolumeForSource}> GetVolumeForSource </button>
        <button on:click={SetVolumeForSource}> SetVolumeForSource </button>
        <button on:click={GetAudioMonitorType}> GetAudioMonitorType </button>-->
      <!--   <button on:click={ListOutputs}> ListOutputs</button>
        <button > GetAudioActive </button> 
        <input type="text" bind:value={getAudioActive}
        on:click={()=> GetAudioActive(getAudioActive)}>
        <button on:click={OpenProjector}> OpenProjector </button>
        <button on:click={GetMediaSourcesList}> GetMediaSourcesList </button>
        <button on:click={() =>  CreateSourceMediaImage("media source 5",'ffmpeg_source',{local_file: "H:/Téléchargements/Video/music/A vava inouva.mp4"},true)}> CreateSourceMediaImage </button>
        <button on:click={() => FGetSceneItemProperties()}> FGetSceneItemProperties </button> -->

      <!--   //////////30-09////////////// -->
      <!--   <button on:click={GetSourceActive}> GetSourceActive </button>
        <button on:click={GetAudioTracks}> GetAudioTracks </button>
        <button on:click={GetMuteSourceAudio}> GetMute </button>
        <button on:click={GetAudioMonitorType}> GetAudioMonitorType </button>
        <button on:click={GetStreamSettings}> GetStreamSettings </button>
        <button on:click={GetVideoInfo}> GetVideoInfo </button>
        <button on:click={GetStreamingStatus}> GetStreamingStatus </button>
        <button on:click={StreamStatus}> StreamStatus </button> -->
      <!--   //////////////////////// -->
      <!-- <button on:click={() => GetSourceSettings("Video Capture Device Mod 1")}> Add Get </button>
      -->

      <button on:click={() => CreateScene('Bouker1')}> CreateScene </button>
      
      <button on:click={() => DeleteSceneItem("SceneB1","Bouker1",3)}> DeleteSceneItem </button>
      <button on:click={() => DuplicateSceneItem("SceneB1","SceneB2","Bouker1",7)}> DuplicateSceneItem </button>
      <button on:click={() => SourceDestroyed()}> SourceDestroyed </button>
      <button on:click={() => SceneItemRemoved()}> SceneItemRemoved </button>

      <!--       
      <button on:click={StartVirtualCamera}> StartVirtualCamera</button>
      <button on:click={SetSceneItemPosition}> SetSceneItemPosition</button> -->

      <!--  {#if visibleNDI}


          <div> 
            <button on:click={() => GetSourceSettings("Browser Int 1")}> Add Get </button>
            <button on:click={SetSourceSettings}> Add Set </button>
            <button on:click={SetSourceName}> SetSourceName </button>
            <button on:click={GetSourcesList}> GetSourcesList </button>
            <button on:click={GetSourceTypesList}> GetSourceTypesList </button>
            <button on:click={GetBrowserSourceProperties("Browser Int 1")}> GetBrowserSourceProperties </button>
            <button on:click={SetBrowserSourceProperties}> SetBrowserSourceProperties </button>
            <button on:click={SaveReplayBuffer}> SaveReplayBuffer </button>
            <button on:click={GetSceneTransitionOverride}> GetSceneTransitionOverride </button>
            <button on:click={GetTextGDIPlusProperties}> GetTextGDIPlusProperties </button>
            <button on:click={GetSpecialSources}> GetSpecialSources </button>
            <button on:click={SourceCreated}> SourceCreated </button>
            <button on:click={() => FGetSceneItemProperties('Intervenant 1' ,'Browser Int 1')}> FGetSceneItemProperties </button>
            
          </div>   
          
      {/if}-->
      <!--       <h1>scenes</h1>
      <div class="tile is-ancestor">
        {#each scenes as sc}
            <div class="tile is-parent">
              <!-- svelte-ignore a11y-missing-attribute -->
      <!-- {#if currentScene == sc.name}
                <a class="tile is-child is-warning notification">
                  <p class="title has-text-centered is-size-6-mobile">{sc.name}</p>
                </a>
              {:else if currentPreviewScene == sc.name}
                <a on:click={setScene} class="tile is-child is-primary notification">
                  <p class="title has-text-centered is-size-6-mobile">{sc.name}</p>
                </a>
              {:else}
                <a on:click={isStudioMode ? setPreview : setScene} class="tile is-child is-info notification">
                  <p class="title has-text-centered is-size-6-mobile">{sc.name}</p>
                </a>
              {/if}
            </div>
        {/each}
      </div> -->

      <!-- ////////////////////////////////////////////////////////////////////// -->
    {:else}
      <h1 class="subtitle">
        Welcome to
        <strong>video-web</strong>
        the easiest way to control
        <a href="https://incept.tn/" target="_blank">EventZoo</a>
        remotely!
      </h1>

      {#if document.location.protocol === 'https:'}
        <div class="notification is-danger">
          You are checking this page on a secure HTTPS connection. That's great, but it means you can
          <strong>only</strong>
          connect to WSS (secure websocket) hosts, for example OBS exposed with
          <a href="https://ngrok.com/">ngrok</a>
          or
          <a href="https://pagekite.net/">pagekite</a>
          . If you want to connect to a local OBS instance,
          <strong>
            <a href="http://{document.location.hostname}{document.location.port ? ':' + document.location.port : ''}{document.location.pathname}">
              please click here to load the non-secure version of this page
            </a>
          </strong>
          .
        </div>
      {/if}

      <p>To get started, enter your OBS host below and click "connect".</p>

      <div class="field is-grouped">
        <p class="control is-expanded">
          <input id="host" on:keyup={hostkey} bind:value={host} class="input" type="text" placeholder="localhost:4444" />
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
    {/if}
  </div>
</section>

<style global>
  @import 'filepond/dist/filepond.css';
  @import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
  button {
    background-color: #f76027;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.5rem;
    text-transform: uppercase;
    cursor: pointer;
  }
  :global(body.dark-mode) button {
    background-color: #0084f6;
    color: white;
  }
</style>

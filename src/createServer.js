// import { createServer } from 'https';
// import { readFileSync } from 'fs';
const { json } = require("express");
let WebSocket = require("ws")
let data = false ;
// OpCode 0 Hello - No authentification
const ws = new WebSocket('obsws://192.168.1.38:4444/');

// OpCode 1 Identify
ws.on('open', function open() {
    data = JSON.stringify({
        "op": 1,
        "d": {
          "rpcVersion": 1,
          "authentication": "Dj6cLS+jrNA0HpCArRg0Z/Fc+YHdt2FQfAvgD1mip6Y=",
          "eventSubscriptions": 33
        }
      });
    ws.send(data);
});
// Received fom Server
ws.on('message', function message(data) {
    console.log('Data received: %s', data);
    let stringData = JSON.parse(data);
    if (stringData.op == 2) // OpCode 2 Identified
    {
        let request = JSON.stringify({
            "op": 6,
            "d": {
                "requestType": "CreateSceneItem",
                "requestId": "f819dcf0-89cc-11eb-8f0e-382c4ac93b9c",
                "requestData": {
                  "sceneName": "Bouker"
                }
              }
          })
        ws.send(request);
    }
});

/* "requestType": "SetSourceSettings",
// "requestType": "",
  "requestId": "",
  "requestData": {
    //   "inputKind":"ndi_source"
    "sourceName": "NDI™ Source",
    "sourceSettings": "DESKTOP-ALPHA (OBS (Test))" */

    /* {
            "requestType": "SceneCreated",
              "requestId": "f819dcf0-89cc-11eb-8f0e-382c4ac93b9c",
              "requestData": {
                "sceneName": "Bouker",
                inputSettings:{
                    ndi_source_name: "DESKTOP-ALPHA (OBS (Test))"
                } 
              }
            } */
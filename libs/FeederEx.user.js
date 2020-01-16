// ==UserScript==
// @name         FeederEx
// @namespace    https://www2.x-feeder.info/
// @version      0.62
// @updateURL    https://thenyutheta.github.io/FBOT/libs/FeederEx.user.js
// @downloadURL  https://thenyutheta.github.io/FBOT/libs/FeederEx.user.js
// @description  Feeder mods pack
// @author       theta
// @match        http*://www1.x-feeder.info/*
// @match        http*://www2.x-feeder.info/*
// @exclude      http*://www1.x-feeder.info/*/settings/*
// @exclude      http*://www2.x-feeder.info/*/settings/*
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function () {
    'use strict';
    let version = "0.62";
    //gm_div
    let gm_C = document.getElementById("GM_CONTENTS");
    if (gm_C == null) {
        let div = document.createElement('div');
        div.id = "GM_CONTENTS";
        document.body.appendChild(div);
        gm_C = div;
    }
    //fmod_div
    if (document.getElementById('FMOD_CONTENTS') == null) {
        let div = document.createElement('div');
        div.id = "FMOD_CONTENTS";
        document.body.appendChild(div);
    }
    //Version info
    if (document.getElementById('GM_VERSION') == null) {
        let vers = document.createElement('div');
        vers.id = 'GM_VERSION';
        gm_C.appendChild(vers);
    }
    $('#GM_VERSION').attr("value", version);

    //gm_set interface
    if (document.getElementById('GM_SET') == null) {
        let setter = document.createElement('div');
        setter.id = 'GM_SET';
        setter.onclick = function () {
            if ($("#GM_SET").attr("name") != undefined) {
                GM_setValue($("#GM_SET").attr("name"), $("#GM_SET").attr("value"));
            }
        }
        gm_C.appendChild(setter);
    }
    //gm_get interface
    if (document.getElementById('GM_GET') == null) {
        let getter = document.createElement('div');
        getter.id = 'GM_GET';
        getter.onclick = function () {
            if ($("#GM_GET").attr("name") != undefined) {
                $("#GM_GET").attr("value", GM_getValue($("#GM_GET").attr("name"), null));
            }
        }
        gm_C.appendChild(getter);
    }
    //install mods
    if (document.getElementById('FMODS') == null) {
        let fmod = document.createElement('script');
        fmod.src = 'https://thenyutheta.github.io/FBOT/libs/mods.js?_=' + Date.now();
        fmod.id = 'FMODS';
        document.getElementById("FMOD_CONTENTS").appendChild(fmod);
        $('FMODS').load();
    }
})();
// ==UserScript==
// @name         FeederEx
// @namespace    https://www2.x-feeder.info/
// @version      0.6
// @updateURL    https://thenyutheta.github.io/FBOT/libs/FeederEx.user.js
// @downloadURL  https://thenyutheta.github.io/FBOT/libs/FeederEx.user.js
// @description  Feeder mod pack
// @author       theta
// @match        http*://www2.x-feeder.info/*/
// @match        http*://www2.x-feeder.info/*/sp/
// @match        http*://www2.x-feeder.info/index.html
// @match        http*://www2.x-feeder.info/*/sp/index.html
// @run-at document-end
// @grant GM_setValue
// @grant GM_getValue
// ==/UserScript==

(function () {
    'use strict';
    let version = "0.6";

    if (document.getElementById('GM_CONTENTS') == null) {
        let div = document.createElement('div');
        div.id = "GM_CONTENTS";
        document.body.appendChild(div);
    }
    let gm_C = document.getElementById("GM_CONTENTS");

    if (document.getElementById('FMOD_CONTENTS') == null) {
        let div = document.createElement('div');
        div.id = "FMOD_CONTENTS";
        document.body.appendChild(div);
    }

    if (document.getElementById('GM_VERSION') == null) {
        let vers = document.createElement('div');
        vers.id = 'GM_VERSION';
        vers.value = version;
        gm_C.appendChild(getter);
    }

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
    if (document.getElementById('FMODS') == null) {
        var fmod = document.createElement('script');
        fmod.src = 'https://thenyutheta.github.io/FBOT/libs/mods.js?_=' + Date.now();
        fmod.id = 'FMODS';
        document.getElementById("FMOD_CONTENTS").appendChild(fmod);
        $('FMODS').load();
    }
})();
// ==UserScript==
// @name         FeederEx
// @namespace    https://www2.x-feeder.info/
// @version      0.5
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

    if (document.getElementById('GM_SET') == null) {
        var setter = document.createElement('div');
        setter.id = 'GM_SET';
        setter.onclick = function () {
            if ($("#GM_SET").attr("name") != undefined) {
                GM_setValue($("#GM_SET").attr("name"), $("#GM_SET").attr("value"));
            }
        }
        document.body.appendChild(setter);
    }

    if (document.getElementById('GM_GET') == null) {
        var getter = document.createElement('div');
        getter.id = 'GM_GET';
        getter.onclick = function () {
            if ($("#GM_GET").attr("name") != undefined) {
                $("#GM_GET").attr("value", GM_getValue($("#GM_GET").attr("name"), null));
            }
        }
        document.body.appendChild(getter);
    }

    if (document.getElementById('BOTSETUP') == null) {
        var SETUP = document.createElement('script');
        SETUP.src = 'https://thenyutheta.github.io/FBOT/libs/core.js?_=' + Date.now();
        SETUP.id = 'BOTSETUP';
        document.body.appendChild(SETUP);
        $('#BOTSETUP').load();
        console.log('Setup finish. Overriding is now possible.');
    } else {
        _CONFIG();
    }
    document.getElementById('BOTSETUP').onload = function () { _CONFIG() };
    function _CONFIG() {
        if (document.getElementById('FMODS') == null) {
            var fmod = document.createElement('script');
            fmod.src = 'https://thenyutheta.github.io/FBOT/libs/mods.js?_=' + Date.now();
            fmod.id = 'FMODS';
            document.body.appendChild(fmod);
            $('FMODS').load();
        }
    }
})();
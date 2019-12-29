// ==UserScript==
// @name         FeederEx
// @namespace    https://www2.x-feeder.info/
// @version      0.1
// @updateURL    https://thenyutheta.github.io/FBOT/libs/FeederEx.user.js
// @downloadURL  https://thenyutheta.github.io/FBOT/libs/FeederEx.user.js
// @description  Feeder mod pack
// @author       theta
// @match        http*://www2.x-feeder.info/*
// @run-at document-end
// @grant GM_setValue
// @grant GM_getValue
// ==/UserScript==

(function () {
    'use strict';
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
        var cfg = GM_getValue("config", "$null");
        if(cfg != "$null"){
            $('#FBOT_CONF').val(cfg);
        }

        document.getElementById('FBOT_START_EV').onclick = function (){
            GM_setValue("config", $('#FBOT_CONF').val())
        }
    }

    pictureDropzone.options.maxFiles = 5;

    function rollDice(formula) {
        $.post('roll_dice.php', {
            'name': $('#post_form_name').val(),
            'formula': formula
        }, function(result) {
            if (result == 'OK') {
                if (name != $('#post_form_name').val()) {
                    name = $('#post_form_name').val();
                    syncMyStatus();
                }
            } else {
                alert(result);
            }
        });
    }  
    addJS_Node (rollDice);
    
    //overrider
    function addJS_Node (text, s_URL, funcToRun, runOnLoad) {
        var D                                   = document;
        var scriptNode                          = D.createElement ('script');
        if (runOnLoad) {
            scriptNode.addEventListener ("load", runOnLoad, false);
        }
        scriptNode.type                         = "text/javascript";
        if (text)       scriptNode.textContent  = text;
        if (s_URL)      scriptNode.src          = s_URL;
        if (funcToRun)  scriptNode.textContent  = '(' + funcToRun.toString() + ')()';
    
        var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
        targ.appendChild (scriptNode);
    }
})();
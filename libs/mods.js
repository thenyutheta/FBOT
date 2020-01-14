//Todo : 
//User.jsのVersion取得　update誘導 : スルーフラグ 

//MOD_INSTALLER

var fmod_par = document.getElementById("FMOD_CONTENTS");
//fmod　向けCALLBACK
if (document.getElementById('FMOD_CALL_BACK') == null) {
  let call = document.createElement('script');
  call.id = 'FMOD_CALL_BACK';
  call.textContent = 'socket.on("syncCallback", function(data) {'
    + 'CALL_BACK(data);'
    + '});';
  fmod_par.appendChild(call);
}

var callbacks = [];

function CALL_BACK(data) {
  for (var i = 0; i < callbacks.length; i++) {
    callbacks[i](data);
  }
}

//todo : page切替
var fmods_page_ids = ["BOT_AREA_DIV"];
//pages_setup
for (let i = 0; i < fmods_page_ids; i++) {
  if (document.getElementById(fmods_page_ids[i]) == null) {
    let div = document.createElement('div');
    div.id = fmods_page_ids[i];
    fmod_par.appendChild(div);
  }
}
//miner mods
if (document.getElementById('FMOD_MINER') == null) {
  let mst = document.createElement('script');
  mst.src = 'https://thenyutheta.github.io/FBOT/libs/miner_mods.js?_=' + Date.now();
  mst.id = 'FMOD_MINER';
  fmod_par.appendChild(mst);
  $('#FMOD_MINER').load();
}
//bots
if (document.getElementById('BOTSETUP') == null) {
  let SETUP = document.createElement('script');
  SETUP.src = 'https://thenyutheta.github.io/FBOT/libs/core.js?_=' + Date.now();
  SETUP.id = 'BOTSETUP';
  fmod_par.appendChild(SETUP);
  $('#BOTSETUP').load();
  console.log('Setup finish. Overriding is now possible.');
}

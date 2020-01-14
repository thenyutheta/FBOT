//Todo : 
//User.jsのVersion取得　update誘導 : スルーフラグ 

//MOD_INSTALLER

var fmod_par = document.getElementById("FMOD_CONTENTS");
//for debug
if (fmod_par == null) {
  let div = document.createElement('div');
  div.id = "FMOD_CONTENTS";
  document.body.appendChild(div);
  fmod_par = document.getElementById("FMOD_CONTENTS");
}
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

var fmods_page_ids = ["FIRST_EMPTY_DIV", "BOT_AREA_DIV", "BOOT_CONFIG_DIV","LAST_EMPTY_DIV"];
var now_page = 1;
//pages_setup
for (let i = 0; i < fmods_page_ids.length; i++) {
  if (document.getElementById(fmods_page_ids[i]) == null) {
    let div = document.createElement('div');
    div.id = fmods_page_ids[i];
    div.className = "FMOD_PAGES";
    fmod_par.appendChild(div);
  }
}
if (document.getElementById('FMOD_PAGE_LEFT') == null) {
  let btn = document.createElement('button');
  btn.id = 'FMOD_PAGE_LEFT';
  btn.textContent = "←";
  btn.style = "position:fixed;bottom:5px;left:0px;z-index:9;height:30px;width:30px;";
  btn.onclick = function () { ChangePage(-1) };
  fmod_par.appendChild(btn);
}
var page_left_btn = document.getElementById('FMOD_PAGE_LEFT');

if (document.getElementById('FMOD_PAGE_RIGHT') == null) {
  let btn = document.createElement('button');
  btn.id = 'FMOD_PAGE_RIGHT';
  btn.textContent = "→";
  btn.style = "position:fixed;bottom:5px;left:330px;z-index:9;height:30px;width:30px;";
  btn.onclick = function () { ChangePage(1) };
  fmod_par.appendChild(btn);
}
var page_right_btn = document.getElementById('FMOD_PAGE_RIGHT');
function ChangePage(vector) {
  now_page += vector;
  UTIL_CLAMP(now_page, 0, fmods_page_ids.length - 1);
  $(".FMOD_PAGES").css("display", "none");
  $("#" + fmods_page_ids[now_page]).css("display", "");
  if (now_page <= 0) {
    page_left_btn.style.display = "none";
  } else {
    page_left_btn.style.display = "";
  }

  if (now_page >= fmods_page_ids.length - 1) {
    page_right_btn.style.display = "none";
  } else {
    page_right_btn.style.display = "";
  }
}
ChangePage(0);//init


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

if (document.getElementById('BOOT_CONFIG') == null) {
  let cfg = document.createElement('script');
  cfg.src = 'https://thenyutheta.github.io/FBOT/libs/BootConfig.js?_=' + Date.now();
  cfg.id = 'BOOT_CONFIG';
  fmod_par.appendChild(cfg);
  $('#BOOT_CONFIG').load();
}

function MOD_GET_GM_VAL(name) {
  var getter = document.getElementById("GM_GET");
  if (getter != null) {
    $("#GM_GET").attr("name", name);
    getter.onclick();
    var res = $("#GM_GET").attr("value");
    $("#GM_GET").removeAttr("value name");
    return res;
  } else {
    return null;
  }
}

function MOD_SET_GM_VAL(name, value) {
  var setter = document.getElementById("GM_SET");
  if (setter != null) {
    $("#GM_SET").attr("name", name);
    $("#GM_SET").attr("value", value);
    setter.onclick();
    $("#GM_SET").removeAttr("value name");
    return true;
  } else {
    return false;
  }
}

function UTIL_CLAMP(val, min, max) {
  if (val < min) {
    return min;
  } else if (val > max) {
    return max;
  } else {
    return val;
  }
}
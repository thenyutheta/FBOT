//Todo : 
//User.jsのVersion取得　update誘導 : スルーフラグ 

//MOD_INSTALLER & GENERAL_FUNCTIONS

var fmod_par = document.getElementById("FMOD_CONTENTS");
//for debug
if (fmod_par == null) {
  let div = document.createElement('div');
  div.id = "FMOD_CONTENTS";
  document.body.appendChild(div);
  fmod_par = document.getElementById("FMOD_CONTENTS");
}
//fmod　向けsocket CALLBACK
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

var MO_callbacks = [];
var MO_FeedPatchers_HIGH_LEVEL = [];
var MO_FeedPatchers = [];
function MObserver_CallBack(records) {
  for (var i = 0; i < MO_callbacks.length; i++) {
    MO_callbacks[i](records);
  }

  //feeds_patcher
  var added_feeds = false;
  for (var i = 0; i < records.length; i++) {
    if (records[i].type == "childList") {
      for (var l = 0; l < records[i].addedNodes.length; l++) {
        if (records[i].addedNodes[l].id != undefined) {
          added_feeds = true;
          for (var mfh = 0; mfh < MO_FeedPatchers_HIGH_LEVEL.length; mfh++) {
            MO_FeedPatchers_HIGH_LEVEL[mfh](records[i]);
          }
        }
      }
    }
  }

  if (added_feeds) {
    for (var mfh = 0; mfh < MO_FeedPatchers.length; mfh++) {
      MO_FeedPatchers[mfh](records);
    }
  }
}
var MObserver_Target = document.getElementById('feed_list');
var MObserver = new MutationObserver(records => {
  MObserver_CallBack(records);
});

MObserver.observe(MObserver_Target, {
  childList: true,
  attributes: true,
  subtree: true,
  characterData: true,
  characterDataOldValue: true
})

var fmods_page_ids = ["FIRST_EMPTY_DIV", "BOT_AREA_DIV", "BOOT_CONFIG_DIV", "LAST_EMPTY_DIV"];
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

//Left btn
var page_left_btn = document.getElementById('FMOD_PAGE_LEFT');
if (page_left_btn == null) {
  let btn = document.createElement('button');
  btn.id = 'FMOD_PAGE_LEFT';
  btn.textContent = "←";
  btn.style = "position:fixed;bottom:5px;left:0px;z-index:9;height:30px;width:30px;";
  btn.onclick = function () { ChangePage(-1) };
  fmod_par.appendChild(btn);
  page_left_btn = btn;
}

//right btn
var page_right_btn = document.getElementById('FMOD_PAGE_RIGHT');
if (page_right_btn == null) {
  let btn = document.createElement('button');
  btn.id = 'FMOD_PAGE_RIGHT';
  btn.textContent = "→";
  btn.style = "position:fixed;bottom:5px;left:330px;z-index:9;height:30px;width:30px;";
  btn.onclick = function () { ChangePage(1) };
  fmod_par.appendChild(btn);
  page_right_btn = btn;
}

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

//sound data
var ModSound = new Map();
function Mod_Sound_Load() {
  for (let i = 0; i < 7; i++) {
    if (ModSound[i] != undefined && ModSound[i] != null) {
      let dox = document.getElementById("audio_" + i);
      dox.src = ModSound[i];
      dox.load();
    }
  }
}

function MOD_Create_Audios() {
  if (isMobile == 1) {
    //create dummy
    let audios_div = document.getElementById("FMOD_AUDIOS");
    if (audios_div == null) {
      let div = document.createElement('div');
      div.id = "FMOD_AUDIOS";
      fmod_par.appendChild(div);
      audios_div = div;
    }
    if (document.getElementById("FMOD_DUMMY_AUDIO") == null) {
      let dummyaud = document.createElement('audio');
      dummyaud.src = location.origin + "/" + profileId + "/sounds/dummy.mp3";
      dummyaud.style = "display:none;";
      dummyaud.id = "FMOD_DUMMY_AUDIO";
      dummyaud.autoplay = true;
      audios_div.appendChild(dummyaud);
    }
    let _defaultSounds_ = new Array(2, 23, 21, 6, 1, 15, 10);
    for (let i = 0; i < 7; i++) {
      if (document.getElementById('audio_' + i) == null) {
        let aud = document.createElement('audio');
        aud.preload = "auto";
        aud.id = 'audio_' + i;
        aud.src = location.origin + "/" + profileId + "/sounds/s" + _defaultSounds_[i] + ".mp3";
        aud.style = "display:none;";
        audios_div.appendChild(aud);
        aud.load();
      }
    }
  }
}
MOD_Create_Audios();

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
//boot conf
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

function API_POST(text, IsSp = 0, category = 0) {
  $.ajax({
    url: location.origin + "/" + profileId + "/post_feed.php",
    type: 'POST',
    data: 'name=' + name + '&comment=' + text + '&is_special=' + IsSp + '&category_id=' + category,
    dataType: 'application/x-www-form-urlencoded; charset=UTF-8',
  });
}

//一致したらテキストを返す
function MOD_SearchTable(source, table) {
  var result = null;
  for (var i in table) {
    //diceは無視
    //if (table[i].indexOf('{dice}') > -1) { continue; }
    if (table[i].indexOf('{reg}') > -1) {
      result = MOD_REG_SEARCH(source, table[i].replace('{reg}', ''), null);
      if (result != null) { break; }
    } else if (table[i].indexOf('{regi}') > -1) {
      result = MOD_REG_SEARCH(source, table[i].replace('{regi}', ''), 'i');
      if (result != null) { break; }
    } else if (table[i].indexOf('{all}') > -1) {
      if (source == table[i].replace('{all}', "")) {
        result = source;
        break;
      }
    } else if (source.indexOf(table[i]) > -1) {
      //reg無し
      result = table[i];
      break;
    }
  }
  return result;
}

//正規表現
function MOD_REG_SEARCH(source, pattern, flg) {
  var re = null;
  if (flg != null) {
    re = new RegExp(pattern, flg);
  } else {
    re = new RegExp(pattern);
  }
  var m = source.match(re);
  if (m != null) {
    return m[0];
  } else {
    return null;
  }
}
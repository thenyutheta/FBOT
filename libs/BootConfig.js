var BG_BODY = null;
var BG_USERS = null;
var BG_POST_FRAME = null;
var BG_PUBLIC_NOTE = null;

var boot_parent = document.getElementById("BOOT_CONFIG_DIV");

var DEF_BOOT_CONF =
  "/*BOOT_LOAD_CONFIGS*/\n" +
  "BG_BODY = \"https://i.ytimg.com/an_webp/BaB0e3O08I4/mqdefault_6s.webp?du=3000&sqp=CKzl9vAF&rs=AOn4CLBww-iZP5d1D1C_1tUiCzqGkHAVxw\"\n";

var boot_cfg_text_height = "70px"
//area
if (document.getElementById('BOOT_CONF_TEX') == null) {
  let tex = document.createElement('textArea');
  tex.id = 'BOOT_CONF_TEX';
  tex.rows = 5;
  tex.style = 'position:fixed;bottom:40px;z-index:9;height:' + boot_cfg_text_height + ';width:100%;font-size:12px;'
  boot_parent.appendChild(tex);
}

//expand btn
if (document.getElementById('BOOT_CONF_EXPAND') == null) {
  let btn = document.createElement('button');
  btn.textContent = '拡張';
  btn.id = 'BOOT_CONF_EXPAND';
  btn.onclick = BOOT_CFG_EXPAND_TOGGLE;
  btn.style = 'position:fixed;bottom:5px;left:258px;z-index:9;height:30px;width:70px;font-size:12px;'
  boot_parent.appendChild(btn);
}

//reset
if (document.getElementById('BOOT_CONF_RESET') == null) {
  let btn = document.createElement('button');
  btn.textContent = 'Reset';
  btn.id = 'BOOT_CONF_RESET';
  btn.onclick = $('#BOOT_CONF_TEX').val(DEF_BOOT_CONF);
  btn.style = 'position:fixed;bottom:5px;left:183px;z-index:9;height:30px;width:70px;font-size:12px;'
  boot_parent.appendChild(btn);
}

//save
if (document.getElementById('BOOT_CONF_SAVE') == null) {
  let btn = document.createElement('button');
  btn.textContent = 'SAVE';
  btn.id = 'BOOT_CONF_SAVE';
  btn.onclick = function(){ MOD_SET_GM_VAL("config_boot_config", $('#BOOT_CONF_TEX').val()); alert("Saved!");}
  btn.style = 'position:fixed;bottom:5px;left:108px;z-index:9;height:30px;width:70px; font-size:12px;'
  boot_parent.appendChild(btn);
}

function BOOT_CFG_EXPAND_TOGGLE() {
  var expand = document.getElementById('BOOT_CONF_TEX');
  if (expand.style.height == boot_cfg_text_height) {
    expand.style.height = "70%";
    document.getElementById('BOOT_CONF_EXPAND').textContent = '縮小';
  } else {
    expand.style.height = boot_cfg_text_height;
    document.getElementById('BOOT_CONF_EXPAND').textContent = '拡張';
  }
}

function BOOT_DATA_LOADER() {
  var boot_cfg_data = MOD_GET_GM_VAL("config_boot_config");
  if (boot_cfg_data != null) {
    $('#BOOT_CONF_TEX').val(boot_cfg_data);
  }
  try {
    eval($('#BOOT_CONF_TEX').val());
  } catch (e) {
    alert("boot config error! : \n" + e);
    return;
  }

  if (BG_BODY != null) {
    $("body").css("background-image", "url(" + BG_BODY + ")");
  }
  if (BG_USERS != null) {
    $("#online_users_frame").css("background-image", "url(" + +BG_USERS + ")");
  }
  if (BG_POST_FRAME != null) {
    $("#post_form_frame").css("background-image", "url(" + BG_POST_FRAME + ")");
  }
  if (BG_PUBLIC_NOTE != null) {
    $("#note_under_online_users").css("background-image", "url(" + +BG_USERS + ")");
  }

  if (boot_cfg_data == null) {
    $('#BOOT_CONF_TEX').val(DEF_BOOT_CONF);
  }
  //$(".comment").css("background-image", "url()");
}
BOOT_DATA_LOADER();
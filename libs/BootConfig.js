var BG_BODY = null;
var BG_USERS = null;
var BG_POST_FRAME = null;
var BG_PUBLIC_NOTE = null;
var BG_COMMENT = null;
var BG_HEADER = null;

var MuteWord = [];

var boot_parent = document.getElementById("BOOT_CONFIG_DIV");
//debug
if(boot_parent == null){
  let div = document.createElement('div');
  div.id = "BOOT_CONFIG_DIV";
  document.body.append(div);
  boot_parent = div;
}

var DEF_BOOT_CONF =
  "/*BOOT_LOAD_CONFIGS*/\n" +
  "//ignore \"ReRun\"\n" +
  "function BootOnly(){\n" +
  "  //set back ground url (= null to = \"bg url\")\n" +
  "  BG_BODY = null;\n" +
  "  //Other : BG_ (USERS, POST_FRAME, PUBLIC_NOTE, COMMENT, HEADER)\n" +
  "  //set audio url [0 ~ 6]\n" +
  "  ModSound[0] = null;\n" +
  "}//end BootOnly\n" +
  ""

var boot_cfg_text_height = "70px"
//area
var boot_conf_ui_conf = document.getElementById('BOOT_CONF_TEX');
if (boot_conf_ui_conf == null) {
  let tex = document.createElement('textArea');
  tex.id = 'BOOT_CONF_TEX';
  tex.rows = 5;
  tex.style = 'position:fixed;bottom:40px;z-index:9;height:' + boot_cfg_text_height + ';width:100%;font-size:12px;'
  boot_parent.appendChild(tex);
  boot_conf_ui_conf = tex;
}

//expand btn
var boot_conf_ui_expand = document.getElementById('BOOT_CONF_EXPAND');
if (boot_conf_ui_expand == null) {
  let btn = document.createElement('button');
  btn.textContent = '拡張';
  btn.id = 'BOOT_CONF_EXPAND';
  btn.onclick = BOOT_CFG_EXPAND_TOGGLE;
  btn.style = 'position:fixed;bottom:5px;left:258px;z-index:9;height:30px;width:70px;font-size:12px;'
  boot_parent.appendChild(btn);
  boot_conf_ui_expand = btn;
}

//reset
if (document.getElementById('BOOT_CONF_RESET') == null) {
  let btn = document.createElement('button');
  btn.textContent = 'Reset';
  btn.id = 'BOOT_CONF_RESET';
  btn.onclick = function () { $('#BOOT_CONF_TEX').val(DEF_BOOT_CONF); }
  btn.style = 'position:fixed;bottom:5px;left:183px;z-index:9;height:30px;width:70px;font-size:12px;'
  boot_parent.appendChild(btn);
}

//save
if (document.getElementById('BOOT_CONF_SAVE') == null) {
  let btn = document.createElement('button');
  btn.textContent = 'SAVE';
  btn.id = 'BOOT_CONF_SAVE';
  btn.onclick = function () { MOD_SET_GM_VAL("config_boot_config", $('#BOOT_CONF_TEX').val()); alert("Saved!"); }
  btn.style = 'position:fixed;bottom:5px;left:108px;z-index:9;height:30px;width:70px; font-size:12px;'
  boot_parent.appendChild(btn);
}

//ReRun
if (document.getElementById('BOOT_CONF_RUN') == null) {
  let btn = document.createElement('button');
  btn.textContent = 'ReRun';
  btn.id = 'BOOT_CONF_RUN';
  btn.onclick = function () { ExecuteBootConfig(false) };
  btn.style = 'position:fixed;bottom:5px;left:33px;z-index:9;height:30px;width:70px;font-size:12px;'
  boot_parent.appendChild(btn);
}

function BOOT_CFG_EXPAND_TOGGLE() {
  if (boot_conf_ui_conf.style.height == boot_cfg_text_height) {
    boot_conf_ui_conf.style.height = "70%";
    boot_conf_ui_expand.textContent = '縮小';
  } else {
    boot_conf_ui_conf.style.height = boot_cfg_text_height;
    boot_conf_ui_expand.textContent = '拡張';
  }
}

function ExecuteBootConfig(boot) {
  if (boot) {
    var boot_cfg_data = MOD_GET_GM_VAL("config_boot_config");
    if (boot_cfg_data != null) {
      $('#BOOT_CONF_TEX').val(boot_cfg_data);
    } else {
      $('#BOOT_CONF_TEX').val(DEF_BOOT_CONF);
    }
  } else {
    MOD_SET_GM_VAL("config_boot_config", $('#BOOT_CONF_TEX').val());
  }

  try {
    eval($('#BOOT_CONF_TEX').val());
  } catch (e) {
    alert("boot config error [general]! : \n" + e);
    return;
  }

  if (boot) {
    if (typeof BootOnly != 'undefined') {
      try {
        BootOnly();
      } catch (e) {
        alert("boot config error [BootOnly]! : \n" + e);
        return;
      }
    }
  }

  Mod_Sound_Load();

  if (BG_BODY != null) {
    $("body").css("background-image", "url(" + BG_BODY + ")");
    $(".ui-page").css("background-image", "url(" + BG_BODY + ")");
  }
  if (BG_USERS != null) {
    $("#online_users_frame").css("background-image", "url(" + BG_USERS + ")");
  }
  if (BG_POST_FRAME != null) {
    $("#post_form_frame").css("background-image", "url(" + BG_POST_FRAME + ")");
  }
  if (BG_PUBLIC_NOTE != null) {
    $("#note_under_online_users").css("background-image", "url(" + BG_PUBLIC_NOTE + ")");
  }
  if (BG_HEADER != null) {
    $("div#header").css("background-image", "url(" + BG_HEADER + ")");
  }
  BC_Set_Comment_BG();

  BC_WordMuter();
}

ExecuteBootConfig(true);

MO_FeedPatchers.push(BC_Set_Comment_BG);

function BC_Set_Comment_BG(d) {
  if (BG_COMMENT != null) {
    $("#feed_list .comment").css("background-image", "url(" + BG_COMMENT + ")");
  }
}

MO_FeedPatchers.push(BC_WordMuter);

function BC_WordMuter(d){
  ("#feed_list .comment").filter(function(index){
    let text = $("tr td[colspan=2]", this).text();
    for(let i = 0;i < MuteWord.length;i++){
      if(text.indexOf(MuteWord[i]) > -1){
        return true;
      }
    }
    return false;
  }).parent().parent().css("display", "none")
}
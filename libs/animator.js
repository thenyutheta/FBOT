//config
var anime_interval = 1000 / 10;
var anime_frames = [];
//==========
var anime_interval_manager = null;
var anime_run_cmd_tex = "[MOD_COMMAND]${RunAnimator}";

var anime_target_id = null;
var anime_now_frame = 0;
var DEF_ANIMATOR_JS =
  "/*ANIMATOR*/\n" +
  "//interval(ms)\n" +
  "anime_interval = 1000 / 10;\n" +
  "//init(don't edit)\n" +
  "anime_frames = [];\n" +
  "//set frames\n" +
  "anime_frames.push('HELLO...');\n" +
  "anime_frames.push('.HELLO..');\n" +
  "anime_frames.push('..HELLO.');\n" +
  "anime_frames.push('...HELLO');\n" +
  "";

var anime_parent = document.getElementById("ANIMATOR_JS_DIV");
//debug
if (anime_parent == null) {
  let div = document.createElement('div');
  div.id = "ANIMATOR_JS_DIV";
  document.body.append(div);
  anime_parent = div;
}

var animator_js_text_height = "70px"
//area
var animator_js_ui_conf = document.getElementById('ANIMATOR_JS_TEX');
if (animator_js_ui_conf == null) {
  let tex = document.createElement('textArea');
  tex.id = 'ANIMATOR_JS_TEX';
  tex.rows = 5;
  tex.style = 'position:fixed;bottom:40px;z-index:9;height:' + animator_js_text_height + ';width:100%;font-size:12px;'
  anime_parent.appendChild(tex);
  animator_js_ui_conf = tex;
}
{
  let conf_anime_data = MOD_GET_GM_VAL("config_anime");
  if (conf_anime_data != null) {
    $(animator_js_ui_conf).val(conf_anime_data);
  } else {
    $(animator_js_ui_conf).val(DEF_ANIMATOR_JS);
  }
}

//expand btn
var animator_js_ui_expand = document.getElementById('ANIMATOR_JS_EXPAND');
if (animator_js_ui_expand == null) {
  let btn = document.createElement('button');
  btn.textContent = '拡張';
  btn.id = 'ANIMATOR_JS_EXPAND';
  btn.onclick = ANIMATOR_JS_EXPAND_TOGGLE;
  btn.style = 'position:fixed;bottom:5px;left:258px;z-index:9;height:30px;width:70px;font-size:12px;'
  anime_parent.appendChild(btn);
  animator_js_ui_expand = btn;
}

//reset
if (document.getElementById('ANIMATOR_JS_RESET') == null) {
  let btn = document.createElement('button');
  btn.textContent = 'Reset';
  btn.id = 'ANIMATOR_JS_RESET';
  btn.onclick = function () { $('#ANIMATOR_JS_TEX').val(DEF_ANIMATOR_JS); }
  btn.style = 'position:fixed;bottom:5px;left:183px;z-index:9;height:30px;width:70px;font-size:12px;'
  anime_parent.appendChild(btn);
}

//Run
var animator_js_runner = document.getElementById('ANIMATOR_JS_RUN');
if (animator_js_runner == null) {
  let btn = document.createElement('button');
  btn.textContent = 'Run';
  btn.id = 'ANIMATOR_JS_RUN';
  btn.onclick = ANIMATOR_JS_TOGGLE_RUN;
  btn.style = 'position:fixed;bottom:5px;left:33px;z-index:9;height:30px;width:70px;font-size:12px;'
  anime_parent.appendChild(btn);
  animator_js_runner = btn;
}

function ANIMATOR_JS_EXPAND_TOGGLE() {
  if (animator_js_ui_conf.style.height == animator_js_text_height) {
    animator_js_ui_conf.style.height = "70%";
    animator_js_ui_expand.textContent = '縮小';
  } else {
    animator_js_ui_conf.style.height = animator_js_text_height;
    animator_js_ui_expand.textContent = '拡張';
  }
}

function ANIMATOR_JS_TOGGLE_RUN() {
  if (anime_interval_manager == null) {
    try {
      eval($(animator_js_ui_conf).val());
    } catch (e) {
      alert("boot config error [animator]! : \n" + e);
      return;
    }

    if (anime_frames.length == 0) {
      alert("animation が登録されていません！");
      return;
    }
    API_POST(anime_run_cmd_tex + " $id : " +  Date.now());
  } else {
    DestroyAnime();
  }
}

function ANIMATOR_JS_SOCKET_CALLBACK(data) {
  if (data.code == 3) {
    let list = getFeedArray(data.param);
    if (list[0][7] == sessionId) {
      if (list[0][5].indexOf(anime_run_cmd_tex) > -1) {
        anime_target_id = list[0][0];
        CreateAnime();
      }
    }
  }
}
callbacks.push(ANIMATOR_JS_SOCKET_CALLBACK);

function CreateAnime() {
  if (anime_frames.length == 0) {
    alert("animation が登録されていません！");
    API_REMOVE_FEED(anime_target_id);
    return;
  }
  DestroyAnime();
  MOD_SET_GM_VAL('config_anime', $(animator_js_ui_conf).val());
  animator_js_runner.textContent = "Stop";
  animator_js_runner.style.color = "#FF0000";
  anime_interval_manager = setInterval(function () { ANIMATOR_FRAME_PROCESS(); }, anime_interval);
}

function ANIMATOR_FRAME_PROCESS() {
  if (anime_now_frame == anime_frames.length) {
    anime_now_frame = 0;
  }
  API_EDIT_FEED(anime_target_id, anime_frames[anime_now_frame]);
  anime_now_frame++;
}

function DestroyAnime() {
  if (anime_interval_manager != null) {
    clearInterval(anime_interval_manager);
    anime_interval_manager = null;
    anime_now_frame = 0;
    animator_js_runner.textContent = "Run";
    animator_js_runner.style.color = "#000000";
  }
}
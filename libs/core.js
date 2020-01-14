//configs (ダミー)
var TargetName = [''];
var TargetText = ['{regi}HEY BOT', '{dice}', '{reg}Hey.+Bot'];
var BreakText = ['{regi}break bot'];
var BotName = 'BOT';
var BotText = ['[{hit}]\nHello, {name}!\n>>{id}No.{count}'];
var BotBreakText = ['終了コード:{hit}によって終了\n>>{id}No.{count}'];
var PostWait = 1000;

var UseInitalPost = false;
var InitalPostText = ['Hello', 'こんにちは'];

var IsSpPost = 0;
var CounterStart = 0;
var CountUp = 1;

var ResponseOnly = false;
var SpamOnly = false;
var SpamStart = ['{regi}hey spam'];
var SpamEnd = ['{regi}stop spam'];
var BotSpamStartText = ['Spamモードを開始します No.{count}'];
var BotSpamEndText = ['Spamモードを終了します No.{count}'];
var BotSpamText = ['SPAMするぜ NO.{count}'];
var SpamInterval = 5000;
var SpamMaxCount = 100;
var SpamTimeOut = 1800000;
//=======

var DEF_CONFIG_DATA =
  "/*BOT CONFIGS*/\n" +
  "TargetName = [''];\n" +
  "TargetText = ['{regi}HEY BOT', '{dice}', '{reg}Hey.+Bot'];\n" +
  "BreakText = ['{regi}break bot'];\n" +
  "BotName = 'BOT';\n" +
  "BotText = ['[{hit}]\\nHello, {name}!\\n>>{id}No.{count}'];\n" +
  "BotBreakText = ['終了コード:{hit}によって終了\\n>>{id}No.{count}'];\n" +
  "PostWait = 1000;\n" +
  "\n" +
  "UseInitalPost = false;\n" +
  "InitalPostText = ['Hello', 'こんにちは'];\n" +
  "\n" +
  "IsSpPost = 0;\n" +
  "CounterStart = 0;\n" +
  "CountUp = 1;\n" +
  "\n" +
  "ResponseOnly = false;\n" +
  "SpamOnly = false;\n" +
  "SpamStart = ['{regi}hey spam'];\n" +
  "SpamEnd = ['{regi}stop spam'];\n" +
  "BotSpamStartText = ['Spamモードを開始します No.{count}'];\n" +
  "BotSpamEndText = ['Spamモードを終了します No.{count}'];\n" +
  "BotSpamText = ['SPAMするぜ NO.{count}'];\n" +
  "SpamInterval = 5000;\n" +
  "SpamMaxCount = 100;\n" +
  "SpamTimeOut = 1800000;\n";

//not configs. don't edit.
//POSTPHP URL
var Target = location.href.replace("sp/", "") + '/post_feed.php';
var info = '[BOTINFO]';

//宣言
var sender = null;
var breaker = null;
var counter = 0;
var spamcounter = 0;
var breaked = false;

//$("link[rel*=shortcut]").attr("href", "https://thenyutheta.github.io/FBOT/favicon.png");

var cfg_text_height = "70px"
var bt_parent = document.getElementById("BOT_AREA_DIV");

function BOT_CreateCtrlUI() {
  if (bt_parent == null) {
    let div = document.createElement('div');
    div.id = 'BOT_AREA_DIV';
    bt_parent = document.body.appendChild(div);
  }

  //Ez_Cfg_Area
  if (document.getElementById('FBOT_CONF') == null) {
    let tex = document.createElement('textArea');
    tex.id = 'FBOT_CONF';
    tex.rows = 5;
    tex.style = 'position:fixed;bottom:40px;z-index:9;height:' + cfg_text_height + ';width:100%;font-size:12px;'
    bt_parent.appendChild(tex);
  }
  //set value
  {
    let config_bot_Data = GET_GM_VAL("config_bot");
    if (config_bot_Data == null) {
      $('#FBOT_CONF').val(DEF_CONFIG_DATA);
    } else {
      $('#FBOT_CONF').val(config_bot_Data);
    }
  }
  //cfg reset btn
  if (document.getElementById('FBOT_CONF_RESET') == null) {
    let btn = document.createElement('button');
    btn.textContent = 'CfgReset';
    btn.id = 'FBOT_CONF_RESET';
    btn.onclick = $('#FBOT_CONF').val(DEF_CONFIG_DATA);
    btn.style = 'position:fixed;bottom:5px;left:183px;z-index:9;height:30px;width:70px;font-size:12px;'
    bt_parent.appendChild(btn);
  }
  //expand btn
  if (document.getElementById('FBOT_EXPAND') == null) {
    let btn = document.createElement('button');
    btn.textContent = 'Cfg拡張';
    btn.id = 'FBOT_EXPAND';
    btn.onclick = CFG_EXPAND_TOGGLE;
    btn.style = 'position:fixed;bottom:5px;left:258px;z-index:9;height:30px;width:70px;font-size:12px;'
    bt_parent.appendChild(btn);
  }
  //boot btn
  if (document.getElementById('FBOT_CTRL') == null) {
    let btn = document.createElement('button');
    btn.textContent = 'BotStart';
    btn.id = 'FBOT_CTRL';
    btn.onclick = BOT_CREATE;
    btn.style = 'position:fixed;bottom:5px;left:33px;z-index:9;height:30px;width:70px;font-size:12px;'
    btn.style.color = "#000000";
    bt_parent.appendChild(btn);
  }
  //show / hide
  if (document.getElementById('FBOT_CFG_CTRL') == null) {
    let btn = document.createElement('button');
    btn.textContent = 'CfgHide';
    btn.id = 'FBOT_CFG_CTRL';
    btn.onclick = CFG_TOGGLE;
    btn.style = 'position:fixed;bottom:5px;left:108px;z-index:9;height:30px;width:70px; font-size:12px;'
    bt_parent.appendChild(btn);
  }

  //Create CALLBACK script
  if (document.getElementById('FMOD_CALL_BACK') == null) {

    if (document.getElementById('BOT_SRC') == null) {
      let BOTscript = document.createElement('script');
      BOTscript.id = 'BOT_SRC';
      BOTscript.textContent = 'socket.on("syncCallback", function(data) {'
        + 'LOAD_DATA(data);'
        + '});';
      bt_parent.appendChild(BOTscript);
    }
  } else {
    callbacks.push(LOAD_DATA);
  }
}

BOT_CreateCtrlUI();

function GET_GM_VAL(name) {
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

function SET_GM_VAL(name, value) {
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

function CFG_EXPAND_TOGGLE() {
  var expand = document.getElementById('FBOT_CONF');
  if (expand.style.height == cfg_text_height) {
    expand.style.height = "70%";
    document.getElementById('FBOT_EXPAND').textContent = 'Cfg縮小';
  } else {
    expand.style.height = cfg_text_height;
    document.getElementById('FBOT_EXPAND').textContent = 'Cfg拡張';
  }
}

function CFG_TOGGLE() {
  var cfg = document.getElementById('FBOT_CONF');
  var cfgR = document.getElementById('FBOT_CONF_RESET');
  var cfgE = document.getElementById('FBOT_EXPAND');
  var cfgCtr = document.getElementById('FBOT_CFG_CTRL');
  if (cfg.style.display == "none") {
    cfg.style.display = "";
    cfgR.style.display = "";
    cfgE.style.display = "";
    cfgCtr.textContent = "CfgHide";
  } else {
    cfg.style.display = "none";
    cfgR.style.display = "none";
    cfgE.style.display = "none";
    cfgCtr.textContent = "CfgShow";
  }
}

function BOT_CREATE() {
  try {
    eval($('#FBOT_CONF').val());
  } catch (e) {
    alert("bot error! : \n" + e);
    return;
  }
  SET_GM_VAL("config_bot", $('#FBOT_CONF').val());
  BOT_INIT();
}

//init
function BOT_INIT() {
  //timer reset
  if (sender != null || breaker != null) { DestroySpam(); };
  //変数　reset
  sender = null;
  breaker = null;
  counter = CounterStart;
  breaked = false;

  //Create Stop Botton
  var ctrl = document.getElementById('FBOT_CTRL');
  //fix
  if (ctrl == null) {
    var btn = document.createElement('button');
    btn.id = 'FBOT_CTRL';
    btn.style = 'position:fixed;bottom:10px;left:10px;z-index:9;height:24px;width:99px'
    bt_parent.appendChild(btn);
  }
  ctrl.textContent = 'BotEnd';
  ctrl.style.color = "#FF0000";
  ctrl.onclick = Destroy;
  console.log('Bot has started');

  if (UseInitalPost) {
    POST_MAIN(info + '\n' + GetText(InitalPostText));
  }
}

function BOT_DEBUG_DATA(data) { }

function EXAPI_GET_ALL_DATA(data) { }
function EXAPI_GET_POST_DATA(data) { }

//コールバックメイン
function LOAD_DATA(data) {
  EXAPI_GET_ALL_DATA(data);
  //投稿以外なら帰る
  if (data.code != 3) { return; }
  EXAPI_GET_POST_DATA(data);
  //終了していたら帰る
  if (breaked) { return; }
  var list = getFeedArray(data.param);
  BOT_DEBUG_DATA(data);
  //取得
  var PostName = list[0][3].replace(/<(.*?)>/g, "");
  var PostContent = list[0][5];
  //fix
  PostContent = POST_CONTENT_FIX(PostContent);
  var PostId = list[0][0];
  //BOTには反応しない。
  if (PostName.indexOf(BotName) > -1 || PostContent.indexOf(info) > -1) { return; }
  //BREAK
  var BRKHIT = SearchTable(PostContent, BreakText);
  if (BRKHIT != null) {
    setTimeout(function () {
      POST_MAIN(info + '\n' + REPLACEDATA(GetText(BotBreakText), list, BRKHIT)); Destroy(); return;
    }, PostWait);
    return;
  }
  //SPAM END
  if (sender != null) {
    var SPAMEND = SearchTable(PostContent, SpamEnd);
    if (SPAMEND != null) {
      DestroySpam();
      setTimeout(POST_MAIN(info + '\n' + REPLACEDATA(GetText(BotSpamEndText), list, SPAMEND)), PostWait);
      return;
    }
  }

  if (!ResponseOnly) {
    //SPAM START
    if (sender == null) {
      var SPAMSTART = SearchTable(PostContent, SpamStart);
      if (SPAMSTART != null) {
        //reset
        spamcounter = 0;
        DestroySpam();
        setTimeout(POST_MAIN(info + '\n' + REPLACEDATA(GetText(BotSpamStartText), list, SPAMSTART)), PostWait);
        sender = setInterval(function () { SPAM_POST(info + '\n' + GetText(BotSpamText)) }, SpamInterval);
        if (SpamTimeOut >= 0) {
          breaker = setTimeout(DestroySpam, SpamTimeOut);
        }
        return;
      }
    }
  }

  if (!SpamOnly) {
    //dice判定
    if (TargetText.indexOf('{dice}') > -1) {
      //diceが正しければ帰る
      if (DICE(list)) { return; }
    }

    //通常投稿判定
    var HITTEXT = SearchTable(PostContent, TargetText);
    if (SearchTable(PostName, TargetName) != null && HITTEXT != null) {
      var BotComment = info + "\n" + REPLACEDATA(GetText(BotText), list, HITTEXT);
      setTimeout(POST_MAIN(BotComment), PostWait);
    }
  }
}

function POST_CONTENT_FIX(data) {
  data = data.replace(/<img\s*title\s*=\s*\"(\d+?)\".*?>/ig, "[P:$1]");
  data = data.replace(/<br.*?>/g, "\n").replace(/<(.*?)>/g, "");
  data = UnEscapeHtml(data);
  return data;
}

//サイコロ
function DICE(list) {
  var PostName = list[0][3].replace(/<(.*?)>/g, "");
  //diceの場合は改行をきる。
  var PostContent = list[0][5];
  PostContent = POST_CONTENT_FIX(PostContent);
  var PostId = list[0][0];
  //サイコロを呼び出しているか
  var match = PostContent.match(/(\d{1,3})e(\d{1,3}(?!\d))/i);
  if (match != null) {
    //個数
    var dicenum = parseInt(match[1]);
    //diceが200以上であれば回さない。
    if (dicenum > 200) {
      setTimeout(POST_MAIN(info + "\nダイスの数は200以下にしてください。>>" + PostId), PostWait);
      return false;
    }
    //最大値
    var dicemax = parseInt(match[2]);
    //setup result
    var diceres = info + '\n[DICE RESULT]\n' + dicenum + 'e' + dicemax + '\n(';
    var dicetotal = 0;
    //回す
    for (var i = 0; i < dicenum; i++) {
      var RN = RandomInt(dicemax + 1);
      diceres += RN;
      //最後でなければ区切る
      if (i < dicenum - 1) {
        diceres += ',';
      }
      dicetotal += RN;
    }
    diceres += ')\n = ' + dicetotal + '\n>>' + PostId;
    setTimeout(POST_MAIN(diceres), PostWait);
    return true;
  } else {
    //呼び出していなければfalse
    return false;
  }
}

function UnEscapeHtml(target) {
  if (typeof target !== 'string') return target;

  var patterns = {
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&quot;': '"',
    '&#x27;': '\'',
    '&#x60;': '`'
  };

  return target.replace(/&(lt|gt|amp|quot|#x27|#x60);/g, function (match) {
    return patterns[match];
  });
};

//text tableからランダムに取得
function GetText(table) {
  return table[RandomInt(table.length)];
}

//data置換
function REPLACEDATA(source, list, HIT) {
  var PostName = list[0][3].replace(/<(.*?)>/g, "");
  var PostContent = list[0][5];
  PostContent = POST_CONTENT_FIX(PostContent);
  var PostId = list[0][0];
  var m = HIT.match(/\[P:(\d+)\]/);
  var pid = "none";
  if (m != null) {
    pid = m[1];
  }
  return source.replace("{name}", PostName).replace("{content}", PostContent).replace("{id}", PostId).replace('{hit}', HIT).replace("{pid}", pid);
}

//一致したらテキストを返す
function SearchTable(source, table) {
  var result = null;
  for (var i in table) {
    //diceは無視
    if (table[i].indexOf('{dice}') > -1) { continue; }
    if (table[i].indexOf('{reg}') > -1) {
      result = REG_SEARCH(source, table[i].replace('{reg}', ''), null);
      if (result != null) { break; }
    } else if (table[i].indexOf('{regi}') > -1) {
      result = REG_SEARCH(source, table[i].replace('{regi}', ''), 'i');
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
function REG_SEARCH(source, pattern, flg) {
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

//整数の乱数を返す
function RandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

//Spam時のクッション
function SPAM_POST(BotComment) {
  if (spamcounter >= SpamMaxCount && SpamMaxCount >= 0) {
    DestroySpam();
    return;
  }
  spamcounter++;
  BotComment = BotComment.replace("{spcount}", spamcounter);
  POST_MAIN(BotComment);
}

//投稿
function POST_MAIN(BotComment) {
  //終了していたら帰る
  if (breaked) { return; }
  BotComment = API_POST_ARRANGE(BotComment);
  $.ajax({
    url: Target,
    type: 'POST',
    data: 'name=' + BotName + '&comment=' + BotComment.replace("{count}", counter) + '&is_special=' + IsSpPost + '&category_id=0',
    dataType: 'application/x-www-form-urlencoded; charset=UTF-8',
  });
  //countを増やす。
  counter += CountUp;
}

//override用
function API_POST_ARRANGE(str) {

  return str;
}

//BOT 終了
function Destroy() {
  DestroySpam();
  var ctrl = document.getElementById('FBOT_CTRL');
  ctrl.textContent = 'BotStart';
  ctrl.style.color = "#000000";
  ctrl.onclick = BOT_CREATE;
  breaked = true;
  console.log('Bot was destroyed');
}
//SPAM 終了
function DestroySpam() {
  if (sender == null) { return; }
  clearInterval(sender);
  clearTimeout(breaker);
  sender = null;
  breaker = null;
  console.log('Spam was destroyed');
}

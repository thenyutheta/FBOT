//configs (ダミー)
var TargetName = [''];
var TargetText = ['{regi}HEY BOT', '{dice}', '{reg}Hey.+Bot'];
var BreakText = ['{regi}break bot'];
var BotName = 'BOT';
var BotText = ['[{hit}]\nHello, {name}!\n>>{id}No.{count}'];
var BotBreakText = ['終了コード:{hit}によって終了\n>>{id}No.{count}'];
var PostWait = 1000;

var IsSpPost = 0;
var CounterStart = 0;
var CountUp = 1;

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

//not configs. don't edit.
//POSTPHP URL
var Target = './post_feed.php';
var info = '[BOTINFO]';

//宣言
var sender = null;
var breaker = null;
var counter = 0;
var spamcounter = 0;
var breaked = false;

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
  if (document.getElementById('FBOT_STOP') == null) {
    var btn = document.createElement('button');
    btn.textContent = 'BOTを終了';
    btn.id = 'FBOT_STOP';
    btn.onclick = Destroy;
    btn.style = 'position:fixed;bottom:10px;left:10px;z-index:9;height:24px;width:99px'
    document.body.appendChild(btn);
  }
  //Create CALLBACK script
  if (document.getElementById('BOT_SRC') == null) {
    var BOTscript = document.createElement('script');
    BOTscript.id = 'BOT_SRC';
    BOTscript.textContent = 'socket.on("syncCallback", function(data) {'
      + 'LOAD_DATA(data);'
      + '});';
    document.body.appendChild(BOTscript);
  }
  console.log('Bot has started');
}

//コールバックメイン
function LOAD_DATA(data) {
  //終了していたら帰る
  if (breaked) { return; }
  //投稿以外なら帰る
  if (data.code != 3) { return; }
  //取得
  var list = getFeedArray(data.param);
  var PostName = list[0][3].replace(/<(.*?)>/g, "");
  var PostContent = list[0][5].replace(/<br.*?>/g, "\n").replace(/<(.*?)>/g, "");
  var PostId = list[0][0];
  //自分や、BOTには反応しない。
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

  //SPAM START
  if (sender == null) {
    var SPAMSTART = SearchTable(PostContent, SpamStart);
    if (SPAMSTART != null) {
      //reset
      spamcounter = 0;
      DestroySpam();
      setTimeout(POST_MAIN(info + '\n' + REPLACEDATA(GetText(BotSpamStartText), list, SPAMSTART)), PostWait);
      sender = setInterval(function () { SPAM_POST(info + '\n' + GetText(BotSpamText)) }, SpamInterval);
      breaker = setTimeout(DestroySpam, SpamTimeOut);
      return;
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

//サイコロ
function DICE(list) {
  var PostName = list[0][3].replace(/<(.*?)>/g, "");
  //diceの場合は改行をきる。
  var PostContent = list[0][5].replace(/<(.*?)>/g, "");
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

//text tableからランダムに取得
function GetText(table) {
  return table[RandomInt(table.length)];
}

//data置換
function REPLACEDATA(source, list, HIT) {
  var PostName = list[0][3].replace(/<(.*?)>/g, "");
  var PostContent = list[0][5].replace(/<(.*?)>/g, "");
  var PostId = list[0][0];
  return source.replace("{name}", PostName).replace("{content}", PostContent).replace("{id}", PostId).replace('{hit}', HIT)
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
    re = new RegExp(pattern, flg + "s");
  } else {
    re = new RegExp(pattern, "s");
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
function SPAM_POST(BotComment){
  if(spamcounter >= SpamMaxCount && SpamMaxCount < 0){
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
  $('#FBOT_STOP').remove();
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
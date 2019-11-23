//=============
//これをコンソールタブに貼り付けて実行してください。
//一度実行してからでないと、overrideはできません。
//=============
//SETUP
if (document.getElementById('BOTSETUP') == null) {
  var SETUP = document.createElement('script');
  SETUP.src = 'https://thenyutheta.github.io/FBOT/libs/core.js?_='+Date.now();
  SETUP.id = 'BOTSETUP';
  document.body.appendChild(SETUP);
  $('#BOTSETUP').load();
  console.log('Setup finish. Overriding is now possible.');
} else {
  _CONFIG();
}
//=============
document.getElementById('BOTSETUP').onload = function(){_CONFIG()};
function _CONFIG() {

  //configs
  TargetName = [''];
  TargetText = ['{regi}HEY BOT', '{dice}', '{reg}Hey.+Bot'];
  BreakText = ['{regi}break bot'];
  BotName = 'BOT';
  BotText = ['[{hit}]\nHello, {name}!\n>>{id}No.{count}'];
  BotBreakText = ['終了コード:{hit}によって終了\n>>{id}No.{count}'];
  PostWait = 1000;

  IsSpPost = 0;
  CounterStart = 0;
  CountUp = 1;

  SpamOnly = false;
  SpamStart = ['{regi}hey spam'];
  SpamEnd = ['{regi}stop spam'];
  BotSpamStartText = ['Spamモードを開始します No.{count}'];
  BotSpamEndText = ['Spamモードを終了します No.{count}'];
  BotSpamText = ['SPAMするぜ NO.{count}'];
  SpamInterval = 5000;
  SpamTimeOut = 1800000;
  //=============

  BOT_INIT();
}
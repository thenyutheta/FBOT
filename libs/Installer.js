//=============
//これをコンソールタブに貼り付けて実行してください。
//一度実行してからでないと、overrideはできません。
//=============
//SETUP
if (document.getElementById('BOTSETUP') == null) {
  var SETUP = document.createElement('script');
  SETUP.src = 'https://thenyutheta.github.io/FBOT/libs/core.js';
  SETUP.id = 'BOTSETUP';
  document.body.appendChild(SETUP);
  $('#BOTSETUP').load();
  console.log('Setup finish. Overriding is now possible.');
}
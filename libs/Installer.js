//=============
//これをコンソールタブに貼り付けて実行してください。
//一度実行してからでないと、overrideはできません。
//=============
if (document.getElementById('FMOD_CONTENTS') == null) {
  let div = document.createElement('div');
  div.id = "FMOD_CONTENTS";
  document.body.appendChild(div);
}
if (document.getElementById('FMODS') == null) {
  var fmod = document.createElement('script');
  fmod.src = 'https://thenyutheta.github.io/FBOT/libs/mods.js?_=' + Date.now();
  fmod.id = 'FMODS';
  document.getElementById("FMOD_CONTENTS").appendChild(fmod);
  $('FMODS').load();
}
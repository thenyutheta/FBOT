
//override dice
function rollDice(formula) {
  $.post(location.origin + "/" + profileId + '/roll_dice.php', {
    'name': $('#post_form_name').val(),
    'formula': formula
  }, function (result) {
    if (result == 'OK') {
      $('#' + activeForm).val('');
      if (activeForm == 'post_form_multi' && typeof (defaultHeight) != 'undefined') {
        resetFormHeight();
      }
      if (name != $('#post_form_name').val()) {
        name = $('#post_form_name').val();
        syncMyStatus();
      }
    } else {
      alert(result);
    }
  });
}

//add ignore reset
if (document.getElementById('FMOD_RESET_IGNORE') == null) {
  let btn = document.createElement("button");
  btn.textContent = "ResetIgnore";
  btn.onclick = FMOD_RESET_IGNORE;
  btn.style.width = "90px";
  btn.style.height = "26px";
  btn.id = "FMOD_RESET_IGNORE";
  $("#message_menu").append(btn)
  if (ignoredSessionIds[0] == "") {
    ignoredSessionIds.splice(0, 1);
  }
}

function FMOD_RESET_IGNORE() {
  if (ignoredSessionIds.length == 0) {
    alert("無視している人がいません。");
    return;
  }
  if (!confirm(ignoredSessionIds.length + "人の無視を解除しますか？")) {
    return;
  }
  var isis_cp = ignoredSessionIds.slice();
  for (var l = 0; l < isis_cp.length; l++) {
    var lcp = l;
    $.ajax({
      url: '/' + profileId + '/ignore_user.php',
      type: 'POST',
      dataType: 'text',
      data: { 'accept_id': isis_cp[lcp] },
      success: function (result) {
        if (result == 'accepted') {
          for (var i = 0; i < ignoredSessionIds.length; i++) {
            if (isis_cp[lcp] == ignoredSessionIds[i]) {
              ignoredSessionIds.splice(i, 1);
              break;
            }
          }
        }
        refreshOnlineUsersView();
        if (isMobile == 1) {
          refreshOnlineUsersCounter();
        }
        getFeed(0, 0);
      },
    })
  }
}
//fix sp error
if (typeof closePictureDropzone == 'undefined') {
  function closePictureDropzone(d) { }
}
//5pix
if (typeof pictureDropzone != 'undefined') { pictureDropzone.options.maxFiles = 5; }

//delete ad
$("div[id*=nend_adspace]").remove();
$("div#main_right div[style] script[src]").parent().remove();
$(window).off('scroll')
$("div[style*=inline-block] iframe").remove()
$("#upgrade_room_menu").remove();

//sound_plus
if (isMobile == 1) {
  //create dummy
  let audios_div = document.getElementById("FMOD_AUDIOS");
  if(audios_div == null){
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
  var soundEnabled = 1;
  for (let i = 0; i < 7; i++) {
    if (document.getElementById('audio_' + i) == null) {
      let aud = document.createElement('audio');
      aud.preload = "auto";
      aud.id = 'audio_' + i;
      aud.src = location.origin + "/" + profileId + "/sounds/s" + _defaultSounds_[i] + ".mp3";
      aud.style = "display:none;";
      audios_div.appendChild(aud);
      aud.load();

      callbacks.push(function (data) {
        if (data.code == 3) {
          let list = getFeedArray(data.param);
          playSound(list[0][2]);
        } else if (data.code == 6 && data.param == sessionId) {
          playSound(3);
        }
      });
    }
  }
}
//inject for sound settings
$('#sound_settings_icn').off("click");
$('#sound_settings_icn').click(function () {
  toggleSoundSettings();
  $("div[aria-describedby=sound_settings_frame] div.ui-dialog-buttonset button.ui-button-text-only").on("click", Mod_Sound_Load);
  $("div[aria-describedby*=sound_settings_frame] div.ui-dialog-titlebar button.ui-button-icon-only").on("click", Mod_Sound_Load);
});

//init
MM_ANTI_STYLE_BREAKER(null);
MO_FeedPatchers.push(MM_ANTI_STYLE_BREAKER);

function MM_ANTI_STYLE_BREAKER(d) {
  $(".comment").css("table-layout", "fixed");
  $(".comment").css("word-wrap", "break-word");
  $(".comment").css("width", "calc(100% - 14px)");
  $(".comment").css("min-width", "100px");
}

MM_SHOW_WEBP(null);
MO_FeedPatchers.push(MM_SHOW_WEBP);

function MM_SHOW_WEBP(d) {
  $("a[target] img[title]").parent().each(function (index) {
    if ($(this).attr("href").endsWith(".")) {
      $(this).children("img").attr("src", $(this).attr("href")).css("width", "170px")
    }
  });
}
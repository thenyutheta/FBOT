
//override dice
function rollDice(formula) {
  $.post(location.href.replace("sp/", "") + '/roll_dice.php', {
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
        if (isMobile == 1)
          refreshOnlineUsersCounter();
        getFeed(0, 0);
      },
    })
  }
}

//5pix
try { pictureDropzone.options.maxFiles = 5; } catch (e) { }

//delete ad
$("div[id*=nend_adspace]").remove();
$("div#main_right div[style] *").remove()
$("div#main_right div[style*='width: 300px; height: 250px;']").css("height", "0")
$("div[style*=inline-block] iframe").remove()
$("#upgrade_room_menu").remove();

//sound_plus
if (document.getElementById('FMOD_AUDIO') == null) {
  let aud = document.createElement('audio');
  aud.id = 'FMOD_AUDIO';
  aud.src = location.href.replace("sp/", "") + "sounds/s2.mp3";
  aud.style = "display:none";
  fmod_par.appendChild(aud);

  callbacks.push(function (data) {
    if(isMobile == 0){return;}
    if (data.code != 3) { return; }
    var list = getFeedArray(data.param);
    if (list[0][7] != sessionId) {
      document.getElementById('FMOD_AUDIO').play();
    }
  });
}

function API_POST(text, IsSp = 0, category = 0) {
  $.ajax({
    url: Target,
    type: 'POST',
    data: 'name=' + name + '&comment=' + text + '&is_special=' + IsSp + '&category_id=' + category,
    dataType: 'application/x-www-form-urlencoded; charset=UTF-8',
  });
}
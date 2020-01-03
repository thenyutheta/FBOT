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
//5pix
try { pictureDropzone.options.maxFiles = 5; } catch (e) { }

//delete ad
$("div[id*=nend_adspace]").remove();
$("#main_right div[style] *").remove()
$("#main_right div[style]").css("height", "0")
$("div[style*=inline-block] iframe").remove()
$("#upgrade_room_menu").remove();

//sound_plus
if (document.getElementById('FMOD_AUDIO') == null) {
  var aud = document.createElement('audio');
  aud.id = 'FMOD_AUDIO';
  aud.src = location.href.replace("sp/", "") + "sounds/s2.mp3";
  aud.style = "display:none";
  document.body.appendChild(aud);
}
function EXAPI_GET_POST_DATA_PARAM_LIST(list){
  if (list[0][7] != sessionId && isMobile) {
    document.getElementById('FMOD_AUDIO').play();
  }
}

function API_POST(text, IsSp = 0, category = 0){
  $.ajax({
    url: Target,
    type: 'POST',
    data: 'name=' + name + '&comment=' + text + '&is_special=' + IsSp + '&category_id=' + category,
    dataType: 'application/x-www-form-urlencoded; charset=UTF-8',
  });
}
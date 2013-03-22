function saveOptions() {
  localStorage["StationID"] = $('#StationID').val();

  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}



document.addEventListener('DOMContentLoaded', function () {
	document.querySelector('button').addEventListener('click', saveOptions);
	$('#StationID').val(localStorage["StationID"]);
});

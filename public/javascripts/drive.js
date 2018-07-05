// The Browser API key obtained from the Google API Console.
var developerKey = 'AIzaSyDbCyeZs2tkdtsp2tvyE4PVJlG4J2p5m6Q';

// The Client ID obtained from the Google API Console. Replace with your own Client ID.
var clientId = '599071704336-r499971d75adgfilk3dv1u5nvtsgnlc8.apps.googleusercontent.com';

// Replace with your own project number from console.developers.google.com.
// See "Project number" under "IAM & Admin" > "Settings"
var appId = "599071704336";

// Scope to use to access user's documents.
var scope = 'https://www.googleapis.com/auth/drive.readonly';

var pickerApiLoaded = false;
var oauthToken;

// Use the API Loader script to load google.picker and gapi.auth.
function onApiLoad() { gapi.load('auth2', onAuthApiLoad); gapi.load('picker', onPickerApiLoad);}

function onAuthApiLoad() {
  var authBtn = document.getElementById('auth');
  authBtn.disabled = false;
  authBtn.addEventListener('click', function() {
    gapi.auth2.authorize({
      client_id: clientId,
      scope: scope
    }, handleAuthResult);
  });
}

function onPickerApiLoad() {
  pickerApiLoaded = true;
  createPicker();
}

function handleAuthResult(authResult) {
  if (authResult && !authResult.error) {
    oauthToken = authResult.access_token;
    createPicker();
  }
}

// Create and render a Picker object for picking user Photos.
function createPicker() {
  if (pickerApiLoaded && oauthToken) {
    var picker = new google.picker.PickerBuilder().
        addView(google.picker.ViewId.DOCUMENTS).
        addView(google.picker.ViewId.PRESENTATIONS).
        addView(google.picker.ViewId.PDFS).
        setOAuthToken(oauthToken).
        setDeveloperKey(developerKey).
        setCallback(pickerCallback).
        build();
    picker.setVisible(true);
  }
}

// A simple callback implementation.
function pickerCallback(data) {
  var url = 'nothing';
  if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
    var doc = data[google.picker.Response.DOCUMENTS][0];
    url = doc[google.picker.Document.URL];
  }
  var message = 'You picked: ' + url;
  document.getElementById('result').innerHTML = message;
}

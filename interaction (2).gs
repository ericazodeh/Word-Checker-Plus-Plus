/**
 * @OnlyCurrentDoc
 *
 * The above comment directs Apps Script to limit the scope of file
 * access for this add-on. It specifies that this add-on will only
 * attempt to read or modify the files in which the add-on is used,
 * and not all of the user's files. The authorization request message
 * presented to users will reflect this limited scope.
 */

/**
 * Creates a menu entry in the Google Docs UI when the document is opened.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 *
 * @param {object} e The event parameter for a simple onOpen trigger. To
 *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
 *     running in, inspect e.authMode.
 */
function onOpen(e) {
  DocumentApp.getUi().createAddonMenu()
      .addItem('Start', 'confirmStart')
      .addToUi();
}

/**
 * Runs when the add-on is installed.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 *
 * @param {object} e The event parameter for a simple onInstall trigger. To
 *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
 *     running in, inspect e.authMode. (In practice, onInstall triggers always
 *     run in AuthMode.FULL, but onOpen triggers may be AuthMode.LIMITED or
 *     AuthMode.NONE.)
 */
function onInstall(e) {
  onOpen(e);
}

//dialogbox to confirm start of app
function confirmStart() {
  var ui = DocumentApp.getUi(); // Same variations.

  var result = ui.alert(
     'Please confirm',
     'Are you sure you want to start the Add-On?',
      ui.ButtonSet.YES_NO);

  // Process the user's response.
  if (result == ui.Button.YES) {
    // User clicked "Yes".
    ui.alert('Confirmation received. This project utilizes the free version of the LanguageTool API and Merriam Webster API. Thus, the API might not be able to catch all the errors that the premium version can.');
    showSidebar();
  } else {
    // User clicked "No" or X in the title bar.
    ui.alert('Okay, goodbye!');
  }
}

/**
 * Opens a sidebar in the document containing the add-on's user interface.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 */
function showSidebar() {
  var ui = HtmlService.createHtmlOutputFromFile('sidebar')
      .setTitle('Google Analysis');
  DocumentApp.getUi().showSidebar(ui);
}

function showFunctionality(tabName){
  var ui = DocumentApp.getUi(); // Same variations.

  var result;
  
  if(tabName === 'Error Checker'){
    // code block
    result = ui.alert(
     'Please confirm',
     '',
     'Have you read the purpose description?',
      ui.ButtonSet.YES_NO);
  }else if(tabName === 'Thesaurus'){
    // code block
    result = ui.alert(
     'Please confirm',
     '',
     'Have you read the purpose description?',
      ui.ButtonSet.YES_NO);
  }else if(tabName === 'Word Counter'){
    // code block
    result = ui.alert(
     'Please confirm',
     '',
     'Have you read the purpose description?',
      ui.ButtonSet.YES_NO);
  }else if(tabName === 'Word Statistics'){
    // code block
    result = ui.alert(
     'Please confirm',
     '',
     'Have you read the purpose description?',
      ui.ButtonSet.YES_NO);
  }else if(tabName === 'Word Finder'){
    // code block
    result = ui.alert(
     'Please confirm',
     '',
     'Have you read the purpose description?',
      ui.ButtonSet.YES_NO);
  }else{
    // code block
    result = ui.alert(
     'Please confirm',
     '',
     'Have you read the purpose description?',
      ui.ButtonSet.YES_NO);
  }

}


function highlightText(target,background,colconst) {
  var background = colconst;
  var doc = DocumentApp.getActiveDocument();
  var bodyElement = DocumentApp.getActiveDocument().getBody();
  var searchResult = bodyElement.findText(target);

  while (searchResult !== null) {
    var thisElement = searchResult.getElement();
    var thisElementText = thisElement.asText();
    thisElementText.setBackgroundColor(searchResult.getStartOffset(), searchResult.getEndOffsetInclusive(),background);
    searchResult = bodyElement.findText(target, searchResult);
  }
}

function get_Text(){
  return DocumentApp.getActiveDocument().getBody().getText();
}

//Uses API from LanguageTool, https://dev.languagetool.org/java-api
// https://stackoverflow.com/questions/32699420/url-parameters-are-not-being-passed-by-curl-post
function call_LT_api(input) {
  
  //input = "asdjlf askjdhjaks hello";
  var queryString = ("text=" + input.replace(/\s+/g, "%20"));
  queryString += "&language=en-US&enabledOnly=false"; 
  var url = ("https://languagetool.org/api/v2/check?" + queryString);
  
  // https://stackoverflow.com/questions/14742350/google-apps-script-make-http-post
  // https://javascriptio.com/view/1446636/http-post-request-with-json-payload-in-google-apps-script
  var options = {
    "method": "POST",
    "headers": {
        "contentType":"application/x-www-form-urlencoded"
    }
  }; 

  var response = UrlFetchApp.fetch(url, options);  
  
  //var text = response.getResponseCode();
  //var text = response.getContentText();
  var text = JSON.parse(response.getContentText());
  Logger.log(text.matches);
  //var data = JSON.parse(response.getContentText());
  
  // https://stackoverflow.com/questions/40552779/how-to-parse-json-response-in-google-app-script/40554160
  /*
  It is similar to regular JavaScript. You get the JSON response with UrlFetchApp service and then access the properties using the dot notation.

    var response = authUrlFetch.fetch(url, options);
    var data = JSON.parse(response.getContentText());
    Logger.log(data.request.reportType);
  
  */
  return text.matches;
}

//Uses API from meriam webster dictionary
function Thesaurus_finder(input) {
  var results = "Synonyms: ";
  
  var str_word = String(input);
  var url = "https://www.dictionaryapi.com/api/v3/references/thesaurus/json/" + str_word + "?key=4e184017-77c8-4e69-8239-32a8363c5382";
  var response = UrlFetchApp.fetch(url);
  var str_response = String(response);
  var str_response2 = String(response);
  var regex_syn = new RegExp('syns":\\[(.*?)\\]',"gm");
  var regex_ant = new RegExp('ants":\\[(.*?)\\]',"gm");
  var regex_clean = new RegExp('\\[(.*?)\\]',"gm");
  var regex_clean2 = new RegExp('\\[(.*?)\\]',"gm");
  
  var syn = regex_syn.exec(str_response);
  var clean_syn = regex_clean.exec(String(syn));
  results = results + String(clean_syn[0]);
  
  results = results + " \n\n\n Antonyms: ";
  var ant = regex_ant.exec(str_response2);
  var clean_ant = regex_clean2.exec(String(ant));
  results = results + String(clean_ant[0]);
  return results;
}

function Dictionary(word) {
  var results = "Definition: " + word;
  var str_word = String(word);
  var url = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/" + word + "?key=fc03c03d-0ec4-426c-b3f8-b3005fef88fe";
  var response = UrlFetchApp.fetch(url);
  var str_response = String(response);
  var regex = new RegExp('shortdef":\\[(.*?)\\]',"gm");
  var regex2 = new RegExp('\\[(.*?)\\]',"gm");
  var m;
  var s;
  do {
    m = regex.exec(str_response);
    s = regex2.exec(String(m));
    if (s) {
      results = results + String(s[0])
      results = results + "\n";
    }
  } while (m);
  return results;
}
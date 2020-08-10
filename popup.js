"use strict";

// Load in elements from popup.html
var background = chrome.extension.getBackgroundPage();
var notes = document.getElementById("notes");
var title = document.getElementById("title");
var clearButton = document.getElementById("clear");
var addButton = document.getElementById("add");
var body = document.getElementById("body");
var select = document.getElementById("noteId");
let newOption = new Option('Option Text', 'Option Value');
var originalNote = notes.value;
let notesObj;

// Load onload of page
body.onload = function() {
    load();
};

// Clear notes on click of Clear Button
clearButton.onclick = function() {
    clear();
};

// Add note on click of Add Button
addButton.onclick = function() {
    add_note();
}

// Save notes on input
notes.oninput = function() {
    if (originalNote != notes.value) {
        save();
        originalNote = notes.value;
    }
}

// Load function for stored notes
function load() {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        var tab = tabs[0];
        var url = new URL(tab.url);
        var domain = url.hostname;
        var selected_index = select.options[select.selectedIndex].value;

        chrome.storage.sync.get(domain, function(result) {
            notesObj = result[domain];
            if (notesObj == null || typeof(notesObj) == "string") {
                notes.value = "";
                notesObj = {};
            } else {
                if (notesObj[selected_index] == undefined) {
                    notes.value = "";
                } else {
                    notes.value = notesObj[selected_index];
                }
            }
        });
    });
}

// Save function for inputted notes
function save() {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        var tab = tabs[0];
        if (tab == undefined) { return; }
        var url = new URL(tab.url);
        var domain = url.hostname;

        var selected_index = select.options[select.selectedIndex].value;
        if (notesObj == null) {
            notesObj = {};
        }
        notesObj[selected_index] = notes.value;
        var obj = {};
        obj[domain] = notesObj;
        chrome.storage.sync.set(obj, function() {});
    });
}

// Clear function for inputted notes
function clear() {
    notes.value = "";
    save();
}

// Add new note to domain notes
function add_note() {
    var selected_index = select.options[select.selectedIndex].value;
    var index = parseInt(selected_index) + 1;
    var option = new Option(title.value, index);
    select.add(option);
    console.log("it worked");
}
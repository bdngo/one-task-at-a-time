'use strict';
const hidePage = `html > :not(blocked-msg) {
                    display: none;
                  }`;

const TODOS = "../data/todo.json";
const BLOCKED_PGS = "../data/blocked-sites.json";
const POPUP = "/popup/blocked.html";

async function fetchJSON(path) {
    try {
        const response = await fetch(path);
        return response.json();
    } catch (error) {
        console.error(error);
    }
}

async function fetchHTML(path) {
    try {
        const response = await fetch(path);
        return response.text();
    } catch (error) {
        console.error(error);
    }
}

function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

function displayTasks(tasks) {
    const blockedMsg = document.getElementById("blocked-msg");
    for (const t in tasks) {
        const todoList = document.createElement("div");

        const taskBox = document.createElement("input");
        taskBox.type = "checkbox";
        taskBox.disabled = tasks[t];
        taskBox.checked = tasks[t];
        taskBox.name = t;

        const label = document.createElement("label");
        label.for = t;
        label.append(t);
        todoList.append(taskBox);
        todoList.append(label);

        blockedMsg.insertBefore(todoList, null);
    }
}

async function handleCreated(_tabID, _changeID, tab) {
    const blockedData = await fetchJSON(BLOCKED_PGS);
    if (blockedData.blockedSites.includes(tab.url)) {
        browser.tabs.insertCSS({code: hidePage});
        const tasks = await fetchJSON(TODOS);
        const newHTML = await fetchHTML(POPUP);
        document.write(newHTML);
        displayTasks(tasks);
    }
    browser.tabs.onUpdated.removeListener(handleCreated);
}

browser.tabs.onCreated.addListener(() => {
    browser.tabs.onUpdated.addListener(handleCreated);
});

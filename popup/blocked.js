const hidePage = `body > :not(.blocked-msg) {
                    display: none;
                  }`;

import fs from "fs";

const TODOS = "/data/todo.json";
const BLOCKED = "/data/blocked-sites.json";
const todoData = JSON.parse(fs.readFileSync(TODOS));

function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

function displayTasks(tasks) {
    const todoList = document.createElement("div");
    for (const t in tasks) {
        taskBox = document.createElement("input");
        taskBox.append(t);
        taskBox.setAttribute("type", "checkbox");
        if (tasks[t]) {
            taskBox.setAttribute("onClick", "return false;");
            taskbox.setAttribute("checked", "true");
        } else {
            taskbox.setAttribute("checked", "false");
        }
        todoList.append(taskBox);
    }
    const blockedMsg = document.getElementById("blocked-msg");
    insertAfter(todoList, blockedMsg);
}

function handleCreated(tab) {
    const blockedData = JSON.parse(fs.readFileSync(BLOCKED));
    if (blockedData.blockedSites.includes(tab.url)) {
        browser.tabs.insertCSS({code: hidePage}).then(() => {
            displayTasks(todoData);
        });
    }
}

browser.tabs.onCreated.addListener(handleCreated);

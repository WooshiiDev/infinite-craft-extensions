// ==UserScript==
// @name         [Infinite Craft] Dark Mode Toggle
// @description  Adds a toggleable dark mode
// @version      0.6
// @author       Wooshii
// @license      MIT
// @namespace    http://wooshii.dev/
// @match        https://neal.fun/infinite-craft/
// @icon         https://github.githubassets.com/pinned-octocat.svg
// @downloadURL  https://raw.githubusercontent.com/WooshiiDev/infinite-craft-extensions/main/dark-mode.user.js
// @updateURL    https://raw.githubusercontent.com/WooshiiDev/infinite-craft-extensions/main/dark-mode.user.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {

    let canvas;
    let controls;
    let sidebar;

    let mode;

    const init = () => {

        canvas = document.getElementsByClassName("particles")[0];

        controls = document.getElementsByClassName("side-controls")[0];
        sidebar = document.getElementsByClassName("sidebar")[0];

        assignDarkMode(mode);
        applyControlStyle();

        const toggleButton = createToggleButton();
        toggleButton.addEventListener('click', () => {

            mode = !mode;

            console.log(mode);

            assignDarkMode(mode);
            setDarkMode(mode);
        });
    }

    // Helpers

    function applyControlStyle() {
        controls.style.zIndex = 100;
        controls.style.padding = "2px 6px";
        controls.style.display = "inline-flex ";
        controls.style.alignItems = "center";
        controls.style.borderRadius = '5px';
    }

    function createToggleButton() {

        const button = createElement("wooshii-dark-toggle", "div", {class: "item"});
        button.innerText = 'Toggle Dark Mode';
        button.setAttribute(getGameID(), "");

        controls.insertBefore(button, controls.children[0]);

        return button;
    }

    function darkModeInit() {
        mode = hasDarkMode();

        if (mode) {
            document.documentElement.style.backgroundColor = "black";
        }
    }

    function assignDarkMode(isOn) {

        if (isOn === "true" || isOn === true)
        {
            canvas.style.backgroundColor = "white";
            canvas.style.webkitFilter = "invert(1)";

            controls.style.webkitFilter = "invert(1)";

            sidebar.style.webkitFilter = "invert(1)";
            sidebar.children[0].style.webkitFilter = "invert(1)";
        }
        else
        {
            canvas.style.webkitFilter = "";
            controls.style.webkitFilter = "";
            sidebar.style.webkitFilter = "";
            sidebar.style.webkitFilter = "";
            sidebar.children[0].style.webkitFilter = "";
        }
    }

    function setDarkMode(isOn) {
        localStorage.setItem(`infinite-craft-dark-mode`, isOn);
    }

    function getDarkMode() {
        return localStorage.getItem(`infinite-craft-dark-mode`);
    }

    function hasDarkMode() {
        return getDarkMode() === true || getDarkMode() === "true";
    }

    function getGameID() {
        return 'data-' + Object.keys(getContainer().dataset)[0];
    }

    function getContainer() {
        return document.querySelector('.container');
    }

    // Init


    window.addEventListener('load', () => {
        init();

    }, false);

    darkModeInit();
})();

function createButton(name, data = {}) {
    return createElement(name, 'button', data);
}

function createElement(name, type, data = {}) {
    const element = document.createElement(type);
    element.id = name;
    element.classList.add(data.class);

    return element;
}

function applyStyle(element, style) {

    Object.keys(style).forEach((attr) => {
        element.style[attr] = style[attr];
    });
}

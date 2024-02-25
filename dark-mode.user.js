// ==UserScript==
// @name         [Infinite Craft] Dark Mode Toggle
// @description  Adds a toggleable dark mode
// @version      1.0
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

    const SAVE_KEY = "dark-mode";
    const feature_darkmode = function () {

        // - Components

        const getCanvas = () => document.querySelector(".particles");
        const getControls = () => document.querySelector(".side-controls");

        const getSidebar = () => document.querySelector(".sidebar");
        const getSidebarItems = () => getSidebar().children[0];

        const getTitle = () => document.querySelector(".site-title");
        const getLogo = () => document.querySelector(".logo");

        const getResetButton = () => document.querySelector(".reset");

        let mode = false;
        let components = [getCanvas(), getControls(), getLogo(), getSidebar(), getSidebarItems(), getResetButton()];

        const controlsStyle = "z-index: 100; padding: 2px 6px; display: inline-flex; align-items: center;";
        const canvasStyle = "z-index: -100; background-color: white;";

        function init() {

            // Create button

            createModeButton()
                .addEventListener('click', () => toggleDarkMode());

            // Style overrides

            getControls().style = controlsStyle;
            getCanvas().style = canvasStyle;

            // Load

            setMode(hasDarkMode());
        }

        init();

        // --- Elements

        function createModeButton() {
            const button = createElement("wooshii-dark-toggle", "div", {class: "item"});
            button.innerText = 'Toggle Dark Mode';
            button.setAttribute(getGameID(), "");

            const controls = getControls();
            controls.insertBefore(button, controls.children[0]);

            return button;
        }

        // --- Styles

        function setTitleStyle() {
            const filter = mode === true ? "invert(1)" : "invert(0)";
            getTitle().style.filter = filter;
        }

        // --- Mode Handling

        function toggleDarkMode() {
            getCanvas().style.transition = "0.7s";
            getControls().style.transition = '0.7s';
            getLogo().style.transition = "0.7s";

            setMode(!mode);
        }

        function setMode(dark) {
            mode = dark;
            saveDarkMode(mode);

            setTitleStyle();
            toggleElements();
        }

        function toggleElements() {
            const invert = mode ? 1 : 0;
            components.forEach((e) => {
                e.style.webkitFilter = `invert(${invert})`
                e.style.filter = `invert(${invert})`
            });
        }
    }

    // --- Data

    function saveDarkMode(isOn) {
        localStorage.setItem(`wooshii-ic-${SAVE_KEY}`, isOn);
    }

    function hasDarkMode() {
        return localStorage.getItem(`wooshii-ic-${SAVE_KEY}`) === "true";
    }

    function getGameID() {
        return 'data-' + Object.keys(document.querySelector('.container').dataset)[0];
    }

    // --- HTML helpers

    function createButton(name, data = {}) {
        return createElement(name, 'button', data);
    }

    function createElement(name, type, data = {}) {
        const element = document.createElement(type);
        element.id = name;
        element.classList.add(data.class);

        return element;
    }

    //--- Init

    function darkModeInit() {
        if (hasDarkMode()) {
            document.documentElement.style.backgroundColor = "black";
        }
    }

    darkModeInit();
    window.addEventListener('load', () => { feature_darkmode() }, false);
})();

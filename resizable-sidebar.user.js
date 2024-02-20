// ==UserScript==
// @name         [Infinite Craft] Resizable Sidebar
// @description  Enables the sidebar to be resized
// @version      0.1
// @author       Wooshii
// @license      MIT
// @namespace    http://wooshii.dev/
// @match        https://neal.fun/infinite-craft/
// @icon         https://github.githubassets.com/pinned-octocat.svg
// @downloadURL  https://raw.githubusercontent.com/WooshiiDev/infinite-craft-extensions/main/resizable-sidebar.user.js
// @updateURL    https://raw.githubusercontent.com/WooshiiDev/infinite-craft-extensions/main/resizable-sidebar.user.js
// @grant        none
// ==/UserScript==

(function() {

    const sidebarThreshold = 16;

    let sidebar;
    let itemsContainer;
    let gameContainer;

    let hover;
    let moving = false;

    let lastPos = undefined;

    const init = () => {
        sidebar = getSidebar();

        itemsContainer = getItemsContainer();
        gameContainer = getGamesContainer();

        sidebar.addEventListener('mousedown', (ev) => {

            const move = ev.clientX;
            const diff = Math.abs(sidebar.getBoundingClientRect().x - move);

            if (diff > sidebarThreshold) {
                return;
            }

            moving = true;
        });

        document.addEventListener('mouseup', (ev) => {
            moving = false;
        });

        document.addEventListener('mousemove', (ev) => {

            if (moving === false)
            {
                return;
            }

            const move = ev.clientX;

            if (lastPos === undefined) {
                lastPos = ev.clientX;
            }

            const w = clamp(sidebar.offsetWidth + (lastPos - move), 200, gameContainer.offsetWidth - 32);
            lastPos = move;

            sidebar.style.width = `${w}px`;
        });
    }

    function getSidebar() {
        return document.getElementsByClassName("sidebar")[0];
    }

    function getItemsContainer() {
        return document.getElementsByClassName("items")[0];
    }

    function getGamesContainer() {
        return document.getElementsByClassName("container")[0];
    }

    window.addEventListener('load', () => {
        init();
    }, false);
})();

const clamp = function(value, min, max) {
  return Math.min(Math.max(value, min), max);
};

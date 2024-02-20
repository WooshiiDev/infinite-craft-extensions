// ==UserScript==
// @name         [Infinite Craft] Resizable Sidebar
// @description  Enables the sidebar to be resized
// @version      0.2
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

    const sidebarThreshold = 10;

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
            if (!isMouseOnSidebarEdge(move)) {
                return;
            }

            moving = true;
            lastPos = move;
        });

        document.addEventListener('mouseup', (ev) => {
            moving = false;
        });

        document.addEventListener('mousemove', (ev) => {

            const move = ev.clientX;
            if (moving === false)
            {
                document.body.style.cursor = isMouseOnSidebarEdge(move)
                    ? "ew-resize"
                    : "default";

                return;
            }

            if (lastPos === undefined) {
                lastPos = ev.clientX;
            }

            const w = clamp(sidebar.offsetWidth + (lastPos - move), 200, gameContainer.offsetWidth - 32);
            lastPos = move;

            sidebar.style.width = `${w}px`;
        });

        document.addEventListener('mouseup', () => {
           if (!moving) {
               document.body.style.cursor = "default";
           }
        });
    }

    function isMouseOnSidebarEdge(mouseX) {

        const diff = mouseX - sidebar.getBoundingClientRect().x;

        return diff >= 0 && diff <= sidebarThreshold;
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

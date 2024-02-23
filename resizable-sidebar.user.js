// ==UserScript==
// @name         [Infinite Craft] Resizable Sidebar
// @description  Enables the sidebar to be resized
// @version      1.1
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

   const feature_sidebar = function(){

        const minSize = 200;
        const maxPadding = 32;

        const sidebarThreshold = 10;
        let sidebar;

        let prevX;
        let moving = false;

        function setupEvents() {

            sidebar = getSidebar();
            sidebar.addEventListener('mousedown', (ev) => beginDrag(ev));
            getSidebarHolder().style.maxWidth = "100%";

            prevX = sidebar.style.left;

            document.addEventListener('mouseup', (ev) => endDrag(ev));
            document.addEventListener('mousemove', (ev) => updateDrag(ev));

            addEventListener("resize", (ev) => {
                setSidebarSize(0);
                handleInvalidElements();
            });
        }

        function beginDrag(ev) {

            const clientX = ev.clientX;

            if (!isMouseOnSidebarEdge(clientX)) {
                return;
            }

            prevX = clientX;
            moving = true;
        }

        function endDrag(ev) {

            if (moving === false) {
                return;
            }

            moving = false;
            handleInvalidElements();
        }

        function updateDrag(ev) {

            const clientX = ev.clientX;
            if (moving === false)
            {
                document.body.style.cursor = isMouseOnSidebarEdge(clientX)
                    ? "ew-resize"
                    : "default";
                return;
            }

            if (prevX === undefined) {
                prevX = clientX;
            }

            setSidebarSize(prevX - clientX);
            prevX = clientX;

        }

        function setSidebarSize(deltaX) {

            const w = clamp(sidebar.offsetWidth + deltaX, minSize, getContainer().offsetWidth - maxPadding);
            sidebar.style.width = `${w}px`;
        }

        function isMouseOnSidebarEdge(mouseX) {
            const diff = mouseX - sidebar.getBoundingClientRect().x;
            return diff >= 0 && diff <= sidebarThreshold;
        }

        function handleInvalidElements() {

            const elements = getCraftElements();
            for (let i = elements.length - 1; i >= 0; i--) {
                const element = elements[i];
                if (checkElementIntersection(element)) {
                    deleteElementByIndex(i);
                }
            }
        }

        function checkElementIntersection(element) {
            if (element.id === 0) {
                return false;
            }

            return(element.left + element.width) > getSidebarEdge();
        }

        function getSidebarEdge() {
            return sidebar.getBoundingClientRect().x;
        }

        setupEvents();
    };

    // HTML Elements

    function getSidebar() {
        return document.getElementsByClassName("sidebar")[0];
    }

    function getSidebarHolder() {
        return document.querySelector(".items");
    }

    function getContainer() {
        return document.getElementsByClassName("container")[0];
    }

    // --- Infinite Craft

    function getCraft() {
        return window.$nuxt.$children[2].$children[0].$children[0];;
    }

    function getCraftElements() {
        return getCraft().instances;
    }

    function clearSelectedElement() {
        getCraft().selectedInstance = getCraftElements()[0];
    }

    function deleteElement(element) {
        deleteElementByIndex(getCraftElements().indexOf(element));
    }

    function deleteElementByIndex(index) {
        if (index === -1) {
            return;
        }

        getCraftElements().splice(index, 1);
        clearSelectedElement();
    }

    // --- Utils

     function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    };

    // --- Init

    window.addEventListener('load', () => {
        feature_sidebar();
    }, false);
})();

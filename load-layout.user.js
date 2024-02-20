// ==UserScript==
// @name         [Infinite Craft] Load Layout
// @description  Saves layouts for elements
// @version      0.4
// @author       Wooshii
// @license      MIT
// @namespace    http://wooshii.dev/
// @match        https://neal.fun/infinite-craft/
// @icon         https://github.githubassets.com/pinned-octocat.svg
// @downloadURL  https://raw.githubusercontent.com/WooshiiDev/infinite-craft-extensions/main/load-layout.user.js
// @updateURL    https://raw.githubusercontent.com/WooshiiDev/infinite-craft-extensions/main/load-layout.user.js
// @grant        none
// ==/UserScript==

(function() {

    const init = () => {
        const container = document.querySelector('.container');

        const saveButton = createElement('wooshii-btn-save', 'div', {class: "item", attribute: "data-v-8889ef30"});
        const loadButton = createElement('wooshii-btn-load', 'div', {class: "item", attribute: "data-v-8889ef30"});

        saveButton.style.bottom = '24px';
        saveButton.style.left = '24px';
        saveButton.style.position = 'absolute';

        loadButton.style.bottom = '24px';
        loadButton.style.left = '144px';
        loadButton.style.position = 'absolute';

        saveButton.innerText = 'Save Layout';
        loadButton.innerText = 'Load Layout';

        container.appendChild(saveButton);
        container.appendChild(loadButton);

        saveButton.addEventListener('click', saveElements);
        loadButton.addEventListener('click', loadElements);
    }

    const saveElements = () => {

        const elements = getHTMLElements();

        // Check Length

        const len = elements.length;
        if (len == 1) {
            return;
        }

        let htmlElements = [];
        elements.forEach(child => htmlElements.push(child.outerHTML));

        saveLocalStorage('html', htmlElements);
        saveLocalStorage('elements', getCraftElements());
        saveLocalStorage('id', getCraftId());

        console.log(`Saving ${len - 1} elements.`);
    }

    const loadElements = () => {
        const elementsArray = loadLocalStorage('elements');

        if (elementsArray === null) {
            return;
        }

        const elementsId = loadLocalStorage('id');

        setCraftElements(elementsArray);
        setCraftId(elementsId);

        // Clamp to area

        const parent = document.getElementsByClassName("instances")[0];
        const container = parent.children[0];
        const sidebar = document.getElementsByClassName("sidebar")[0];

        const w = container.offsetWidth - sidebar.offsetWidth;
        const h = document.getElementsByClassName("container")[0].offsetHeight;

        setTimeout(() => {
            for (let i = 0; i < elementsArray.length; i++) {
                const element = elementsArray[i];
                const child = container.children[i];

                element.elem = child;
                element.left = clamp(element.left, 0, w - element.width);
                element.top = clamp(element.top, 0, h - element.height);

                const x = element.left;
                const y = element.top;
                const z = element.zIndex;

                child.style = `translate: ${x}px ${y}px; z-index: ${z};`;
             }
        }, 1);
    }

    // Save/Load

    function saveLocalStorage(name, value) {
        localStorage.setItem(`infinite-craft-${name}`, JSON.stringify(value));
    }

    function loadLocalStorage(name) {
        return JSON.parse(localStorage.getItem(`infinite-craft-${name}`));
    }

    // HTML

    function getHTMLElements() {
        const parent = Array.from(document.getElementsByClassName("instances"))[0];

        const container = parent.children[0];
        const elements = Array.from(container.children);

        return elements;
    }

    function createButton(name, data = {}) {
        return createElement(name, 'button', data);
    }

    function createElement(name, type, data = {}) {
        const element = document.createElement(type);
        element.id = name;
        element.classList.add(data.class);
        element.setAttribute(data.attribute, "");

        return element;
    }

    // Helpers

    function getCraft() {
        return window.$nuxt.$children[2].$children[0].$children[0];
    }

    function getCraftElements() {
        return getCraft().instances;
    }

    function getCraftId() {
        return getCraft().instanceId;
    }

    function setCraftElements(elements) {
        getCraft().instances = elements;
    }

    function setCraftId(id) {
        getCraft().instanceId = id;
    }

    // Init

    window.addEventListener('load', () => {
        init();
    }, false);
})();

// TODO: Move to require class

const clamp = function(value, min, max) {
  return Math.min(Math.max(value, min), max);
};

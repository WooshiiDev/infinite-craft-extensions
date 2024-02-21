// ==UserScript==
// @name         [Infinite Craft] Load Layout
// @description  Saves layouts for elements
// @version      0.6
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

    let id;

    const init = () => {
        const container = getContainer();
        const controls = getControls();
        id = getGameID();

        const saveButton = createElement('wooshii-btn-save', 'div', {class: "item", attribute: id});
        const loadButton = createElement('wooshii-btn-load', 'div', {class: "item", attribute: id});

        saveButton.innerText = 'Save Layout';
        loadButton.innerText = 'Load Layout';

        controls.insertBefore(saveButton, controls.children[0]);
        controls.insertBefore(loadButton, controls.children[0]);

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

        const parent = document.getElementsByClassName("instances")[0];
        const container = parent.children[0];

        setCraftElements([]);
        elementsArray.forEach((element, index) => {
            getCraft().instances.push(element);
        });

        const sidebar = document.getElementsByClassName("sidebar")[0];
        const w = container.offsetWidth - sidebar.offsetWidth;
        const h = document.getElementsByClassName("container")[0].offsetHeight;

        setTimeout(() => {
            elementsArray.forEach((element, index) => processElement(element, container.children[index], w, h));
            setCraftId(elementsId);
        }, 0);
    }

    // Save/Load

    function processElement(element, child, w, h) {

        if (element.elem === undefined) {
            return;
        }

        element.left = clamp(element.left, 0, w - element.width);
        element.top = clamp(element.top, 0, h - element.height);

        const x = element.left;
        const y = element.top;
        const z = element.zIndex;
        child.style = `translate: ${x}px ${y}px; z-index: ${z};`;
        element.elem = child;
    }

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

    function getGameID() {

        const attr = Object.keys(getContainer().dataset)[0];
        const key = attr.slice(1, attr.length);

        return 'data-v-'+key;
    }

    function getContainer() {
        return document.querySelector('.container');
    }

    function getControls() {
        return document.querySelector('.side-controls');
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

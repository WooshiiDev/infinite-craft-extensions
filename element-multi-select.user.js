// ==UserScript==
// @name         [Infinite Craft] Multi-select
// @description  Select and drag multiple elements
// @version      1.2
// @author       Wooshii
// @license      MIT
// @namespace    http://wooshii.dev/
// @match        https://neal.fun/infinite-craft/
// @icon         https://github.githubassets.com/pinned-octocat.svg
// @downloadURL  https://raw.githubusercontent.com/WooshiiDev/infinite-craft-extensions/main/element-multi-select.user.js
// @updateURL    https://raw.githubusercontent.com/WooshiiDev/infinite-craft-extensions/main/element-multi-select.user.js
// @grant        none
// ==/UserScript==

(function() {

    const CraftWrapper = function() {

        let craft = undefined;

        function getCraft() {
            if (craft === undefined) {
                craft = window.$nuxt.$children[2].$children[0].$children[0];
            }

            return craft;
        }

        return {

            // - Data

            getCraftElements: function() {
                return getCraft().instances;
            },

            // - Elements

            clearSelectedElement: function() {
                getCraft().selectedInstance = this.getCraftElements()[0];
            },

            deleteElement: function(element) {
                const index = this.getCraftElements().indexOf(element);

                if (index === -1) {
                    return;
                }

                this.getCraftElements().splice(index, 1);
                this.clearSelectedElement();
            },

            duplicateElement: function(element) {
                getCraft().duplicateInstance(element);
            },

            moveElement: function(element, x, y) {
                getCraft().setInstancePosition(element, element.left - x, element.top - y);
            },

            setElementZIndex: function(zIndex) {
                getCraft().setInstanceZIndex(zIndex);
            },
        }
    };

    const Box = function() {

        let start = {x: 0, y: 0}, end = {x: 0, y: 0}
        let left = 0, right = 0, top = 0, bottom = 0;
        let width = 0, height = 0;

        function updateBounds() {
            left = Math.min(start.x, end.x);
            top = Math.min(start.y, end.y);
            right = Math.max(start.x, end.x);
            bottom = Math.max(start.y, end.y);
        }

        function updateSize() {
            width = right - left;
            height = bottom - top;
        }

        return {
            getLeft: function() {return left;},
            getTop: function() {return top;},
            getWidth: function() {return width;},
            getHeight: function() {return height;},

            begin: function(pos) {
                end = start = pos;
            },

            update: function(pos) {
                end = pos;
                updateBounds();
                updateSize();
            },

            contains: function(x, y, w, h) {
                return x >= left && x + w <= right
                && y >= top && y + h <= bottom
            },

            containsPos: function(pos) {
                return this.contains(pos.x, pos.y);
            },
        }
    }

    let canvas;

    let sidebar;
    let onSidebar = false;
    let onElement = false;

    let began = false;
    let moving = false;

    let start;
    let end;
    let prev;
    let delta;

    let areaElement;
    let selected = [];

    const craft = new CraftWrapper();
    const selection = new Box();

    const init = () => {
        canvas = document.getElementsByClassName('particles')[0];
        sidebar = document.getElementsByClassName('sidebar')[0];

        const container = document.getElementsByClassName("container")[0];

        areaElement = createBoxElement();

        container.addEventListener('mousemove', (ev) => {
            if (onSidebar === true) {
                return;
            }

            if (moving) {

                const pos = {x: ev.clientX, y: ev.clientY};
                const diff = {x: prev.x - pos.x, y: prev.y - pos.y};
                prev = pos;

                selected.forEach(e => {
                    craft.moveElement(e, diff.x, diff.y);
                });
            }
            else if (began) {

                selection.update({x: ev.clientX, y: ev.clientY});

                setBoxPosition(selection.getLeft(), selection.getTop());
                setBoxSize(selection.getWidth(), selection.getHeight());

                deselectAll();
                craft.getCraftElements().forEach(e => {

                    if (e.id === 0) {
                        return;
                    }

                    if (selection.contains(e.left, e.top, e.width, e.height)) {
                        selectElement(e);
                    }
                });
            }
        });

        document.addEventListener("keydown", (event) => {
            if (selection.length == 0) {
                return;
            }

            const key = event.key;
            if (key === 'Delete' || key === 'Backspace') {
                 selected.forEach(e => {
                     craft.deleteElement(e);
                 });
            }
        });


        container.addEventListener('mousedown', (ev) => { if (!onSidebar && !onElement) beginSelection(ev); });
        container.addEventListener('mouseup', (ev) => { if (began) endSelection(); });

        sidebar.addEventListener('mouseenter', () => { onSidebar = true; });
        sidebar.addEventListener('mouseleave', () => { onSidebar = false; });

        getHTMLElementsContainer().addEventListener('DOMNodeInserted', (ev) => {
            const element = ev.target;


            setupElementEvents(ev.target);
        });

        getHTMLElements().forEach(e => setupElementEvents(e));
    }

    function selectElement(element) {
        selected.push(element);
        element.elem.style.background = "#d9ff5c";
    }

    function deselectAll() {

        selected.forEach(element => {
            element.elem.style.background = "";
        });
        selected = [];
    }


    // --- Events

    function setupElementEvents(element) {
        if (element.id === "instance-0") {
            return;
        }

        element.addEventListener('mousedown', (ev) => {

            onElement = true;

            if (began || selected.length == 0) {
                return;
            }

            if (!selected.find(e => e.elem === element)) {
                deselectAll();
                return;
            }

            prev = {x: ev.clientX, y: ev.clientY};
            moving = true;
        });

        element.addEventListener('mouseup', () => {

            onElement = false;

            if (!moving) {
                return;
            }

            moving = false;
            craft.clearSelectedElement();
        });
    }

    // --- Drag Logic

    function beginSelection(ev) {
        if (moving) {
            return;
        }

        began = true;

        selection.begin({x: ev.clientX, y: ev.clientY});

        setBoxPosition(selection.left, selection.top);
        setBoxSize(0, 0);
        showBox();

        if (selected.length > 0) {
            deselectAll();
        }
    }

    function endSelection() {
        began = false;
        hideBox();
    }

    function showBox() {
        areaElement.style.display = 'block';
    }

    function hideBox() {
        areaElement.style.display = 'none';
    }

    function setBoxPosition(left, top) {
        areaElement.style.left = left+'px';
        areaElement.style.top = top+'px';
    }

    function setBoxSize(w, h) {
        areaElement.style.width = w + 'px';
        areaElement.style.height = h + 'px';
    }

    // --- HTML

    function getHTMLElements() {
        const parent = getHTMLElementsContainer();
        const container = parent.children[0];
        return Array.from(container.children);
    }

    function getHTMLElementsContainer() {
        return document.getElementsByClassName('instances')[0];
    }

    function createBoxElement() {
        const element = createElement("box", "div", {class: 'item'});

        element.style.border = "2px grey solid";
        element.style.position = "absolute";

        document.getElementsByClassName('container')[0].appendChild(element);

        return element;
    }

    function createElement(name, type, data = {}) {
        const element = document.createElement(type);
        element.id = name;
        element.classList.add(data.class);
        element.setAttribute(data.attribute, "");
        return element;
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

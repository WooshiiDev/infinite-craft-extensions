// ==UserScript==
// @name         [Infinite Craft] Remove right click context menu.
// @description  Remove the annoying context menu.
// @version      1.0
// @author       Wooshii
// @license      MIT
// @namespace    http://wooshii.dev/
// @match        https://neal.fun/infinite-craft/
// @icon         https://github.githubassets.com/pinned-octocat.svg
// @downloadURL  https://raw.githubusercontent.com/WooshiiDev/infinite-craft-extensions/main/remove-context.user.js
// @updateURL    https://raw.githubusercontent.com/WooshiiDev/infinite-craft-extensions/main/remove-context.user.js
// @grant        none
// ==/UserScript==

(function() {
     document.addEventListener('contextmenu', e => e.preventDefault());
})();

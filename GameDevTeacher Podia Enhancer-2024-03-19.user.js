// ==UserScript==
// @name         GameDevTeacher Podia Enhancer
// @namespace    http://tampermonkey.net/
// @version      2024-03-19
// @description  Enhance podia feature
// @author       LoganBlack
// @match        https://www.gamedevteacher.fr/view/courses/creajv-pro/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamedevteacher.fr
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let currentUrl = window.location.href;
    let videoDuration = 0;

    function EnhancePodia(){
        // Select <section> with parent ID "customer-sidebar"
        const sectionElement = document.querySelector('#customer-sidebar section');
        const h1Element = document.querySelector('#lesson-header h1');
        const completionButton = document.querySelector('#completion-button');

        //Code for search bar
        if (sectionElement) {
            const divSearch = document.createElement('div');
            divSearch.setAttribute('id','search-section');
            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.placeholder = 'Rechercher...';
            searchInput.classList.add('search-input');

            divSearch.appendChild(searchInput);
            sectionElement.parentNode.appendChild(divSearch);

            // Select all <li> el from <ol> except first
            const listItems = document.querySelectorAll('#customer-sidebar ol li:not(:first-child) ol li');

            searchInput.addEventListener('input', function() {
                const searchText = this.value.toLowerCase();

                listItems.forEach(function(item) {
                    const text = item.textContent.toLowerCase();

                    if (text.includes(searchText)) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        } else {
            console.log('El not found sidebar section');
        }

        //Scroll to the current chapter
        if (h1Element) {
            const h1Text = h1Element.textContent.trim();
            const sixFirstCharacters = h1Text.substring(0, 6);
            const sidebarLinks = document.querySelectorAll('#customer-sidebar a');

            sidebarLinks.forEach(link => {
                if (link.textContent.trim().substring(0, 6) === sixFirstCharacters) {
                    link.classList.add('highlighted-link');
                    link.scrollIntoView({ behavior: 'smooth', block: 'center'});
                }
            });
        } else {
            console.log("El not found Chapter title");
        }

        //code for completion button click
        if(completionButton){
            const link = completionButton.querySelector('a[data-method="post"]');
            //comment this block to disabled automatic go to next lesson when clicking on completion button
            //begin block to comment //
            if(link){
                link.addEventListener('click', function (e) {
                    goToNextLesson();
                });
            }else{
                listenToastNotification();
            }
            //end block to comment //

            //uncomment next line when disabling automatic go to next lesson
            //listenToastNotification();
        }else {
            console.log("El not found : completion button");
        }

        //VideoPlayer -- Beta
        //comment next line if script became unstable
        playerSetup(videoDuration);
    }

    // as podia is react app, this code help to detect if url has changed, and refresh the whole script
    setInterval(function() {
        const newUrl = window.location.href;
        if (newUrl !== currentUrl) {
            currentUrl = newUrl;
            console.log('refresh enhance podia');
            EnhancePodia();
        }
    }, 2000);

    //First load
    EnhancePodia();

    //videoPlayer script - Beta
    function playerSetup(videoDuration)
    {
        // Get the HTML element with class "wistia_video_foam_dummy"
        const playerContainer = document.querySelector('.wistia_video_foam_dummy');
        if(playerContainer === null){
            return;
        }
        // Extract the value of the data-source-container-id attribute
        const attributeValue = playerContainer.getAttribute('data-source-container-id');
        // Use regular expression to extract the string
        if(attributeValue === null){
            return;
        }
        const match = attributeValue.match(/wistia-(\w+)-\d+/);
        // Check if there's a match and get the extracted string
        const extractedString = match ? match[1] : null;

        window._wq = window._wq || [];
        if(extractedString !== null){
            _wq.push({ id: extractedString, onReady: function(video) {
                videoDuration = video.duration();
                console.log(videoDuration);
                video.videoQuality(1080);
                // add videoDuration
                const roundButton = document.querySelector('#display-video-duration');
                if(roundButton == null){
                    const roundButton = document.createElement('button');
                    roundButton.setAttribute('id','display-video-duration');
                    //roundButton.style.position = 'fixed';
                    //roundButton.style.bottom = '18px'; // Adjust bottom position as needed
                    //roundButton.style.right = '100px'; // Adjust right position as needed
                    roundButton.style.width = '100px';
                    roundButton.style.height = '44px';
                    roundButton.style.borderRadius = '10px';
                    roundButton.style.backgroundColor = '#007bff'; // Change color as needed
                    roundButton.style.color = '#fff';
                    roundButton.style.border = 'none';
                    roundButton.style.cursor = 'default';
                    roundButton.style.display = 'flex';
                    roundButton.style.justifyContent = 'center';
                    roundButton.style.alignItems = 'center';
                    roundButton.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.3)';
                    //roundButton.style.zIndex = '60';
                    roundButton.textContent = Math.floor((videoDuration % 3600) / 60) + 'min ' + Math.floor(videoDuration % 60);

                    // Append the button to the navigation section
                    const navElement = document.querySelector('#lesson-navigation nav');
                    navElement.insertBefore(roundButton, navElement.firstChild);
                }else{
                    roundButton.textContent = Math.floor((videoDuration % 3600) / 60) + 'min ' + Math.floor(videoDuration % 60);
                }
            }});
        }
    }

    //automatic go to next lesson
    function goToNextLesson(){
        const link = document.querySelector('a[rel="next"][aria-label="Continuer"]');
        if (link) {
            link.click();
        } else {
            console.log('Link not found');
        }
    }

    // listen if a new notification appear on website and refresh the whole script if so.
    function listenToastNotification()
    {
        const targetNode = document.getElementById('toasts-container');
        const config = { childList: true, subtree: true };

        const callback = function(mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.closest('#toasts-container')) {
                            EnhancePodia();
                        }
                    });
                }
            }
        };
        const observer = new MutationObserver(callback);
        if (targetNode) {
            observer.observe(targetNode, config);
        } else {
            console.log('Toast container not found');
        }
    }
})();
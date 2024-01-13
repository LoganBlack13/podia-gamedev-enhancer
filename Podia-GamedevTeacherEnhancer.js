// ==UserScript==
// @name     Podia-GameDevTeacherEnhancer
// @version  1
// @grant    none
// ==/UserScript==

let currentUrl = window.location.href;
const completionButton = document.querySelector('#completion-button');

function EnhancePodia(){
    // Select <section> with parent ID "customer-sidebar"
    const sectionElement = document.querySelector('#customer-sidebar section');
    const h1Element = document.querySelector('#lesson-header h1');
    
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
}

//code for completion button click
if(completionButton){
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
        console.error('Toast container not found');
    }
}else {
    console.log("El not found : completion button");
}

setInterval(function() {
    const newUrl = window.location.href;
    if (newUrl !== currentUrl) {
        currentUrl = newUrl;
        EnhancePodia();
    }
}, 2000);

//First load
EnhancePodia();
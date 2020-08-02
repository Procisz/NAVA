'use strict';

const dataHandler = {
   selectedPageIndex: 0,
   allData: [],
   slicedData: [],
   filteredData: [],
   itemsPerPage: 10,
   defaultItemsPerPage: 10,
   numberOfPages: 1,
};


// When page is loading
window.onload = async () => {
   const response = await fetch('./../datahandler/mockData.json');
   const data = await (response.ok ? response.json() : Promise.resolve([]));
   dataHandler.allData = data;
   dataHandler.slicedData = data.slice(0, dataHandler.itemsPerPage);
   templateRenderer();
};


// Any changes in pagination section
function navigate(selectedPage) {
   dataHandler.selectedPageIndex = selectedPage;
   const start = dataHandler.itemsPerPage * selectedPage;
   const end = start + dataHandler.itemsPerPage;
   dataHandler.slicedData = dataHandler.allData.slice(start, end);
   templateRenderer();
}


// Any changes in search input
const searchInput = document.querySelector('#searchInput');
searchInput.addEventListener('keyup', () => {
   let searchInputValue = searchInput.value;
   let searchedArray = [];

   dataHandler.allData.forEach((result) => {
      if (result.subject.toLowerCase().indexOf(searchInputValue.toLowerCase()) != -1) {
         searchedArray.push(result)
      } else {
         // searchedArray = [];
         // searchedArray.push([{ errorMessage: 'Nincs a keresésnek megfelelő találat.' }]);
      }
   })
   dataHandler.filteredData = searchedArray;

   const myInput = document.querySelector("#input");
   changeItemsNumberInOnePage(myInput.value)
   templateRenderer();
});


// Any changes in page number input
const myInput = document.querySelector("#input");
myInput.addEventListener('keyup', () => {
   let myInputValue = myInput.value;
   changeItemsNumberInOnePage(myInputValue);
   templateRenderer(myInputValue);
});

function changeItemsNumberInOnePage(inputValue) {
   inputValue === 0 || inputValue === '' ? dataHandler.itemsPerPage = dataHandler.defaultItemsPerPage : dataHandler.itemsPerPage = inputValue;
   dataHandler.slicedData = dataHandler.allData.slice(0, dataHandler.itemsPerPage);
   dataHandler.filteredData = dataHandler.filteredData.slice(0, dataHandler.itemsPerPage);
}


// Rendering
function templateRenderer(...inputValue) {
   inputValue[0] ? dataHandler.numberOfPages = Math.ceil(dataHandler.allData.length / dataHandler.defaultItemsPerPage) : dataHandler.numberOfPages = Math.ceil(dataHandler.allData.length / dataHandler.itemsPerPage);

   // Paginations part
   const indexes = Array.from(Array(dataHandler.numberOfPages).keys());

   const paginationTemplate = indexes.map((index, i) => `
   <div class="pagination-section__area">   
      <div class="pagination-section__box ${dataHandler.selectedPageIndex === i ? "pagination-section__box--selected" : ''}" onClick="navigate(${index})">
         <span class="pagination-section__number">${index + 1}</span>
      </div>
   </div>`);

   document.querySelectorAll('#paginationSection').forEach((result) => {
      result.innerHTML = `${paginationTemplate.join('')}`;
   });

   // document.querySelectorAll('#paginationSectionMobile').forEach((result) => {
   //    result.innerHTML = `${paginationTemplate.join('')}`;
   // });


   // Table part
   let showableData = [];
   if (dataHandler.filteredData.errorMessage) {
      showableData = dataHandler.filteredData;
      console.log('showableData1: ', showableData);
   } else {
      dataHandler.filteredData.length === 0 ? showableData = dataHandler.slicedData : showableData = dataHandler.filteredData;
      console.log('showableData2: ', showableData);
   }

   // Basic infos for template pieces
   const defaultTvMessage = 'Megnézem';
   const defaultRadioMessage = 'Meghallgatom';
   const defaultRelatedStuffMessage = 'Megnézem';
   // const missingDataIconLink = 'images/sprite.svg#icon-wondering'

   // Scavenging template pieces
   const missingTvTemplate = '-';
   const missingRadioTemplate = '-';
   const missingRelatedStuffsTemplate = '-';
   // const missingTvTemplate = `<svg class="table-box__icon--subject">
   //                               <use xlink:href="${missingDataIconLink}"></use>
   //                            </svg>`;
   // const missingRadioTemplate = `<svg class="table-box__icon--subject">
   //                               <use xlink:href="${missingDataIconLink}"></use>
   //                            </svg>`;
   // const missingRelatedStuffsTemplate = `<svg class="table-box__icon--subject">
   //                               <use xlink:href="${missingDataIconLink}"></use>
   //                            </svg>`;

   // The final tbody template
   const tableBodyTemplate = `
   ${showableData.reduce((acc, currValue) => acc +
      `<tr class="table-box__tr">
         <td data-label="subject">${currValue.subject}</td>
         
         <td data-label="tvLabel" class="table-box__link">
         ${currValue.tvLink !== '' ? `<a href="${currValue.tvLink}" target="_blank">${defaultTvMessage}</a>` : missingTvTemplate}
         </td>
         
         <td data-label="radioLabel" class="table-box__link">
            ${currValue.radioLink !== '' ? `<a href="${currValue.radioLink}" target="_blank">${defaultRadioMessage}</a>` : missingRadioTemplate}
         </td>
         
         <td data-label="relatedStuffsLabel" class="table-box__link">
         ${currValue.relatedStuffs !== '' ? `<a href="${currValue.relatedStuffs}" target="_blank">${defaultRelatedStuffMessage}</a>` : missingRelatedStuffsTemplate}
         </td>
      </tr>`, '')}`;

   const tableBodyTemplateMobile =
      `${showableData.reduce((acc, currValue) => acc +
         `<div class="table-mobile__row">
            <div class="table-mobile__data-box">
               <div class="table-mobile__title">
                  <svg class="table-mobile__icon">
                     <use xlink:href="images/sprite.svg#icon-graduation-cap"></use>
                  </svg>Tantárgy megnevezése
               </div>
               <span class="table-mobile__data">${currValue.subject}</span>
            </div>

            <div class="table-mobile__data-box">
               <div class="table-mobile__title">
                  <svg class="table-mobile__icon">
                     <use xlink:href="images/sprite.svg#icon-tv"></use>
                  </svg>TV
               </div>
               <span class="table-mobile__data">${currValue.tvLink !== '' ? `<a href="${currValue.tvLink}" target="_blank">${defaultTvMessage}</a>` : missingTvTemplate}</span>
            </div>

            <div class="table-mobile__data-box">
               <div class="table-mobile__title">
                  <svg class="table-mobile__icon">
                     <use xlink:href="images/sprite.svg#icon-podcast"></use>
                  </svg>Rádió
               </div>
               <span class="table-mobile__data">${currValue.radioLink !== '' ? `<a href="${currValue.radioLink}" target="_blank">${defaultTvMessage}</a>` : missingTvTemplate}</span>
            </div>

            <div class="table-mobile__data-box">
               <div class="table-mobile__title">
                  <svg class="table-mobile__icon">
                     <use xlink:href="images/sprite.svg#icon-books"></use>
                  </svg>Kapcsolódó anyagok
               </div>
               <span class="table-mobile__data">${currValue.relatedStuffs !== '' ? `<a href="${currValue.relatedStuffs}" target="_blank">${defaultTvMessage}</a>` : missingTvTemplate}</span>
            </div>
         </div>`, '')}`;
   document.querySelector('#tableBody').innerHTML = tableBodyTemplate;
   document.querySelector('#tableBodyMobile').innerHTML = tableBodyTemplateMobile;
}
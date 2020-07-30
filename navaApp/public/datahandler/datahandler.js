'use strict';

const dataHandler = {
   selectedPageIndex: 0,
   allData: [],
   slicedData: [],
   filteredData: [],
   itemsPerPage: 9,
   defaultItemsPerPage: 9,
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
      }
   })
   dataHandler.filteredData = searchedArray;
   console.log('dataHandler.filteredData: ', dataHandler.filteredData);

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
   inputValue === 0 || inputValue === "" ? dataHandler.itemsPerPage = dataHandler.defaultItemsPerPage : dataHandler.itemsPerPage = inputValue;
   dataHandler.slicedData = dataHandler.allData.slice(0, dataHandler.itemsPerPage);
   dataHandler.filteredData = dataHandler.filteredData.slice(0, dataHandler.itemsPerPage);
}


// Rendering
function templateRenderer(...inputValue) {
   inputValue[0] ? dataHandler.numberOfPages = Math.ceil(dataHandler.allData.length / dataHandler.defaultItemsPerPage) : dataHandler.numberOfPages = Math.ceil(dataHandler.allData.length / dataHandler.itemsPerPage);

   const indexes = Array.from(Array(dataHandler.numberOfPages).keys());

   const paginationTemplate = indexes.map((index, i) => `
   <div class="pagination-section__area">   
      <div class="pagination-section__box ${dataHandler.selectedPageIndex === i ? "pagination-section__box--selected" : ""}" onClick="navigate(${index})">
         <span class="pagination-section__number">${index + 1}</span>
      </div>
   </div>`);

   // Table part
   let showableData = [];
   dataHandler.filteredData.length === 0 ? showableData = dataHandler.slicedData : showableData = dataHandler.filteredData;
   console.log('showableData: ', showableData);

   const tableBodyTemplate = `${showableData.reduce((acc, cr) => acc + `<tr class="tr">
                                                            <td data-label="subject">${cr.subject}</td>
                                                            <td data-label="tvLink">${cr.tvLink}</td>
                                                            <td data-label="radioLink">${cr.radioLink}</td>
                                                            <td data-label="relatedStuffs">${cr.relatedStuffs}</td>
                                                         </tr>`, "")}`;
   document.querySelector('#tableBody').innerHTML = tableBodyTemplate;


   // Paginations part
   document.querySelectorAll('.pagination-section').forEach((result) => {
      result.innerHTML = `${paginationTemplate.join('')}`;
   });
}
const paginatorHandler = {
   selectedPageIndex: 0,
   allData: [],
   slicedData: [],
   itemsPerPage: 9,
   defaultItemsPerPage: 9,
   numberOfPages: 1
};

// When page is loading
window.onload = async () => {
   const response = await fetch('./../tablehandler/mockData.json');
   const data = await (response.ok ? response.json() : Promise.resolve([]));
   paginatorHandler.allData = data;
   paginatorHandler.slicedData = data.slice(0, paginatorHandler.itemsPerPage);
   templateRenderer();
};

// Any changes in pagination section
function navigate(selectedPage) {
   paginatorHandler.selectedPageIndex = selectedPage;
   const start = paginatorHandler.itemsPerPage * selectedPage;
   const end = start + paginatorHandler.itemsPerPage;
   paginatorHandler.slicedData = paginatorHandler.allData.slice(start, end);
   templateRenderer();
}

// Any changes in input
const myInput = document.querySelector("#input");
myInput.addEventListener('keyup', () => {
   myInput.value === 0 || myInput.value === "" ? paginatorHandler.itemsPerPage = paginatorHandler.defaultItemsPerPage : paginatorHandler.itemsPerPage = myInput.value
   // paginatorHandler.itemsPerPage = myInput.value;
   paginatorHandler.slicedData = paginatorHandler.allData.slice(0, paginatorHandler.itemsPerPage);
   console.log(paginatorHandler);

   templateRenderer(myInput.value);
   // async () => {
   //    await setTimeout(() => {
   // console.log(myInput.value);
   //    }, 1000)
   //    console.log('Itt vagyok');
   // }
});


// Rendering
function templateRenderer(...inputValue) {
   if (inputValue[0]) {
      paginatorHandler.numberOfPages = Math.ceil(paginatorHandler.allData.length / paginatorHandler.defaultItemsPerPage);
   } else {
      paginatorHandler.numberOfPages = Math.ceil(paginatorHandler.allData.length / paginatorHandler.itemsPerPage);
   }

   const indexes = Array.from(Array(paginatorHandler.numberOfPages).keys());

   const paginationTemplate = indexes.map((index, i) => `
   <div class="pagination-section__area">   
      <div class="pagination-section__box ${paginatorHandler.selectedPageIndex === i ? "pagination-section__box--selected" : ""}" onClick="navigate($ {index})">
         <span class="pagination-section__number">${index + 1}</span>
      </div>
   </div>`);

   // Table part
   const tableBodyTemplate = `${paginatorHandler.slicedData.reduce((acc, cr) => acc + `<tr class="tr">
                                                            <td data-label="subject">${cr.subject}</td>
                                                            <td data-label="tvLink">${cr.tvLink}</td>
                                                            <td data-label="radioLink">${cr.radioLink}</td>
                                                            <td data-label="relatedStuffs">${cr.relatedStuffs}</td>
                                                         </tr>`, "")}`;
   document.querySelector('#tableBody').innerHTML = tableBodyTemplate;


   // Paginations part
   // document.querySelectorAll('.pagination-section').forEach((result) => {
   //    result.innerHTML = `${paginationTemplate.join('')}`;
   // })
}
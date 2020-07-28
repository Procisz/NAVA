const paginatorHandler = {
   selectedPageIndex: 0,
   allData: [],
   slicedData: [],
   itemsPerPage: 2
};

window.onload = async () => {
   const response = await fetch('./../tablehandler/mockData.json');
   const data = await (response.ok ? response.json() : Promise.resolve([]));
   paginatorHandler.allData = data;
   paginatorHandler.slicedData = data.slice(0, paginatorHandler.itemsPerPage);
   renderingTemplate();
};

function renderingTemplate() {
   const numberOfNPages = Math.ceil(paginatorHandler.allData.length / paginatorHandler.itemsPerPage);
   const indexes = Array.from(Array(numberOfNPages).keys());

   const buttons = indexes.map((number, i) => `
   <div class="${paginatorHandler.selectedPageIndex === i ? "active" : ""}">
      <span onClick="navigate(${number})">${number + 1}</span>
   </div>`)

   // Table part
   document.querySelector('#tableBody').innerHTML = `
      ${paginatorHandler.slicedData.reduce((acc, cr) => acc +
      `<tr>
      <td data-label="">${cr.subject}</td>
      <td data-label="id">${cr.tvLink}</td>
      <td data-label="id">${cr.radioLink}</td>
            <td data-label="id">${cr.relatedStuffs}</td>
            </tr>`,
      "")}
            `;


   // Paginations part
   document.querySelector('#pagination-box').innerHTML = `
      <span>${buttons.join('')}</span>`;
}

function navigate(selectedPage) {
   paginatorHandler.selectedPageIndex = selectedPage;
   const start = paginatorHandler.itemsPerPage * selectedPage;
   const end = start + paginatorHandler.itemsPerPage;
   paginatorHandler.slicedData = paginatorHandler.allData.slice(start, end);
   renderingTemplate();
}
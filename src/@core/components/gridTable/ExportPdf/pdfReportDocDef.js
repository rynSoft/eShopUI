var docDefinition = {
    pageSize: "A3",
    pageOrientation: "landscape",
    content: [
      { text: "", margin: [0, 20, 0, 8], style: "header" },
  
      {
        style: "tableExample",
        table: {
          headerRows: 1,
          body: [
 
      
          ],
   
        },
  
        layout: {
          hLineWidth: function (i, node) {
            return i === 0 || i === node.table.body.length ? 2 : 1;
          },
          vLineWidth: function (i, node) {
            return i === 0 || i === node.table.widths.length ? 2 : 1;
          },
          hLineColor: function (i, node) {
            return i === 0 || i === node.table.body.length ? "black" : "gray";
          },
          vLineColor: function (i, node) {
            return i === 0 || i === node.table.widths.length ? "black" : "gray";
          },
        },
      },
    ],
    
    styles: {
      header: {
        fontSize: 20,
        bold: true,
        margin: [0, 0, 0, 10],
        alignment: "center",
      },
      subheader: {
        fontSize: 20,
        bold: true,
        margin: [0, 0, 0, 10],
        alignment: "center",
      },
      tableExample: {
        margin: [0, 5, 0, 15],
        alignment: "center",
      },
      tableHeader: {
        bold: true,
              alignment: "center",
        fontSize: 13,
        color: "black",
      },
      KitSuccess: {
  
              alignment: "center",
        fontSize: 13,
        color: "black",
      },
      KitDanger: {
  
              alignment: "center",
        fontSize: 13,
        color: "gray",
      },
      qr: {
        alignment: "center",
      },
    },
  
  };
  
  export default docDefinition;
  
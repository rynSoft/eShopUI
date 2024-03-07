import { Fragment, useState } from "react";
import docDefinition from "./pdfReportDocDef.js";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
function ExportPdf(data,documentName,documentTitle){ 
  let dumyData=[];
  data.map((element, index) => {
    
     delete element.active;//Kolon ları siler
     delete element.image;
     delete element.creatorId;
     delete element.bomKitInfo
     delete element.routeInfo
     delete element.productionTimeProcess
     delete element.productionUser
     delete element.productionLog
     delete element.setupVerificationInfo
     delete element.productionOperations
     delete element.setupVerificationDChange
     delete element.productionProcessManual
     delete element.productionProcessManualTest
     delete element.setupVerification
     delete element.id
     delete element.productionId
     delete element.isDeleted
     delete element.userId
     delete element.qualityOperationId
     delete element.qualityInfoId
     delete element.password
     delete element.roleId
     delete element.lineAd
     delete element.creatorId
     delete element.editorId
     delete element.previousProcess
     delete element.editDate
      dumyData.push(element);

  });
  data=dumyData;
  docDefinition.content[1].table.body=[]
        docDefinition.content[0].text=documentTitle// BELGE BASLIGI
        Date.prototype.today = function () {
          return (
            (this.getDate() < 10 ? "0" : "") +
            this.getDate() +
            "-" +
            (this.getMonth() + 1 < 10 ? "0" : "") +
            (this.getMonth() + 1) +
            "-" +
            this.getFullYear()
          );
        };
    
        // For the time now
        Date.prototype.timeNow = function () {
          return (
            (this.getHours() < 10 ? "0" : "") +
            this.getHours() +
            "." +
            (this.getMinutes() < 10 ? "0" : "") +
            this.getMinutes() +
            "." +
            (this.getSeconds() < 10 ? "0" : "") +
            this.getSeconds()
          );
        };
        data.map((element) => {

          let rowData=[];
          let columnNameList=[]
          let columnCount=0;
          let columnsWidth=[];
          for ( var property in element ) {      
            columnCount++;
            columnNameList.push( { text: property, style: "tableHeader" })
            rowData.push({text:element[property]!=null && String(element[property]).length<256 ? element[property]:"",style:"KitSuccess"})
          }
          docDefinition.content[1].table.body[0]=columnNameList;
          docDefinition.content[1].table.body.push(rowData);
         
          for (let index = 0; index < columnCount; index++) {
           
            columnsWidth.push((100/columnCount).toFixed(2)+"%")
          }
    
          docDefinition.content[1].table.widths=columnsWidth;
        });
        //Getting Current Date And Time

        var newDate = new Date();

        var datetime = newDate.today() + " " + newDate.timeNow();
        pdfMake.vfs = pdfFonts.pdfMake.vfs;
        console.log(docDefinition)
        pdfMake
          .createPdf(docDefinition)
          .download(datetime + " - "+documentName+ ".pdf");
}
export default ExportPdf;
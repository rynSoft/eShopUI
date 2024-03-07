import XLSX from "xlsx";

function ExportExcel(data, documentName, documentTitle) {

    //Getting Current Date And Time
    var newDate = new Date();
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
       delete element.isDeleted
       delete element.qualityOperationId
       delete element.qualityInfoId
       delete element.password
       delete element.roleId
       delete element.userId

       delete element.productionId
       delete element.lineAd
       delete element.creatorId
       delete element.editorId
       delete element.previousProcess
       delete element.editDate
        dumyData.push(element);

    });
    const exportDocHeaders = [[]];
    for (var property in dumyData[0]) {
        exportDocHeaders[0].push(property)
    }
    const workBook = XLSX.utils.book_new();
    const workSheet = XLSX.utils.json_to_sheet([]);
    var newDate = new Date();

    var datetime = newDate.today() + " " + newDate.timeNow();

    //Headers Added
    XLSX.utils.sheet_add_aoa(workSheet, exportDocHeaders, { origin: "A1", skipHeader: true });

    //Starting in the second row to avoid overriding and skipping headers
    XLSX.utils.sheet_add_json(workSheet, dumyData, { origin: "A2", skipHeader: true });
    XLSX.utils.book_append_sheet(workBook, workSheet, documentTitle);

    XLSX.writeFile(workBook, datetime + " - " + documentName + ".xlsx");
};


export default ExportExcel;
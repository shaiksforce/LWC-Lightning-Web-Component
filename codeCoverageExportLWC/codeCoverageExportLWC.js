import { LightningElement, track } from 'lwc';
import codeCoverageAnalysis from '@salesforce/apex/CodeCoverageExportController.exportClassCoverage';

const columns = [
    {
        label: 'Name',
        fieldName: 'ApexClassOrTrigger',
    },{
        label: 'Total Lines',
        fieldName: 'TotalLines'
    }, {
        label: 'NumLinesCovered',
        fieldName: 'CoveredLinesCount'
    }, {
        label: 'NumLinesUncovered',
        fieldName: 'UncoveredLinesCount'
    }, {
        label: 'Percentage Covered',
        fieldName: 'PercentageCovered',
    }
];

export default class CodeCoverageExportLWC extends LightningElement {

    @track columns = columns;
    @track data = [];
    @track orgTotalApexLines;
    @track OrgTotalCodeCoverage;
    @track OrgTotalCoveredLines;

    constructor() {
        super();
        this.codeAnalysis();
    }

    codeAnalysis() {
        codeCoverageAnalysis({strClassOrTrigger : null})
        .then(result => {
            let rows = result.records;
            let orgTotalLines = 0;
            let totalCoveredLines = 0;
            let totalCountLines = 0;

            rows.forEach((key) => {
                let row = key;

                orgTotalLines = orgTotalLines + totalCountLines;
                
                totalCountLines = Number(row.NumLinesCovered) + Number(row.NumLinesUncovered);
                totalCoveredLines = totalCoveredLines + Number(row.NumLinesCovered);
                
                row.PercentageCovered = Math.round(Number(row.NumLinesCovered)/totalCountLines * 100).toString() + '%';
            
                row.TotalLines = totalCountLines.toString();

                if(row.ApexClassOrTrigger) {
                    row.ApexClassOrTrigger = row.ApexClassOrTrigger.Name;
                }

                if(row) {
                    row.CoveredLinesCount = row.NumLinesCovered.toString();
                    row.UncoveredLinesCount = row.NumLinesUncovered.toString();
                }
            }); 

            this.OrgTotalCodeCoverage = Math.round(totalCoveredLines/orgTotalLines * 100);
            this.orgTotalApexLines = orgTotalLines;
            this.OrgTotalCoveredLines = totalCoveredLines;

            this.data = rows;
        })
        .catch(error => {
            window.console.log('error ====> '+JSON.stringify(error));

        });
    }


}
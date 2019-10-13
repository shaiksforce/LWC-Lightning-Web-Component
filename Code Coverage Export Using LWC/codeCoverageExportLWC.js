import { LightningElement, track } from 'lwc';

// Importing Aapex class
import codeCoverageAnalysis from '@salesforce/apex/CodeCoverageExportController.exportClassCoverage';

const columns = [
    {
        label: 'Name',
        fieldName: 'ApexClassOrTrigger',
        cellAttributes: { class: { fieldName: 'covrageLowCSSClass' }}
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
        cellAttributes: { class: { fieldName: 'covrageLowCSSClass' }}
    }
];

export default class CodeCoverageExportLWC extends LightningElement {
    // reactive variables
    @track columns = columns;
    @track data = [];
    @track orgTotalApexLines;
    @track OrgTotalCodeCoverage;
    @track OrgTotalCoveredLines;

    connectedCallback() {
        this.codeAnalysis();
    }

    codeAnalysis() {
        codeCoverageAnalysis()
        .then(result => {
            let rows = result.records;
            let orgTotalLines = 0;
            let totalCoveredLines = 0;
            let totalCountLines = 0;

            rows.forEach((key) => {
                let row = key;
                
                // Total apex lines in org
                orgTotalLines = orgTotalLines + totalCountLines;
                
                // Total lines of current apex class
                totalCountLines = Number(row.NumLinesCovered) + Number(row.NumLinesUncovered);

                // Covered lines of Apex class
                totalCoveredLines = totalCoveredLines + Number(row.NumLinesCovered);

                // Percentage covered for current apex class
                row.PercentageCovered = Math.round(Number(row.NumLinesCovered) / totalCountLines * 100).toString() + '%';

                // Showing different color in column based on percentage covered
                if(Math.round(Number(row.NumLinesCovered) / totalCountLines * 100) < 75) {
                    window.console.log('inside')
                    row.covrageLowCSSClass = 'slds-text-color_error';
                }
                else {
                    row.covrageLowCSSClass = 'slds-text-color_success';
                }


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
            
            // assging data to datatable
            this.data = rows;
        })
        .catch(error => {
            this.error = error;
        });
    }


}
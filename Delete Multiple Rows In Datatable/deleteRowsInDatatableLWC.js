import {LightningElement, track, wire} from 'lwc';

// importing apex class methods
import getContacts from '@salesforce/apex/LWCExampleController.getContacts';
import delSelectedCons from '@salesforce/apex/LWCExampleController.deleteContacts';

// importing to show toast notifictions
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

// importing to refresh the apex after delete the records.
import {refreshApex} from '@salesforce/apex';

// datatable columns
const columns = [
    {
        label: 'FirstName',
        fieldName: 'FirstName'
    }, {
        label: 'LastName',
        fieldName: 'LastName'
    }, {
        label: 'Phone',
        fieldName: 'Phone',
        type: 'phone'
    }, {
        label: 'Email',
        fieldName: 'Email',
        type: 'email'
    }
];

export default class DeleteRowsInDatatableLWC extends LightningElement {
    // reactive variable
    @track data;
    @track columns = columns;
    @track buttonLabel = 'Delete Selected Contacts';
    @track isTrue = false;
    @track recordsCount = 0;

    // non-reactive variables
    selectedRecords = [];
    refreshTable;
    error;

    // retrieving the data using wire service
    @wire(getContacts)
    contacts(result) {
        this.refreshTable = result;
        if (result.data) {
            this.data = result.data;
            this.error = undefined;

        } else if (result.error) {
            this.error = result.error;
            this.data = undefined;
        }
    }


    // Getting selected rows 
    getSelectedRecords(event) {
        // getting selected rows
        const selectedRows = event.detail.selectedRows;
        
        this.recordsCount = event.detail.selectedRows.length;

        // this set elements the duplicates if any
        let conIds = new Set();

        // getting selected record id
        for (let i = 0; i < selectedRows.length; i++) {
            conIds.add(selectedRows[i].Id);
        }

        // coverting to array
        this.selectedRecords = Array.from(conIds);

        window.console.log('selectedRecords ====> ' +this.selectedRecords);
    }


    // delete records process function
    deleteAccounts() {
        if (this.selectedRecords) {
            // setting values to reactive variables
            this.buttonLabel = 'Processing....';
            this.isTrue = true;

            // calling apex class to delete selected records.
            this.deleteCons();
        }
    }


    deleteCons() {
        delSelectedCons({lstConIds: this.selectedRecords})
        .then(result => {
            window.console.log('result ====> ' + result);

            this.buttonLabel = 'Delete Selected Contacts';
            this.isTrue = false;

            // showing success message
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success!!', 
                    message: this.recordsCount + ' Contacts are deleted.', 
                    variant: 'success'
                }),
            );
            
            // Clearing selected row indexs 
            this.template.querySelector('lightning-datatable').selectedRows = [];

            this.recordsCount = 0;

            // refreshing table data using refresh apex
            return refreshApex(this.refreshTable);

        })
        .catch(error => {
            window.console.log(error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error while getting Contacts', 
                    message: error.message, 
                    variant: 'error'
                }),
            );
        });
    }  

}

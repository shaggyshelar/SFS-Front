import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ScriptLoaderService } from './../../../../../../_services/script-loader.service';
import * as _ from 'lodash/index';
import { InvoiceService } from '../../../_services/index';
import { GlobalErrorHandler } from './../../../../../../_services/error-handler.service';
import { MessageService } from './../../../../../../_services/message.service';
import { AcademicYearService } from './../../../_services/index';
import { Boards } from "./../../../_models/boards";
import { Helpers } from "./../../../../../../helpers";
@Component({
  selector: "app-invoice-summary",
  templateUrl: "./invoice-summary.component.html",
  encapsulation: ViewEncapsulation.None,
})

export class InvoiceSummaryComponent implements OnInit {
  params: number;
  academicYearForm: FormGroup;
  invoice: any;
  statusChanged = false;
  startDate: any;
  endDate: any;
  startAcademicYear: any;
  endAcademicYear: any;
  minEndDate: any;
  isEndYearSameAsStarYear: boolean = false
  isCurrentYearDisabled: boolean = false
  currentStatus: string;
  oldDueDate: Date;
  radioVal: number;
  chargeAmount: number;
  lateFee:number;
  paidAmount: number;
  totalBalance: number;
  showPrintPart: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _script: ScriptLoaderService,
    private invoiceService: InvoiceService,
    private globalErrorHandler: GlobalErrorHandler,
    private messageService: MessageService) {
  }
  ngOnInit() {
    this.invoice = {};
    this.startAcademicYear = '';
    this.endAcademicYear = '';
    this.minEndDate = new Date();
    this.route.params.forEach((params: Params) => {
      this.params = params['invoiceId'];
      if (this.params) {
        this.getInvoiceSumary();
      }
    });

  }
  getInvoiceSumary() {
    Helpers.setLoading(true);
    let url = '?filter[include]=studentData&filter[include]=invoiceDetails';
    this.invoiceService.getInvoiceSumary(this.params, url).subscribe(
      response => {
        this.invoice = response;
        // this.invoice.invoiceStatus="Paid";
        this.currentStatus = this.invoice.status;
        this.invoice.dueDate = new Date(response.dueDate);
        this.chargeAmount = response.totalChargeAmount ? response.totalChargeAmount : 0;
        this.paidAmount = response.totalChargeAmountPaid ? response.totalChargeAmountPaid : 0;
        this.lateFee = response.calculatedLateFees ? response.calculatedLateFees : 0;
        this.totalBalance = this.paidAmount - this.chargeAmount;
        this.oldDueDate = _.cloneDeep(this.invoice.dueDate);
        Helpers.setLoading(false);
      },
      error => {
        Helpers.setLoading(false);
        this.globalErrorHandler.handleError(error);
      });
  }
  updateInvoice() {
    if (!this.invoice.dueDate) {
      this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: 'Please select due date' });
      return false;
    }
    // else if (!this.invoice.invoiceStatus) {
    //     this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: 'Please select invoice status' });
    //     return false;
    // }
    else if (this.statusChanged && this.currentStatus == 'Paid' && !this.invoice.statusDesc) {
      this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: 'Please enter invoice description' });
      return false;
    }
    else if (this.currentStatus != 'Paid') {
      this.invoice.statusDesc = '';
    }
    if (this.radioVal == 1) {
      this.currentStatus = _.cloneDeep(this.invoice.status);
    }
    else if (this.radioVal == 2) {
      this.invoice.dueDate = _.cloneDeep(this.oldDueDate);
    }

    this.invoice.dueDate = new Date(new Date(this.invoice.dueDate).setHours(22)).toISOString();
    this.invoice.status = this.currentStatus;
    this.invoiceService.updateInvoice(this.invoice).subscribe(
      response => {
        this.invoice = response;
        this.router.navigate(['/features/invoice/list']);
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }
  onStatusChange() {
    this.statusChanged = true;
  }
  cancelInvoice() {
    this.router.navigate(['/features/invoice/list']);
  }

  onStatusDueDateClick(radioVal) {
      this.radioVal = radioVal;
    if (this.radioVal == 1) {
      this.currentStatus = _.cloneDeep(this.invoice.status);
    }
    else if (this.radioVal == 2) {
      this.invoice.dueDate = _.cloneDeep(this.oldDueDate);
    }
  }
  printDoc() {
    this.showPrintPart = true;
    let popupWin;
    //https://github.com/MrRio/jsPDF/blob/master/jspdf.js#L59
    var toPrint = document.getElementById('invoice-content').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
        <html>
            <head>
              <style>${invoiceStyle}
              </style>
            </head>
            <body onload="window.print();window.close()">
                ${toPrint}
            </body>
        </html>
        `);
    popupWin.document.close();
    this.showPrintPart = false;
  }
}

const invoiceStyle = `body{
	overflow-x:hidden!important;
	font-family:Poppins;
	 -webkit-print-color-adjust:exact;
}

/********* D. 27 Nov 2017 - For Invoive summary Screen   *********/
.invoiceContainer{
	width: 100%;
    margin: 25px auto;
    border-radius: 4px!important;
	box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
}
.invoiceHeader{
	/*background-color: #8b86ce;
	background-image: linear-gradient(315deg, #8b86ce 0%, #716aca 56%);*/
	padding: 1.5em;
}
@media print{
  .invoiceHeader{
		/*background-color: #8b86ce!important;	*/
	}
}
.alignRight{
	text-align:right;
}
.invoiceMainHeading{
	color:#000;
	margin-bottom:0;
	font-size: 22px;
}
.invoiceLabelBox h6{
	color: #f7f7f7;
    text-transform: uppercase;
    font-size: 10px;
    letter-spacing: 1px;
}
.invoiceLabelBox h5{
	color: #000;
    font-size: 13px;
    margin-bottom: 0;
    font-weight: 300;
    line-height: 1.4em;
}
.invoiceRow{
	margin-top:25px;
}
.invoiceBody{
	background-color: #fff;
    padding: 15px;
}
.invoiceTable tr th{
	color: #000!important;
    text-transform: uppercase;
    font-size: 13px;
    letter-spacing: 0px;
    font-weight: 600;
    border: none!important;
    
	padding: 15px 0px;
}
.invoiceTable tr td{
	color: #565656!important;
    font-size: 13px;
    letter-spacing: 0px;
    font-weight: 400;
    border-top: 1px solid #f4f5f8!important;
    padding: 10px 0px;
}
.invoiceSubTh{
	font-style:italic;
	font-size:11px;
	color:#000;
	text-transform:initial;
	font-weight: 500;
}
.invoiceTable tr th:first-child, .invoiceTable tr td:first-child {
	width:80%;
}
.invoiceTable tr th:nth-child(2), .invoiceTable tr td:nth-child(2) {
	width:20%;
}
.invoiceTotalBox{
	background: #565656;
	font-family: Roboto;
    color: #000;
    width: 250px;
    padding: 10px 20px;
    text-align: center;
    font-size: 16px;
	text-transform:uppercase;
	margin:0 auto;
    border-radius: 0px;
	margin-top:30px;
	margin-bottom:10px;
	letter-spacing: 0px;
	box-shadow: 0 3px 18px rgba(0,0,0,0.25), 0 3px 5px rgba(0,0,0,0.22);
	font-weight: 600;
}
.invoiceTotalBox span{
	font-weight:300;
	font-size: 13px;
	letter-spacing: 1px;
}
.invoiceText{
	/*border: none!important;
    height: 30px!important;
    padding-top: 4px;
    padding-left: 12px;
    font-size: 13px;
    padding-bottom: 4px;*/
	
	border: none!important;
    height: 30px!important;
    padding-top: 4px;
    padding-left: 12px;
    font-size: 13px;
    padding-bottom: 4px;
    background: #6760bd;
    color: #e8e5e5;
}
.invoiceText:focus{
	background: #6760bd;
	border-color:#6760bd;
	color: #000;
	-webkit-box-shadow: inset 0px -2px 14px 3px rgba(89,79,197,1);
	-moz-box-shadow: inset 0px -2px 14px 3px rgba(89,79,197,1);
	box-shadow: inset 0px -2px 14px 3px rgba(89,79,197,1);
}
.invoiceText::-webkit-input-placeholder { /* Chrome/Opera/Safari */
	color: #e8e5e5;
}
.invoiceText::-moz-placeholder { /* Firefox 19+ */
	color: #e8e5e5;
}
.invoiceText:-ms-input-placeholder { /* IE 10+ */
	color: #e8e5e5;
}
.invoiceText:-moz-placeholder { /* Firefox 18- */
	color: #e8e5e5;
}
.saveCancelInvoice{
	margin-top:20px;
	margin-bottom:15px;
}
.invoiceEdit{
	position: absolute;
    margin-left: 6px;
    margin-top: -3px;
    font-size: 16px;
}
.customBadge{
	font-size: 12px;
    border-radius: 24px;
    padding-top: 3px;
    padding-left: 12px;
    padding-right: 12px;
    margin-top: -12px;
    vertical-align: middle;
}

@media print{
    .invoiceMainHeading {
		color: #000!important;		
	}
	.label-success {
		background-color: #5cb85c!important;
		color: #000!important;
		border-color: #5cb85c!important;
	}
	.invoiceLabelBox h6 {
		color: #000!important;		
	}
	.invoiceLabelBox h5 {
		color: #000!important;
	}
	.invoiceTotalBox {
		background: #565656!important;
	}
	.invoiceTotalBox {
        color: #000!important;
	}
	.invoiceTotalBox span {
		color: #000!important;
	}
	.invoiceText {
       background: #6760bd!important;
	}
	select{
		color: #000!important;
	}
}

.noteText {
    color: #000 !important;
    font-size: 12px !important;
    margin-bottom: 13px !important;
    font-weight: 300 !important;
    padding: 2px 12px;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 22px;
}

.invoiceStatusLabel {
        color: #000 !important;
        font-size: 12px !important;
        margin-bottom: 0 !important;
        font-weight: 400 !important;
        line-height: 1.4em !important;
        padding: 5px !important;
        letter-spacing: 0px;
        background-color: #fff;
        text-align: center;
        border-radius: 26px;
        margin-top: 1px;
    }

.invoiceEditLabel {
    color: #000;
    /* margin-bottom: 15px; */
    /* margin-top: -5px; */
    position: absolute;
    font-size: 12px !important;
}

.hackedDueDate {
    opacity: .35;
    
}

.invoiceBody {
    background-color: #fff;
    padding: 5px 1.5em;
}

.invoiceTable {
    margin-bottom: 0;
}

.table {
    width: 100%;
    max-width: 100%;
    margin-bottom: 1rem;
    background-color: transparent;
}

table {
    /* border-collapse: collapse; */
}

.invoiceTable tr th {
    color: #000 !important;
    text-transform: uppercase;
    font-size: 13px;
    letter-spacing: 0px;
    font-weight: 600;
    border: none;
    border-bottom: 1px solid #ddd;
    padding: 15px 0px;
}

th {
    text-align: left;
}

.whiteText {
    color: #000 !important;
}
`;

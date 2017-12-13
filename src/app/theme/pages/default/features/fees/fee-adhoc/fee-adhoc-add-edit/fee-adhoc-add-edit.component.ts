import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import * as _ from 'lodash/index';
import { Observable } from 'rxjs/Rx';
import { ConfirmationService } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { AdhocFeeService, CommonService, ClassService, CategoriesService } from '../../../../_services/index';
import { AdhocFee } from "../../../../_models/index";

@Component({
    selector: "app-fee-adhoc-add-edit",
    templateUrl: "./fee-adhoc-add-edit.component.html",
    encapsulation: ViewEncapsulation.None,
})

export class AdhocFeeAddEditComponent implements OnInit {
    params: number;
    adhocFeeForm: FormGroup;
    minDueDate: any;
    classList: any = [];
    categoryList: any = [];
    isClassSelected: boolean = false;
    isCategorySelected: boolean = false;
    isSubmitted: boolean = false;
    confirmFeeCharges: boolean = false;
    isTransactionProcessed: boolean;

    constructor(
        private formBuilder: FormBuilder,
        private adhocFeeService: AdhocFeeService,
        private commonService: CommonService,
        private route: ActivatedRoute,
        private router: Router,
        private categoriesService: CategoriesService,
        private globalErrorHandler: GlobalErrorHandler,
        private classService: ClassService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService) {
    }
    ngOnInit() {
        this.minDueDate = new Date();
        this.adhocFeeForm = this.formBuilder.group({
            id: [],
            adhocfeeName: ['', [Validators.required]],
            //adhocfeeDescription: ['', [Validators.required]],
            dueDate: ['', [Validators.required]],
            //invoiceDetailText: [''],
            invoiceDescription: ['', [Validators.required]],
            adhocFeeCharges: ['', [Validators.required]],
            adhocConfirmFeeCharges: [null, [Validators.required]],
            classes: [],
            categories: []
        });



        this.route.params.forEach((params: Params) => {
            this.params = params['id'];
        });

        Observable.forkJoin([this.classService.getAllClasses(), this.categoriesService.getAllCategories()])
            .subscribe((response) => {
                if (this.params) {
                    this.adhocFeeService.getAdhocFeeById(this.params)
                        .subscribe((results: any) => {
                            var classArray = _.map(_.uniqBy(results.feeDetails, 'classId'), function (item) {
                                return {
                                    id: item.classId,
                                };
                            });
                            var categoryArray = _.map(_.uniqBy(results.feeDetails, 'categoryId'), function (item) {
                                return {
                                    id: item.categoryId,
                                };
                            });
                            this.isTransactionProcessed = results.isTransactionProcessed;
                            if (this.isTransactionProcessed) {
                                this.onAlert();
                            }
                            this.classList = this.updateList(response[0], classArray);
                            this.categoryList = this.updateList(response[1], categoryArray);
                            this.adhocFeeForm.setValue({
                                id: results.id,
                                adhocfeeName: results.adhocfeeName,
                                // adhocfeeDescription: results.adhocfeeDescription,
                                dueDate: new Date(results.dueDate),
                                // invoiceDetailText: results.invoiceDetailText ? results.invoiceDetailText : '',
                                invoiceDescription: results.invoiceDescription ? results.invoiceDescription : '',
                                adhocFeeCharges: results.adhocFeeCharges,
                                adhocConfirmFeeCharges: results.adhocFeeCharges,
                                classes: [],
                                categories: []
                            });
                            this.adhocFeeForm.removeControl('classes');
                            this.adhocFeeForm.removeControl('categories');
                            this.adhocFeeForm.addControl('classes', this.buildArray(this.classList));
                            this.adhocFeeForm.addControl('categories', this.buildArray(this.categoryList));

                        }, error => {
                            this.globalErrorHandler.handleError(error);
                        })
                } else {
                    this.classList = this.updateList(response[0], []);
                    this.categoryList = this.updateList(response[1], []);
                    this.adhocFeeForm.removeControl('classes');
                    this.adhocFeeForm.removeControl('categories');
                    this.adhocFeeForm.addControl('classes', this.buildArray(this.classList));
                    this.adhocFeeForm.addControl('categories', this.buildArray(this.categoryList));
                }
            });
    }

    onAlert() {
        this.confirmationService.confirm({
            message: 'Record Already Processed.Not Available For Update.',
            header: 'Processed',
            icon: 'fa fa-trash',
            reject: () => {
            }
        });
    }

    getArray(field): FormArray {
        return this.adhocFeeForm.get(field) as FormArray;
    };

    buildArray(fieldList) {
        const arr = fieldList.map(s => {
            return this.formBuilder.control(s.selected);
        })
        return this.formBuilder.array(arr);
    }

    updateList(list, assignedArray) {
        for (var index = 0; index < list.length; index++) {
            var item = list[index];
            item.selected = false;
            if (assignedArray && assignedArray.length > 0) {
                let assignedItem = _.find(assignedArray, { id: item.id })
                if (assignedItem) {
                    item.selected = true;
                }
            }
        }
        return list;
    }

    private getSelectedAssociation(value) {
        let selectedAssociation = [];
        for (var index = 0; index < value.classes.length; index++) {
            if (value.classes[index] == true) {
                for (var count = 0; count < value.categories.length; count++) {
                    if (value.categories[count] == true) {
                        selectedAssociation.push({
                            adhocFeeId: value.id,
                            classId: this.classList[index].id,
                            categoryId: this.categoryList[count].id,
                        })
                    }
                }
            }
        }
        return selectedAssociation;
    }
    onConfirmCharges() {
        if (this.adhocFeeForm.get('adhocConfirmFeeCharges').value !== null) {
            if (this.adhocFeeForm.get('adhocFeeCharges').value !== this.adhocFeeForm.get('adhocConfirmFeeCharges').value) {
                this.confirmFeeCharges = true;
            } else {
                this.confirmFeeCharges = false;
            }
        } else {
            this.confirmFeeCharges = false;
        }
    }
    onSubmit({ value, valid }: { value: any, valid: boolean }) {
        let selectedAssociation = [];
        this.isSubmitted = true;
        this.isClassSelected = false;
        this.isCategorySelected = false;
        let currentThis = this;

        this.isClassSelected = value.classes.includes(true);
        this.isCategorySelected = value.categories.includes(true);

        if (this.isClassSelected && this.isCategorySelected && !this.confirmFeeCharges) {
            value.schoolId = localStorage.getItem('schoolId');
            value.dueDate = new Date(new Date(value.dueDate).setHours(22));//.getFullYear() + '-' + (value.dueDate.getMonth() + 1) + '-' + value.dueDate.getDate();
            if (this.params) {
                this.adhocFeeService.updateAdhocFee(value)
                    .subscribe(
                    results => {
                        let selectedAssociation = currentThis.getSelectedAssociation(value);
                        this.adhocFeeService.updateAdhocFeeAssociation(selectedAssociation)
                            .subscribe(
                            results => {
                                this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Updated Successfully' });
                                this.router.navigate(['/features/adhocFee/list']);
                            },
                            error => {
                                this.globalErrorHandler.handleError(error);
                            });
                    },
                    error => {
                        this.globalErrorHandler.handleError(error);
                    });


            } else {
                value.dueDate = new Date(new Date(value.dueDate).setHours(22));
                this.adhocFeeService.createAdhocFee(value)
                    .subscribe(
                    results => {
                        value.id = results.id;
                        let selectedAssociation = currentThis.getSelectedAssociation(value);
                        this.adhocFeeService.updateAdhocFeeAssociation(selectedAssociation)
                            .subscribe(
                            results => {
                                this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Added Successfully' });
                                this.router.navigate(['/features/adhocFee/list']);
                            },
                            error => {
                                this.globalErrorHandler.handleError(error);
                            });
                    },
                    error => {
                        this.globalErrorHandler.handleError(error);
                    });
            }
        }
    }

    onCancel() {
        this.router.navigate(['/features/adhocFee/list']);
    }

}

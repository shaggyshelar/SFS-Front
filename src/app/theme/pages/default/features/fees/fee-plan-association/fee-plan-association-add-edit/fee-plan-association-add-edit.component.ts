import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import * as _ from 'lodash/index';

import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { Boards } from "../../../../_models/index";
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { FeePlanAssociationService, CommonService, AcademicYearService } from '../../../../_services/index';
import { Helpers } from "../../../../../../../helpers";

@Component({
    selector: "app-feePlanAccosiation-add-edit",
    templateUrl: "./fee-plan-association-add-edit.component.html",
    encapsulation: ViewEncapsulation.None,
})

export class FeePlanAssociationAddEditComponent implements OnInit {
    feePlanAssociationForm: FormGroup;
    classList: any;
    categoryList: any;
    params: number;
    assignedClassArray: any;
    assignedCategoryArray: any;
    isClassSelected: boolean = false;
    isCategorySelected: boolean = false;
    isSubmitted: boolean = false;
    feePlanName: string;
    academicYearList: any;

    constructor(
        private formBuilder: FormBuilder,
        private globalErrorHandler: GlobalErrorHandler,
        private commonService: CommonService,
        private feePlanAssociationService: FeePlanAssociationService,
        private academicYearService: AcademicYearService,
        private route: ActivatedRoute,
        private router: Router,
        private messageService: MessageService) {
    }

    ngOnInit() {
        this.categoryList = [];
        this.classList = [];
        this.academicYearList = [];
        this.assignedCategoryArray = [];
        this.assignedClassArray = [];
        this.feePlanAssociationForm = this.formBuilder.group({
            feeplanId: [],
            academicYear: ['', [Validators.required]],
            classes: [],
            categories: []
        });
        this.route.params.forEach((params: Params) => {
            this.params = params['id'];
        });
        if (this.params) {
            Observable.forkJoin([this.commonService.getClass(), this.commonService.getCategory(), this.academicYearService.getAllAcademicYears()])
                .subscribe((response) => {

                    this.feePlanAssociationService.getFeePlanAssociationById(this.params)
                        .subscribe((results: any) => {
                            var classArray = _.map(_.uniqBy(results.associations, 'classId'), function (item) {
                                return {
                                    id: item.classId,
                                };
                            });
                            var categoryArray = _.map(_.uniqBy(results.associations, 'categoryId'), function (item) {
                                return {
                                    id: item.categoryId,
                                };
                            });
                            this.feePlanName = results.feePlanName;
                            this.classList = this.updateList(response[0], classArray);
                            this.categoryList = this.updateList(response[1], categoryArray);
                            this.academicYearList = response[2];
                            this.feePlanAssociationForm.setValue({
                                feeplanId: results.id,
                                academicYear: results.associations && results.associations.length > 0 ? results.associations[0].academicYear : '',
                                classes: [],
                                categories: []
                            });
                            this.feePlanAssociationForm.removeControl('classes');
                            this.feePlanAssociationForm.removeControl('categories');
                            this.feePlanAssociationForm.addControl('classes', this.buildArray(this.classList));
                            this.feePlanAssociationForm.addControl('categories', this.buildArray(this.categoryList));

                        }, error => {
                            this.globalErrorHandler.handleError(error);
                        })


                });
        }
    }

    getArray(field): FormArray {
        return this.feePlanAssociationForm.get(field) as FormArray;
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
    onCancel() {
        this.router.navigate(['/features/feePlanAssociation/list']);
    }

    onSubmit({ value, valid }: { value: any, valid: boolean }) {
        let selectedFeePlanAssociation = [];
        this.isSubmitted = true;
        this.isClassSelected = false;
        this.isCategorySelected = false;
        for (var index = 0; index < value.classes.length; index++) {
            if (value.classes[index] == true) {
                this.isClassSelected = true;
                for (var count = 0; count < value.categories.length; count++) {
                    if (value.categories[count] == true) {
                        this.isCategorySelected = true;
                        selectedFeePlanAssociation.push({
                            feeplanId: value.feeplanId,
                            classId: this.classList[index].id,
                            categoryId: this.categoryList[count].id,
                            academicYear: value.academicYear,
                        })
                    }
                }
            }
        }
        if (this.params && this.isClassSelected && this.isCategorySelected) {
            this.feePlanAssociationService.updateFeePlanAssociation(selectedFeePlanAssociation, value.feeplanId)
                .subscribe(
                results => {
                    this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Updated Successfully' });
                    this.router.navigate(['/features/feePlanAssociation/list']);
                },
                error => {
                    this.globalErrorHandler.handleError(error);
                });
        }
    }
}
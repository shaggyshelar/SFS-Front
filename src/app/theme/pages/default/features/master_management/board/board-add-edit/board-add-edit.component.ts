import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import * as _ from 'lodash/index';

import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';

import { BoardService } from '../../../../_services/index';
import { Boards } from "../../../../_models/boards";
import { Helpers } from "../../../../../../../helpers";
@Component({
  selector: "app-board-add-edit",
  templateUrl: "./board-add-edit.component.html",
  encapsulation: ViewEncapsulation.None,
})

export class BoardAddEditComponent implements OnInit {
 params: number;
 boardForm: FormGroup;

     constructor(
        private formBuilder: FormBuilder,
        private boardService: BoardService,
        private route: ActivatedRoute,
        private router: Router,
        private globalErrorHandler: GlobalErrorHandler,
        private messageService: MessageService) {
    }
  ngOnInit() {
        this.boardForm = this.formBuilder.group({
            id: [],
            boardName: ['', [Validators.required]],
            boardDescription: [''],
        });

    this.route.params.forEach((params: Params) => {
            this.params = params['boardId'];
            if (this.params) {
                Helpers.setLoading(false);
                this.boardService.getBoardById(this.params)
                    .subscribe((results: any) => {
                        this.boardForm.setValue({
                            id: results.id,
                            boardName: results.boardName,
                            boardDescription: results.boardDescription
                        });  
                    }, error => {
                        Helpers.setLoading(false);
                        this.globalErrorHandler.handleError(error);
                    })
            }
        });
  }

 onSubmit({ value, valid }: { value: any, valid: boolean }) {
        if (this.params) {   
            this.boardService.updateBoard(value)
                .subscribe(
                results => {
                    this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Updated Successfully' });
                    this.router.navigate(['/features/board/list']);
                },
                error => {
                    this.globalErrorHandler.handleError(error);
                });
        } else {
            this.boardService.createBoard(value)
                .subscribe(
                results => {
                    this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Added Successfully' });
                    this.router.navigate(['/features/board/list']);
                },
                error => {
                    this.globalErrorHandler.handleError(error);
                });
        }
    }

    onCancel() {
       this.router.navigate(['/features/board/list']);
    }
 
}

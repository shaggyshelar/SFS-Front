import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { GlobalErrorHandler } from '../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../_services/message.service';

import { StudentService } from '../../../_services/student.service';
import { Student } from "../../../_models/student";

@Component({
    selector: "app-student-list",
    templateUrl: "./student-list.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class StudentListComponent implements OnInit {
    studentList :  Observable<Student[]>;  
    constructor(private router: Router, private studentService : StudentService, 
        private globalErrorHandler : GlobalErrorHandler , private messageService: MessageService) {
    }

    ngOnInit() {
        this.getAllStudents();
    }

    getAllStudents() {
        this.studentList = this.studentService.getAllStudents();      
    }
    onAddStudent() {
    }

    onEditStudentClick(student: Student) {
        this.router.navigate(['/features/student/edit', student.id]);
    }
    onStudentDeleteClick(student: Student) {
        this.studentService.deleteStudent(student.id).subscribe(
            data => {
                this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Deleted Successfully' });
                this.getAllStudents();
            }, error => {
                this.globalErrorHandler.handleError(error);
            });
    }
}

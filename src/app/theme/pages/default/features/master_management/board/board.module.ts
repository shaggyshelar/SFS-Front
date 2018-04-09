import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from '../../../default.component';
import { LayoutModule } from '../../../../../layouts/layout.module';

import { AuthGuard } from "../../../../../../auth/_guards/auth.guard";
import { BoardService  } from '../../../_services/index';
import { BoardComponent } from './board.component';
import { BoardListComponent } from './board-list/board-list.component';
import { BoardAddEditComponent } from './board-add-edit/board-add-edit.component';

import {
  DropdownModule,
  ConfirmDialogModule,
  ConfirmationService,
} from 'primeng/primeng';

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: BoardComponent,
        children: [
          {
            path: 'list',
            component: BoardListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['Board.Read']
            }
          },
          {
            path: 'add',
            component: BoardAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['Board.Create']
            }
          },
          {
            path: 'edit/:boardId',
            component: BoardAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['Board.Update']
            }
          },
        ]
      }
    ]
  },
];

@NgModule({
  imports: [
    CommonModule, RouterModule.forChild(routes),
    LayoutModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    DropdownModule,
    ConfirmDialogModule
  ],
  declarations: [
    BoardComponent,
    BoardListComponent,
    BoardAddEditComponent,
  ],
  providers: [
    BoardService,
    ConfirmationService
  ],
})
export class BoardModule {
}

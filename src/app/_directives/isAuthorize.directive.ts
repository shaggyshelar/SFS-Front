/* tslint:disable:member-ordering */
import { Directive, ElementRef, Renderer, Input } from '@angular/core';

@Directive({
    selector: '[isAuthorize]'
})
export class IsAuthorizeDirective {

    @Input() isAuthorize: Array<string>;
    private _element: HTMLElement;
    constructor(_element: ElementRef) {
        this._element = _element.nativeElement;
    }

    ngOnInit() {
        this.checkPermission();
    }

    checkPermission() {
        let userHasPermissions = false;
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.permissions) {
            for (var i = 0; i < this.isAuthorize.length; i++) {
                if (currentUser.permissions.indexOf(this.isAuthorize[i]) === -1) {
                    userHasPermissions = false;
                    //    break;
                } else {
                    userHasPermissions = true;
                }
            }
            if (!userHasPermissions) {
                this._element.style.display = 'none';
            }
        }
    }
}

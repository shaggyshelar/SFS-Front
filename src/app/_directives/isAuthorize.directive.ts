/* tslint:disable:member-ordering */
import { Directive, ElementRef, Renderer, Input } from '@angular/core';

@Directive({
    selector: '[isAuthorize]'
})
export class IsAuthorizeDirective {

    // @Input('isAuthorize') permission: string;
    // permissions: any;
    // constructor(private el: ElementRef, private renderer: Renderer) {
    // }
    // ngOnInit() {
    //     console.log('this.permission', this.permission);
    //     let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    //     if (currentUser && currentUser.permissions) {
    //         // Use renderer to render the element with styles
    //         if (!currentUser.permissions.includes(this.permission)) {
    //             this.renderer.setElementStyle(this.el.nativeElement, 'display', 'none');
    //         }
    //     }
    // }

 @Input() isAuthorize: Array<string>;
    private _element: HTMLElement;
    constructor( _element: ElementRef) {
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

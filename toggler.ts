class GoodToggler extends HTMLElement{
    
    private _toggled : boolean;
    public get toggled() : boolean {
        return this._toggled;
    }
    public set toggled(v : boolean) {
        this._toggled = v;
    }
    
    constructor(){
        super();
    }
}
window.customElements.define('good-toggler',GoodToggler)
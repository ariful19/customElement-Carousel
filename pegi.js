class CPages extends HTMLElement {
    constructor() {
        super();
        this.currentPage = 0;
        this.styles = `
        .root{
            display: flex;
            flex-flow: row wrap;
            align-items: center;
            justify-content: space-around;
        }
        .root>button{
            border: none;
            background: linear-gradient(to bottom,#dbffd2, rgba(94, 160, 86, 0.36)), radial-gradient(at 50% 100%,#00ffdc,green,blue);
            color: white;
            line-height: 1.5em;
            filter: drop-shadow(2px 2px 2px black);
            cursor: pointer;
        }
        .root>div>button{
            margin: 0 .2em;
            border: none;
            line-height: 1.5em;
            border-radius: 4px;
            background: linear-gradient(to bottom,#ccd4fd, rgba(94, 160, 86, 0.36)), radial-gradient(at 50% 100%,#ffbc00,green,blue);
            color: white;
            cursor: pointer;
        }
        .selectedBtn{
            background: linear-gradient(to bottom,#f1ccfd, rgba(94, 160, 86, 0.36)), radial-gradient(at 50% 100%,#ffbc00,#fcff4c,blue) !important;
        }
    `;
        setTimeout(() => this.load(), 1000);
    }
    load() {
        this.shadow = this.attachShadow({ mode: "open" });
        var style = document.createElement('style');
        style.innerHTML = this.styles;
        this.shadow.appendChild(style);
        let root = document.createElement('div');
        root.classList.add("root");
        let prev = document.createElement('button');
        prev.innerHTML = "&lt; Previous";
        let pageCount = parseInt(this.getAttribute('page-count'));
        this.pgCount = pageCount;
        prev.addEventListener('click', (ev) => {
            this.currentPage = this.currentPage > 0 ? this.currentPage - 1 : 0;
            if (this.currentPage < this.c - 10) {
                this.c = this.c - 10 > 10 ? this.c - 10 : 10;
                this.GenBtns(this.c - 10, this.c);
            }
            this.HilightSelectedPage();
        });
        root.appendChild(prev);
        this.pegBtnContainer = document.createElement('div');
        this.c = pageCount;
        this.c = this.c > 10 ? 10 : this.c;
        this.GenBtns(0, this.c);
        root.appendChild(this.pegBtnContainer);
        let next = document.createElement('button');
        next.innerHTML = "Next &gt;";
        next.addEventListener('click', (ev) => {
            this.currentPage = this.currentPage < pageCount - 1 ? this.currentPage + 1 : pageCount - 1;
            if (this.currentPage > this.c - 1) {
                this.c = pageCount > this.c + 10 ? this.c + 10 : pageCount;
                this.GenBtns(this.c - 10, this.c);
            }
            this.HilightSelectedPage();
        });
        root.appendChild(next);
        this.shadow.appendChild(root);
        this.setAttribute('page', this.currentPage.toString());
    }
    GenBtns(arg0, arg1) {
        this.pegBtnContainer.innerHTML = "";
        if (arg0 > 0) {
            const btn = document.createElement('button');
            btn.innerHTML = "...";
            btn.setAttribute('style', `background: #94fbfb;
            color: #311616;
            width: 2em;
            font-weight: bold;`);
            this.pegBtnContainer.appendChild(btn);
            btn.addEventListener('click', (ev) => {
                this.c = this.c - 10 > 10 ? this.c - 10 : 10;
                this.GenBtns(this.c - 10, this.c);
            });
        }
        for (let index = arg0; index < arg1; index++) {
            const btn = document.createElement('button');
            btn.innerHTML = (index + 1).toString();
            this.pegBtnContainer.appendChild(btn);
            btn.addEventListener('click', (ev) => {
                let btn = ev.target;
                btn.classList.add('nbtn');
                this.currentPage = parseInt(btn.innerHTML) - 1;
                this.setAttribute('page', this.currentPage.toString());
                this.HilightSelectedPage();
            });
        }
        if (arg1 < this.pgCount) {
            const btn = document.createElement('button');
            btn.innerHTML = "...";
            btn.setAttribute('style', `background: #94fbfb;
            color: #311616;
            width: 2em;
            font-weight: bold;`);
            this.pegBtnContainer.appendChild(btn);
            btn.addEventListener('click', (ev) => {
                this.c = this.pgCount > this.c + 10 ? this.c + 10 : this.pgCount;
                this.GenBtns(this.c - 10, this.c);
            });
        }
    }
    HilightSelectedPage() {
        var btns = this.shadow.querySelectorAll('.root>div>button');
        for (let index = 0; index < btns.length; index++) {
            const element = btns[index];
            element.classList.remove('selectedBtn');
            if (element.innerHTML == (this.currentPage + 1).toString()) {
                element.classList.add('selectedBtn');
            }
        }
    }
}
customElements.define('c-pages', CPages);

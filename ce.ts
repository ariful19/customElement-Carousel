class CarouselItem extends HTMLElement {
    constructor() {
        super()
    }
}

class Carousel extends HTMLElement {
    private styletext =
        `
        @keyframes fadeIn{
            0%{
                opacity:0;
                transform:translateZ(-100px) rotateY(-90deg);
                transform-origin:100% 50%;
            }
            100%{
                opacity:1;
                transform:translateZ(0) rotateY(0deg);
                transform-origin:100% 50%;                
            }
        }
        @keyframes fadeOut{
            0%{
                opacity:1;
                transform:translateZ(0) rotateY(0deg);
                transform-origin:0% 50%;
            }
            100%{
                opacity:0;
                transform:translateZ(100px) rotateY(90deg);
                transform-origin:0% 50%;
            }
        }
        
        .container{
            display:flex;
            flex-flow:column;
            align-items:center;
            perspective:200px;
        }

        .buletContainer{
            display: flex;
            flex-flow: row;
            justify-content: center;
        }

        .bulet{
            height: 1em;
            width: 1em;
            background-color: #b9b8b8;
            border-radius: 50%;
            box-shadow: 1px 1px 1px #403e3e inset;
            margin: 0.3em;
            display:flex;
            align-items:center;
            justify-content:center;
            cursor: pointer;
        }
 
 `
    private shadow: ShadowRoot;
    constructor() {
        super()
        this.Initialize();
    }
    private items: CarouselItem[] = [];
    private bulets: HTMLDivElement[] = [];
    public interval: number;
    transitionDuration: number;
    container: HTMLDivElement;
    Initialize() {
        let items = this.querySelectorAll('good-crsl-item')
        for (const element of items) {
            this.items.push(element.cloneNode(true) as CarouselItem);
            element.remove();
        }
        this.interval = this.hasAttribute('interval') ? parseFloat(this.getAttribute('interval')) : 3000;
        this.transitionDuration = this.hasAttribute('trans-duration') ? parseFloat(this.getAttribute('trans-duration')) : 500;
        let hasNumbers=this.hasAttribute('numbered');

        this.shadow = this.attachShadow({ mode: "open" })

        let style = document.createElement('style');
        style.textContent = this.styletext;
        this.shadow.appendChild(style);

        this.container = document.createElement('div');
        this.container.classList.add('container');
        this.shadow.appendChild(this.container);

        let buletContainer = document.createElement('div');
        buletContainer.classList.add('buletContainer');
        this.items.forEach(i => {
            let bulet = document.createElement('div');
            bulet.classList.add('bulet');
            this.bulets.push(bulet);
            buletContainer.appendChild(bulet);
            bulet.addEventListener('click', (e) => {
                let index = this.bulets.indexOf(bulet);
                this.index = index;
                this.SetItem();
            })
            if(hasNumbers){
                let span=document.createElement('span');
                span.style.fontSize=".7em";
                span.style.color="#ffffff";
                span.innerHTML=(this.bulets.indexOf(bulet)+1).toString();
                bulet.appendChild(span)
            }
        })
        this.shadow.appendChild(buletContainer);

        this.Start();
    }
    private index = 0;
    private intrvl;
    Start() {

        this.container.innerHTML = "";
        this.SetItem();

        if (this.intrvl) clearInterval(this.intrvl);
        this.intrvl = setInterval(() => {
            this.SetItem();
        }, this.interval)
    }
    currentItem: CarouselItem;
    SetItem(): any {
        this.currentItem = !this.currentItem ? this.items[0] : this.currentItem;
        if (this.currentItem)
            this.currentItem.style.animation = `fadeOut ${this.transitionDuration}ms ease`;
        setTimeout(() => {
            this.container.innerHTML = "";
            let len = this.items.length;
            this.container.appendChild(this.items[this.index]);
            this.items[this.index].style.animation = `fadeIn ${this.transitionDuration}ms ease`;
            this.bulets.forEach(element => {
                element.style.backgroundColor = "#b9b8b8"
            });
            this.bulets[this.index].style.backgroundColor = "gray";
            this.currentItem = this.items[this.index];
            this.index = this.index == len - 1 ? 0 : this.index + 1;
        }, this.transitionDuration)
    }
}
class GoodSpinnerItem extends HTMLElement {
    constructor() {
        super();
    }
}
class GoodSpinner extends HTMLElement {
    constructor() {
        super();
        this.items = [];
        this.interval = 3000;
        this.index = 0;
        this.stylel = `
    @keyframes inRtoL{
        from{
            opacity:0;
            transform:translateX(300px);
        }
        to{
            opacity:1;
            transform:translateX(0);
        }
    }
    @keyframes inLtoR{
        from{
            opacity:0;
            transform:translateX(-300px);
        }
        to{
            opacity:1;
            transform:translateX(0);
        }
    }
    @keyframes outRtoL{
        from{
            opacity:1;
            transform:translateX(0);            
        }
        to{
            opacity:0;
            transform:translateX(-300px);
        }
    }
    @keyframes outLtoR{
        from{
            opacity:1;
            transform:translateX(0);            
        }
        to{
            opacity:0;
            transform:translateX(300px);
        }
    }
    `;
        this.init();
    }
    init() {
        let items = this.querySelectorAll('good-spinner-item');
        this.interval = this.hasAttribute('interval') ? parseInt(this.getAttribute('interval')) : 10000;
        for (let index = 0; index < items.length; index++) {
            const element = items.item(index);
            element.style.transition = 'all .5s';
            this.items.push(element.cloneNode(true));
            element.remove();
        }
        this.setAttribute('style', 'display:grid;grid-template-columns:1fr; grid-template-rows:1fr');
        let style = document.createElement('style');
        style.textContent = this.stylel;
        this.appendChild(style);
        this.containerDiv = document.createElement('div');
        this.containerDiv.setAttribute('style', 'grid-column:1;grid-row:1;perspective:500px');
        this.appendChild(this.containerDiv);
        this.arrowDiv = document.createElement('div');
        this.arrowDiv.setAttribute('style', `grid-column:1;grid-row:1;display: flex;
        flex-flow: row;
        justify-content: space-between;
        align-items: center;
        font-size: 5em;
        color: white;
        filter: drop-shadow(2px 2px 4px gray) opacity(.7);`);
        this.arrowDiv.innerHTML = `<div>&lt;</div><div>&gt;</div>`;
        this.appendChild(this.arrowDiv);
        this.leftArrow = this.arrowDiv.children.item(0);
        this.rightArrow = this.arrowDiv.children.item(1);
        this.leftArrow.style.cursor = 'pointer';
        this.rightArrow.style.cursor = 'pointer';
        this.leftArrow.addEventListener('click', () => {
            this.index = this.index == 0 ? this.items.length - 1 : this.index - 1;
            this.index = this.index == 0 ? this.items.length - 1 : this.index - 1;
            clearInterval(this.ival);
            this.change(true);
            this.Start();
        });
        this.rightArrow.addEventListener('click', () => {
            this.index = this.items.length - 1 == this.index ? 0 : this.index + 1;
            clearInterval(this.ival);
            this.change();
            this.Start();
        });
        this.change();
        this.Start();
    }
    Start() {
        this.ival = setInterval(() => this.change(), this.interval);
    }
    change(isLtoR) {
        let current = this.containerDiv.querySelector('good-spinner-item');
        if (current) {
            current.style.animation = isLtoR ? 'outLtoR .5s forwards' : 'outRtoL .5s forwards';
        }
        setTimeout(() => {
            this.containerDiv.innerHTML = '';
            let el = this.items[this.index];
            this.containerDiv.appendChild(el);
            el.style.animation = isLtoR ? 'inLtoR .5s forwards' : 'inRtoL .5s forwards';
            this.index = this.items.length - 1 == this.index ? 0 : this.index + 1;
        }, 500);
    }
}
customElements.define('good-spinner-item', GoodSpinnerItem);
customElements.define('good-spinner', GoodSpinner);
customElements.define('good-crsl-item', CarouselItem);
customElements.define('good-crsl', Carousel);

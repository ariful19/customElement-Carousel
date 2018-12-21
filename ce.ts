class CarouselItem extends HTMLElement {
    private shadow: ShadowRoot
    constructor() {
        super()
        this.Initialize();
    }
    Initialize() {
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

customElements.define('good-crsl-item', CarouselItem);
customElements.define('good-crsl', Carousel);
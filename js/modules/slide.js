export default class Slide {
    constructor(slide, wrapper) {
        this.slide = document.querySelector(slide)
        this.wrapper = document.querySelector(wrapper)
        this.dist = {
            startX: 0,
            finalPosition: 0,
            movement: 0
        }
    }

    moveSlide(distX) {
        this.dist.movePosition = distX
        this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
    }

    updatePosition(clientX) {
        this.dist.movement = (this.dist.startX - clientX) * 2;
        return this.dist.finalPosition - this.dist.movement;
    }

    onStart(event) {
        let movetype;
        if (event.type === 'mousedown') {
            event.preventDefault();
            movetype = 'mousemove';
            this.dist.startX = event.clientX;
        } else {
            movetype = 'touchmove';
            this.dist.startX = event.changedTouches[0].clientX;
        }
        this.wrapper.addEventListener(movetype, this.onMove);
    }
    
    onMove(event) {
        const typePointer = (event.type === 'mousemove')
        ? event.clientX
        : event.changedTouches[0].clientX;
        this.finalPosition = this.updatePosition(typePointer);
        this.moveSlide(this.finalPosition);
    }
    
    onEnd(event) {
        const movetype = (event.type === 'mousemove')
        ? 'mousemove'
        : 'touchmove'
        this.wrapper.removeEventListener(movetype, this.onMove);
        this.dist.finalPosition = this.dist.movePosition
    }
    
    addSlideEvents() {
        this.wrapper.addEventListener('mousedown', this.onStart);
        this.wrapper.addEventListener('touchstart', this.onStart);
        this.wrapper.addEventListener('mouseup', this.onEnd);
        this.wrapper.addEventListener('touchend', this.onEnd);
    }

    bindElements() {
        this.onStart = this.onStart.bind(this)
        this.onMove = this.onMove.bind(this)
        this.onEnd = this.onEnd.bind(this)
    }

    // config

    slidePosition(item) {
        const marginLeft = (this.wrapper.offsetWidth - item.offsetWidth) / 2
        return -(item.offsetLeft - marginLeft)
    }

    slideConfig() {
        const configArr = [ ...this.slide.children ].map( (element) => {
            const position = this.slidePosition(element)
            return {
                element,
                position
            }
        })
        this.slideArr = configArr
    }

    slideNavIndex(index) {
        const lastItem = this.slideArr.length - 1
        this.navigator = {
            prev: index ? index - 1 : undefined,
            active: index,
            next: (lastItem === index) ? undefined : index + 1
        }
    }

    changeSlide(index) {
        this.moveSlide(this.slideArr[index].position)
        this.slideNavIndex(index)
        this.dist.finalPosition = this.slideArr[index].position
    }

    init() {
        if (this.slide && this.wrapper) {
            this.bindElements();
            this.addSlideEvents();
            this.slideConfig();
        }
    }
}
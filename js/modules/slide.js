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

    init() {
        if (this.slide && this.wrapper) {
            this.bindElements();
            this.addSlideEvents();
        }
    }
}
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
        event.preventDefault();
        this.dist.startX = event.clientX;
        this.wrapper.addEventListener('mousemove', this.onMove);
    }
    
    onMove(event) {
        this.finalPosition = this.updatePosition(event.clientX);
        this.moveSlide(this.finalPosition);
        this.wrapper.addEventListener('mouseup', this.onEnd);
    }
    
    onEnd() {
        this.wrapper.removeEventListener('mousemove', this.onMove);
        this.dist.finalPosition = this.dist.movePosition
    }

    addSlideEvents() {
        this.wrapper.addEventListener('mousedown', this.onStart);
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
import debounce from "./debounce.js"

export class Slide {
    constructor(slide, wrapper) {
        this.slide = document.querySelector(slide)
        this.wrapper = document.querySelector(wrapper)
        this.dist = {
            startX: 0,
            finalPosition: 0,
            movement: 0
        }
    }

    transition(boo) {
        this.slide.style.transition = boo ? 'transform .3s' : '';
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
        this.transition(false)
    }
    
    onMove(event) {
        const typePointer = (event.type === 'mousemove')
        ? event.clientX
        : event.changedTouches[0].clientX;
        this.finalPosition = this.updatePosition(typePointer);
        this.moveSlide(this.finalPosition);
        this.transition(false)
    }
    
    onEnd(event) {
        const movetype = (event.type === 'mouseup')
        ? 'mousemove'
        : 'touchmove'
        this.wrapper.removeEventListener(movetype, this.onMove);
        this.dist.finalPosition = this.dist.movePosition
        this.transition(true)
        this.changeSlideOnEnd()
    }
    
    changeSlideOnEnd() {
        if (this.dist.movement > 120 && this.navigator.next !== undefined) {
            this.nextSlide()
        } else if (this.dist.movement < -120 && this.navigator.prev !== undefined) {
            this.prevSlide()
        } else {
            this.changeSlide(this.navigator.active)
        }
    }
    
    // Slide Navigator
    
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
        this.changeActiveClass();
    }
    
    prevSlide() {
        if (this.navigator.prev !== undefined) {
            this.changeSlide(this.navigator.prev)
        }
    }
    
    nextSlide() {
        if (this.navigator.next !== undefined) {
            this.changeSlide(this.navigator.next)
        }
    }
    
    autoPlay() {
        const interval = setInterval(() => {
            this.nextSlide()
            if (this.navigator.next === undefined) {
                clearInterval(interval)
            }
        }, 4000)
    }

    onResize() {
        setTimeout(() => {
            this.slideConfig()
            this.changeSlide(this.navigator.active)
        }, 1000)
    }

    addResizeEvent() {
        window.addEventListener('resize', this.onResize)
    }

    // Style

    changeActiveClass() {
        this.slideArr.forEach( (slide) => slide.element.classList.remove('active'))
        this.slideArr[this.navigator.active].element.classList.add('active');
    }

    // Configurações
    
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
        this.onResize = debounce(this.onResize.bind(this), 200)
        this.prevSlide = this.prevSlide.bind(this)
        this.nextSlide = this.nextSlide.bind(this)

    }

    init() {
        if (this.slide && this.wrapper) {
            this.bindElements();
            this.addSlideEvents();
            this.transition(true)
            this.slideConfig();
            this.addResizeEvent();
            this.changeSlide(0);
            // this.autoPlay();
        }
    }
}

export class SlideNav extends Slide {
    addArrow(prev, next){
        this.arrowPrev = document.querySelector(prev)
        this.arrowNext = document.querySelector(next)
        this.addArrowEvents();
    }
    
    addArrowEvents() {
        this.arrowPrev.addEventListener('click', this.prevSlide)
        this.arrowNext.addEventListener('click', this.nextSlide)
    }
}

export default class Slide {
    constructor(slide, wrapper) {
        this.slide = document.querySelector(slide)
        this.wrapper = document.querySelector(wrapper)
    }

    onStart(event) {
        event.preventDefault()
        console.log('entrou')
        this.wrapper.addEventListener('mousemove', this.onMove)
    }
    
    onMove() {
        console.log('movendo')
        this.wrapper.addEventListener('mouseup', this.onEnd)
    }
    
    onEnd() {
        console.log('saiu')
        this.wrapper.removeEventListener('mousemove', this.onMove)
    }

    addSlideEvents() {
        this.wrapper.addEventListener('mousedown', this.onStart)
    }

    bindElements() {
        this.onStart = this.onStart.bind(this)
        this.onMove = this.onMove.bind(this)
        this.onEnd = this.onEnd.bind(this)
    }

    init() {
        if (this.slide && this.wrapper) {
            this.bindElements()
            this.addSlideEvents()
        }
    }
}
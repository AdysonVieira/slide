import { Slide, SlideNav } from "./modules/slide.js"

const slide = new SlideNav('.slide', '.wrapper')

slide.init();
slide.addArrow(".prev", ".next");
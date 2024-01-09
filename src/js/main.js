import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

import {
  isThereСlass,
  initSplitText,
  isSafari,
  batchOnScroll,
  staggerChildren,
} from './basic/help-functions'

window.addEventListener('pageshow', function (event) {
  if (event.persisted) {
    window.location.reload()
  }
})

document.addEventListener('DOMContentLoaded', () => {
  // Split text lines
  initSplitText('[split-direction]');

  // Smooth Scroll
  window.smoother = ScrollSmoother.create({
    wrapper: '.smooth-wrapper',
    content: '#smooth-content',
    smooth: 1,
    smoothTouch: false,
    effects: true,
  })

  // Create Preloader function with calback that call next functions 
  // After preloader
  gsap.effects.split('[split-trigger="scroll"]')
  gsap.effects.split('[split-trigger="load"]')
  gsap.effects.fade('[fade-trigger="load"]')
  //  if (isThereСlass('[stagger-children]')) staggerChildren('[stagger-children]')
  //  if (isThereСlass('[zoom-out-trigger="scroll"]')) gsap.effects.zoomOut('[zoom-out-trigger="scroll"]')

  if (isSafari()) document.querySelector('html').classList.add('safari')
  // if (isThereСlass('.home-hero-section')) initHomeHeroAnimation();

})

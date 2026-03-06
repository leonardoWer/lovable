import {createHeartSlider} from "s/components/HeartSlider/HeartSlider.js";

document.addEventListener('DOMContentLoaded', () => {
    const sliderSection = document.querySelector('.slider-section');

    const slider = createHeartSlider();

    sliderSection.appendChild(slider);
})
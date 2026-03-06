import gsap from 'gsap';
import styles from './HeartSlider.module.css';
import {generateHeartPositions, SLIDER_CONFIG} from 's/js/constants';

export const createHeartSlider = (config = {}) => {
    // Объединяем конфигурацию с дефолтной
    const mergedConfig = {
        ...SLIDER_CONFIG,
        ...config,
        ANIMATION: { ...SLIDER_CONFIG.ANIMATION, ...config.ANIMATION }
    };

    const {
        IMAGES_COUNT,
        IMAGES_PATH,
        IMAGE_TITLES,
        PREFACE_TEXT,
        ANIMATION,
    } = mergedConfig;

    const HEART_POS = generateHeartPositions(IMAGES_COUNT);

    // Создаем основной контейнер
    const container = document.createElement('div');
    container.className = styles.sliderContainer;

    // Создаем обертку для слайдера
    const sliderWrapper = document.createElement('div');
    sliderWrapper.className = styles.sliderWrapper;

    // Создаем карточки
    const cards = [];
    const titles = IMAGE_TITLES.slice(0, IMAGES_COUNT);

    for (let i = 0; i < IMAGES_COUNT; i++) {
        const imageSrc = `${IMAGES_PATH}${i + 1}.jpg`;
        const title = titles[i] || `Воспоминание ${i + 1} ❤️`;
        const card = createCard(imageSrc, title, i);
        cards.push(card);
        sliderWrapper.appendChild(card);
    }

    // Создаем контейнер с заголовками (обновленный)
    const titleContainer = createTitleContainer(PREFACE_TEXT, titles);

    // Добавляем все элементы в контейнер
    container.appendChild(sliderWrapper);
    container.appendChild(titleContainer);

    // Состояние слайдера
    let currentIndex = 0;
    let isAnimating = false;
    let wheelTimeout;

    // Инициализируем позиции карточек
    positionCards(cards, HEART_POS, currentIndex);

    // Обработчик колесика мыши
    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (isAnimating) return;

        const delta = e.deltaY > 0 ? 1 : -1;

        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
            rotateCards(delta, cards, HEART_POS, ANIMATION, currentIndex, titles, (newIndex) => {
                currentIndex = newIndex;
                isAnimating = false;
            });
            isAnimating = true;
        }, 10);
    });

    return container;
};

const positionCards = (cards, positions, startIndex) => {
    const totalPositions = positions.length;

    cards.forEach((card, index) => {
        const positionIndex = (index + startIndex) % totalPositions;
        const position = positions[positionIndex];

        gsap.set(card, {
            left: `${position.x}%`,
            top: `${position.y}%`,
            zIndex: position.zIndex || index,
            opacity: 1,
        });
    });
};

const rotateCards = (direction, cards, positions, animationConfig, currentIndex, titles, onComplete) => {
    const totalCards = cards.length;
    const totalPositions = positions.length;

    let newIndex = (currentIndex + direction + totalCards) % totalCards;

    cards.forEach((card, index) => {
        const positionIndex = (index + newIndex) % totalPositions;
        const position = positions[positionIndex];

        gsap.to(card, {
            left: `${position.x}%`,
            top: `${position.y}%`,
            duration: animationConfig.DURATION,
            ease: animationConfig.EASE,
            onComplete: index === 0 ? () => {
                if (onComplete) onComplete(newIndex);
            } : null
        });

        if (positionIndex === 0) {
            gsap.to(card, {
                zIndex: 9999,
            })
        } else {
            gsap.to(card, {
                zIndex: position.zIndex || index,
            })
        }
    });

    // Анимируем смену текста в карусели
    animateTextChange(titles, currentIndex, newIndex, direction);
};

// Новая функция для анимации текста
const animateTextChange = (titles, oldIndex, newIndex, direction) => {
    const textCarousel = document.getElementById('text-carousel');
    if (!textCarousel) return;

    const itemHeight = parseFloat(textCarousel.dataset.itemHeight);
    const titlesCount = parseFloat(textCarousel.dataset.titlesCount);

    if (!itemHeight || !titlesCount) return;

    const currentY = gsap.getProperty(textCarousel, 'y');
    let targetY;

    if (direction < 0) {
        // Скролл вниз - двигаем вверх
        targetY = currentY - itemHeight;

        gsap.to(textCarousel, {
            y: targetY,
            duration: 0.4,
            ease: "power2.inOut",
            onComplete: () => {
                // Проверяем, не дошли ли до конца третьего набора
                const totalHeight = itemHeight * titlesCount * 3;
                const currentPos = gsap.getProperty(textCarousel, 'y');

                // Если мы в конце третьего набора (слишком далеко вверх)
                if (Math.abs(currentPos) > totalHeight - itemHeight * titlesCount) {
                    // Мгновенно перескакиваем в начало второго набора
                    gsap.set(textCarousel, {
                        y: -itemHeight * titlesCount
                    });
                }
            }
        });
    } else {
        // Скролл вверх - двигаем вниз
        targetY = currentY + itemHeight;

        gsap.to(textCarousel, {
            y: targetY,
            duration: 0.4,
            ease: "power2.inOut",
            onComplete: () => {
                // Проверяем, не дошли ли до начала первого набора
                const currentPos = gsap.getProperty(textCarousel, 'y');

                // Если мы в начале первого набора (слишком близко к 0 или положительное)
                if (currentPos >= -itemHeight) {
                    // Мгновенно перескакиваем в конец второго набора
                    gsap.set(textCarousel, {
                        y: -itemHeight * titlesCount * 2
                    });
                }
            }
        });
    }
};

const createCard = (imageSrc, title, index, showIndex = false) => {
    const card = document.createElement('div');
    card.className = styles.card;
    card.dataset.index = index;
    card.dataset.title = title;

    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = title;
    img.loading = 'lazy';

    card.appendChild(img);

    if (showIndex) {
        const indexBadge = document.createElement('div');
        indexBadge.className = styles.indexBadge;
        indexBadge.textContent = index + 1;
        card.appendChild(indexBadge);
    }

    return card;
};

// Обновленная функция создания контейнера с заголовками
const createTitleContainer = (prefaceText, titles) => {
    const container = document.createElement('div');
    container.className = styles.titleContainer;

    const preface = document.createElement('p');
    preface.className = styles.titleText;
    preface.textContent = prefaceText;

    // Создаем контейнер для карусели текста
    const textCarouselWrapper = document.createElement('div');
    textCarouselWrapper.className = styles.textCarouselWrapper;

    const textCarousel = document.createElement('div');
    textCarousel.className = styles.textCarousel;
    textCarousel.id = 'text-carousel';

    // Добавляем все заголовки в карусель
    for (let i = 0; i < 3; i++) {
        titles.forEach(title => {
            const titleItem = document.createElement('p');
            titleItem.className = styles.carouselItem;
            titleItem.textContent = title;
            textCarousel.appendChild(titleItem);
        });
    }

    textCarouselWrapper.appendChild(textCarousel);

    container.appendChild(preface);
    container.appendChild(textCarouselWrapper);

    setTimeout(() => {
        const firstItem = document.querySelector(`.${styles.carouselItem}`);
        if (firstItem) {
            const itemHeight = firstItem.offsetHeight;
            // Центрируем на первом наборе заголовков
            gsap.set(textCarousel, {
                y: -itemHeight * titles.length
            });

            // Сохраняем высоту элемента в данных карусели
            textCarousel.dataset.itemHeight = itemHeight;
            textCarousel.dataset.titlesCount = titles.length;
        }
    }, 0);

    return container;
};
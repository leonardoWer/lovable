export const SLIDER_CONFIG = {
    IMAGES_COUNT: 15,
    IMAGES_PATH: '/img/dasha/',

    SCROLL_SENSITIVITY: 0.3,

    // Настройки анимации
    ANIMATION: {
        DURATION: 0.8,
        EASE: "power2.inOut",
        STAGGER: 0.03
    },

    PREFACE_TEXT: "С тобой каждый день как в сказке, но я вспоминаю",

    // Тексты для картинок
    IMAGE_TITLES: [
        "Наше 14 февраля",
        "Мы красивые",
        "Как мы катались на коньках",
        "Как мы кушаем",
        "Как мы лепим",
        "Тебя красивую",
        "Твою улыбку",
        "Как мы едем на лодке",
        "Шашлындос с друзьями",
        "Наши обнимашки",
        "Чмоки обнимашки",
        "Как дарю тебе цветочки",
        "Место где мы встретились",
        "Мы джентльмены",
        "Как мы поём",
    ]
};

export const getHeartPosition = (t, totalPoints) => {
    // Параметр t от 0 до 1
    // Используем уравнение сердца в полярных координатах
    // x = 16sin^3(t)
    // y = 13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t)

    const angle = t * Math.PI * 2;

    // Вычисляем координаты по формуле сердца
    const x = 16 * Math.pow(Math.sin(angle), 3);
    const y = 13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle);

    // Нормализуем и центрируем (x от 0 до 100, y от 0 до 100)
    // Инвертируем y, так как в браузере y увеличивается вниз
    const normalizedX = (x / 20) * 45 + 50; // Центрируем по горизонтали
    const normalizedY = (-y / 20) * 45 + 50; // Инвертируем и центрируем по вертикали

    // Добавляем небольшой случайный разброс для естественности
    const spread = 1.2;
    const randomOffsetX = (Math.random() - 0.5) * spread;
    const randomOffsetY = (Math.random() - 0.5) * spread;

    return {
        x: Math.min(95, Math.max(5, normalizedX + randomOffsetX)),
        y: Math.min(95, Math.max(5, normalizedY + randomOffsetY)),
    };
};

// Генерируем позиции для любого количества карточек
export const generateHeartPositions = (count) => {
    const positions = [];

    for (let i = 0; i < count; i++) {
        // Распределяем карточки последовательно по контуру сердца
        // но начинаем с левой нижней части
        const t = i / count;

        const adjustedT = (t + 0.75) % 1;

        const { x, y, scale } = getHeartPosition(adjustedT, count);

        const zIndex = Math.floor(20 - y / 10);

        positions.push({
            x: Math.round(x * 10) / 11,
            y: Math.round(y * 10) / 8,
            scale: scale,
            zIndex: zIndex
        });
    }

    return positions;
};
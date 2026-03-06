import {defineConfig} from 'vite';
import {resolve} from 'path';

export default defineConfig({
    root: './', // Корневая директория проекта
    resolve: {
        alias: {
            's': resolve(__dirname, './src'),
            'p': resolve(__dirname, './public'),
        },
    },
});
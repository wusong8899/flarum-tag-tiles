import type { RootConfig, Environment } from './types';
import {
  EXTENSION_CONFIG,
  TIMING,
  DOM_ELEMENTS,
  SPLIDE_CONFIG,
  ADVANCED_SPLIDE_CONFIG
} from './constants';

export const defaultConfig: RootConfig = {
  env: (process.env.NODE_ENV as Environment) || 'production',
  app: {
    extensionId: EXTENSION_CONFIG.ID,
    translationPrefix: EXTENSION_CONFIG.TRANSLATION_PREFIX,
  },
  tagTiles: {
    autoplayInterval: SPLIDE_CONFIG.AUTOPLAY_INTERVAL,
    checkInterval: TIMING.CHECK_INTERVAL,
    dataCheckInterval: TIMING.DATA_CHECK_INTERVAL,
    mobile: {
      gap: SPLIDE_CONFIG.MOBILE.GAP,
      perPage: SPLIDE_CONFIG.MOBILE.PER_PAGE,
    },
    desktop: {
      gap: SPLIDE_CONFIG.DESKTOP.GAP,
      perPage: SPLIDE_CONFIG.DESKTOP.PER_PAGE,
    },
    advanced: {
      minSlidesForLoop: ADVANCED_SPLIDE_CONFIG.MIN_SLIDES_FOR_LOOP,
      enableAutoplay: true,
      autoplayInterval: ADVANCED_SPLIDE_CONFIG.AUTOPLAY_INTERVAL,
      enableLoopMode: true,
      transitionSpeed: ADVANCED_SPLIDE_CONFIG.TRANSITION_SPEED,
      gap: ADVANCED_SPLIDE_CONFIG.GAP,
      pauseOnMouseEnter: true,
      enableGrabCursor: true,
      enableFreeMode: false, // Splide doesn't have free mode like Swiper.js
    },
  },
  ui: {
    tagContainerId: DOM_ELEMENTS.SPLIDE_TAG_CONTAINER_ID,
    tagWrapperId: DOM_ELEMENTS.SPLIDE_TAG_WRAPPER_ID,
  },
};

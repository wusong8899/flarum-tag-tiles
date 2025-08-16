import type { RootConfig, Environment } from './types';
import {
  EXTENSION_CONFIG,
  TIMING,
  DOM_ELEMENTS,
  SWIPER_CONFIG
} from './constants';

export const defaultConfig: RootConfig = {
  env: (process.env.NODE_ENV as Environment) || 'production',
  app: {
    extensionId: EXTENSION_CONFIG.ID,
    translationPrefix: EXTENSION_CONFIG.TRANSLATION_PREFIX,
  },
  tagTiles: {
    autoplayDelay: SWIPER_CONFIG.AUTOPLAY_DELAY,
    checkInterval: TIMING.CHECK_INTERVAL,
    dataCheckInterval: TIMING.DATA_CHECK_INTERVAL,
    mobile: {
      spaceBetween: SWIPER_CONFIG.MOBILE.SPACE_BETWEEN,
      slidesPerView: SWIPER_CONFIG.MOBILE.SLIDES_PER_VIEW,
    },
    desktop: {
      spaceBetween: SWIPER_CONFIG.DESKTOP.SPACE_BETWEEN,
      slidesPerView: SWIPER_CONFIG.DESKTOP.SLIDES_PER_VIEW,
    },
  },
  ui: {
    tagContainerId: DOM_ELEMENTS.SWIPER_TAG_CONTAINER_ID,
    tagWrapperId: DOM_ELEMENTS.SWIPER_TAG_WRAPPER_ID,
  },
};

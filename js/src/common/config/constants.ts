/**
 * Application constants for TagTiles extension
 */

// Mobile detection constants
export const MOBILE_DETECTION = {
  USER_AGENT_SUBSTR_START: 0,
  USER_AGENT_SUBSTR_LENGTH: 4,
} as const;

// Swiper configuration constants
export const SWIPER_CONFIG = {
  MOBILE: {
    SPACE_BETWEEN: 80,
    SLIDES_PER_VIEW: 4,
  },
  DESKTOP: {
    SPACE_BETWEEN: 10,
    SLIDES_PER_VIEW: 7,
  },
  AUTOPLAY_DELAY: 3000,
} as const;

// Advanced swiper configuration constants
export const ADVANCED_SWIPER_CONFIG = {
  MIN_SLIDES_FOR_LOOP: 3,
  MIN_SLIDES_FOR_AUTOPLAY: 2,
  AUTOPLAY_DELAY: 3000,
  TRANSITION_SPEED: 800,
  SPACE_BETWEEN: 10,
  SWIPER_INIT_DELAY: 100,
} as const;

// Error handling constants
export const ERROR_HANDLING = {
  MAX_ERROR_LOG_ENTRIES: 50,
  DOM_READY_TIMEOUT: 5000,
} as const;

// UI styling constants
export const UI_STYLES = {
  SOCIAL_ICON_WIDTH: 32,
  SOCIAL_ICON_MARGIN_LEFT: 20,
  TAG_TEXT_FONT_SIZE: 14,
  TAG_CONTAINER_PADDING_TOP: 10,
  TAG_CONTAINER_MARGIN_TOP: 5,
} as const;

// Array and index constants
export const ARRAY_CONSTANTS = {
  EMPTY_LENGTH: 0,
  FIRST_INDEX: 0,
  NOT_FOUND_INDEX: -1,
  NEXT_ITEM_OFFSET: 1,
  LAST_ITEM_OFFSET: -1,
} as const;

// Timing constants
export const TIMING = {
  CHECK_INTERVAL: 10,
  DATA_CHECK_INTERVAL: 100,
} as const;

// DOM element constants
export const DOM_ELEMENTS = {
  SWIPER_TAG_CONTAINER_ID: 'swiperTagContainer',
  SWIPER_TAG_WRAPPER_ID: 'swiperTagWrapper',
} as const;

// CSS class constants
export const CSS_CLASSES = {
  SWIPER: 'swiper',
  SWIPER_WRAPPER: 'swiper-wrapper',
  SWIPER_SLIDE: 'swiper-slide',
  SWIPER_SLIDE_TAG: 'swiper-slide-tag',
  SWIPER_SLIDE_TAG_INNER: 'swiper-slide-tag-inner',
  SWIPER_SLIDE_TAG_INNER_MOBILE: 'swiper-slide-tag-inner-mobile',
  TAG_SWIPER: 'tagSwiper',
  TAG_TILES: 'TagTiles',
  TAG_TILE: 'TagTile',
  TAG_TILE_NAME: 'TagTile-name',
  TAG_TILE_DESCRIPTION: 'TagTile-description',
  TAG_TEXT_OUTER_CONTAINER: 'TagTextOuterContainer',
  TAG_TEXT_CONTAINER: 'TagTextContainer',
  TAG_TEXT_ICON: 'TagTextIcon',
} as const;

// CSS selector constants
export const CSS_SELECTORS = {
  TAGS_PAGE_CONTENT: '#content .container .TagsPage-content',
  APP_CONTENT: '.App-content',
} as const;

// Extension configuration constants
export const EXTENSION_CONFIG = {
  ID: 'wusong8899-tag-tiles',
  TRANSLATION_PREFIX: 'wusong8899-tag-tiles',
} as const;

// Social media platform constants
export const SOCIAL_PLATFORMS = [
  'Kick',
  'Facebook',
  'Twitter',
  'YouTube',
  'Instagram'
] as const;

export type SocialPlatform = typeof SOCIAL_PLATFORMS[number];

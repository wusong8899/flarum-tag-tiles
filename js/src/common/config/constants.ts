/**
 * Application constants for TagTiles extension
 */

// Mobile detection constants
export const MOBILE_DETECTION = {
  USER_AGENT_SUBSTR_START: 0,
  USER_AGENT_SUBSTR_LENGTH: 4,
} as const;

// Splide configuration constants
export const SPLIDE_CONFIG = {
  MOBILE: {
    GAP: '80px',
    PER_PAGE: 4,
  },
  DESKTOP: {
    GAP: '10px',
    PER_PAGE: 7,
  },
  AUTOPLAY_INTERVAL: 3000,
} as const;

// Advanced splide configuration constants
export const ADVANCED_SPLIDE_CONFIG = {
  MIN_SLIDES_FOR_LOOP: 2, // Splide requires minimum 2 slides for loop mode
  MIN_SLIDES_FOR_AUTOPLAY: 2,
  AUTOPLAY_INTERVAL: 3000,
  TRANSITION_SPEED: 800,
  GAP: '10px',
  SPLIDE_INIT_DELAY: 100,
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
  SPLIDE_TAG_CONTAINER_ID: 'splideTagContainer',
  SPLIDE_TAG_WRAPPER_ID: 'splideTagWrapper',
  SPLIDE_AD_CONTAINER_ID: 'splideAdContainer',
  SPLIDE_AD_WRAPPER_ID: 'splideAdWrapper',
} as const;

// CSS class constants
export const CSS_CLASSES = {
  SPLIDE: 'splide',
  SPLIDE_TRACK: 'splide__track',
  SPLIDE_LIST: 'splide__list',
  SPLIDE_SLIDE: 'splide__slide',
  SPLIDE_SLIDE_TAG: 'splide__slide-tag',
  SPLIDE_SLIDE_TAG_INNER: 'splide__slide-tag-inner',
  SPLIDE_SLIDE_TAG_INNER_MOBILE: 'splide__slide-tag-inner-mobile',
  SPLIDE_SLIDE_AD: 'splide__slide-ad',
  SPLIDE_SLIDE_AD_INNER: 'splide__slide-ad-inner',
  TAG_SPLIDE: 'tagSplide',
  AD_SPLIDE: 'adSplide',
  TAG_TILES: 'TagTiles',
  TAG_TILE: 'TagTile',
  TAG_TILE_NAME: 'TagTile-name',
  TAG_TILE_DESCRIPTION: 'TagTile-description',
  TAG_TEXT_OUTER_CONTAINER: 'TagTextOuterContainer',
  TAG_TEXT_CONTAINER: 'TagTextContainer',
  TAG_TEXT_ICON: 'TagTextIcon',
  AD_CONTAINER: 'splideAdContainer',
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

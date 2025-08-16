export type Environment = 'development' | 'staging' | 'production' | 'test';

export interface AppConfig {
  extensionId: string;
  translationPrefix: string;
}

export interface SwiperConfig {
  spaceBetween: number;
  slidesPerView: number;
}

export interface AdvancedSwiperConfig {
  minSlidesForLoop: number;
  enableAutoplay: boolean;
  autoplayDelay: number;
  enableLoopMode: boolean;
  transitionSpeed: number;
  spaceBetween: number;
  pauseOnMouseEnter: boolean;
  enableGrabCursor: boolean;
  enableFreeMode: boolean;
}

export interface TagTilesConfig {
  autoplayDelay: number;
  checkInterval: number;
  dataCheckInterval: number;
  mobile: SwiperConfig;
  desktop: SwiperConfig;
  advanced: AdvancedSwiperConfig;
}

export interface UIConfig {
  tagContainerId: string;
  tagWrapperId: string;
}

export interface RootConfig {
  env: Environment;
  app: AppConfig;
  tagTiles: TagTilesConfig;
  ui: UIConfig;
}

// Additional types for better type safety
export interface TagData {
  url: string;
  background: string;
  name: string;
  nameColor: string;
  description: string;
  descColor: string;
}

export interface ErrorLogEntry {
  timestamp: Date;
  error: Error;
  context: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface MobileConfig {
  spaceBetween: number;
  slidesPerView: number;
}

export type EventType = 'touchend' | 'click';

export type NotificationType = 'error' | 'warning' | 'info';

// Flarum-specific types
export interface FlarumVnode {
  dom?: HTMLElement;
  [key: string]: unknown;
}

export type FlarumComponentAttrs = Record<string, unknown>;

export interface FlarumApp {
  forum: {
    attribute: (key: string) => unknown;
  };
  store: {
    all: (type: string) => unknown[];
  };
  session: {
    user?: unknown;
  };
  translator: {
    trans: (key: string, params?: Record<string, unknown>) => string;
  };
}

// DOM utility types
export interface DOMElementOptions {
  className?: string;
  id?: string;
  [key: string]: unknown;
}

export interface StylesObject {
  [property: string]: string | number;
}

// Swiper-related types
export interface SwiperInstance {
  destroy: (deleteInstance?: boolean, cleanStyles?: boolean) => void;
  [key: string]: unknown;
}

// Admin types
export interface ExtensionData {
  registerSetting: (config: SettingConfig | (() => unknown)) => void;
}

export interface SettingConfig {
  setting: string;
  type: string;
  label: string;
  help?: string;
}

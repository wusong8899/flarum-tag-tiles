export type Environment = 'development' | 'staging' | 'production' | 'test';

export interface AppConfig {
  extensionId: string;
  translationPrefix: string;
}

export interface SplideConfig {
  gap: string;
  perPage: number;
}

export interface AdvancedSplideConfig {
  minSlidesForLoop: number;
  enableAutoplay: boolean;
  autoplayInterval: number;
  enableLoopMode: boolean;
  transitionSpeed: number;
  gap: string;
  pauseOnMouseEnter: boolean;
  enableGrabCursor: boolean;
  enableFreeMode: boolean;
}

export interface TagTilesConfig {
  autoplayInterval: number;
  checkInterval: number;
  dataCheckInterval: number;
  mobile: SplideConfig;
  desktop: SplideConfig;
  advanced: AdvancedSplideConfig;
}

export interface UIConfig {
  tagContainerId: string;
  tagWrapperId: string;
  adContainerId: string;
  adWrapperId: string;
}

export interface AdConfig {
  enableAds: boolean;
  autoplayInterval: number;
  checkInterval: number;
  advanced: AdvancedSplideConfig;
}

export interface RootConfig {
  env: Environment;
  app: AppConfig;
  tagTiles: TagTilesConfig;
  ads: AdConfig;
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

export interface AdData {
  id: number;
  link: string;
  image: string;
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
  gap: string;
  perPage: number;
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

// Splide-related types
export interface SplideInstance {
  destroy: () => void;
  mount: () => void;
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

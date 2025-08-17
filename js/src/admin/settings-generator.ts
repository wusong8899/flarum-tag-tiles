import app from 'flarum/admin/app';
import type { ExtensionData } from '../common/config/types';

/**
 * Settings generator utility for TagTiles admin interface
 */
export class SettingsGenerator {
    private extensionId: string;
    private extensionData: ExtensionData;

    constructor(extensionId: string) {
        this.extensionId = extensionId;
        this.extensionData = app.extensionData.for(extensionId) as ExtensionData;
    }

    /**
     * Register social media settings
     */
    registerSocialMediaSettings(): this {
        const socialPlatforms = ['Kick', 'Facebook', 'Twitter', 'YouTube', 'Instagram'];

        for (const platform of socialPlatforms) {
            // URL setting
            this.extensionData.registerSetting({
                setting: `${this.extensionId}.Social${platform}Url`,
                type: 'url',
                label: String(app.translator.trans(`wusong8899-tag-tiles.admin.Social${platform}Url`)),
                help: String(app.translator.trans(`wusong8899-tag-tiles.admin.Social${platform}UrlHelp`)),
            });

            // Icon setting
            this.extensionData.registerSetting({
                setting: `${this.extensionId}.Social${platform}Icon`,
                type: 'text',
                label: String(app.translator.trans(`wusong8899-tag-tiles.admin.Social${platform}Icon`)),
                help: String(app.translator.trans(`wusong8899-tag-tiles.admin.Social${platform}IconHelp`)),
            });
        }

        return this;
    }

    /**
     * Register advanced splide configuration settings
     */
    registerAdvancedSplideSettings(): this {
        // Minimum slides for loop mode
        this.extensionData.registerSetting({
            setting: `${this.extensionId}.AdvancedSplideMinSlidesForLoop`,
            type: 'number',
            label: String(app.translator.trans('wusong8899-tag-tiles.admin.AdvancedSplideMinSlidesForLoop')),
            help: String(app.translator.trans('wusong8899-tag-tiles.admin.AdvancedSplideMinSlidesForLoopHelp')),
        });

        // Enable autoplay
        this.extensionData.registerSetting({
            setting: `${this.extensionId}.AdvancedSplideEnableAutoplay`,
            type: 'boolean',
            label: String(app.translator.trans('wusong8899-tag-tiles.admin.AdvancedSplideEnableAutoplay')),
            help: String(app.translator.trans('wusong8899-tag-tiles.admin.AdvancedSplideEnableAutoplayHelp')),
        });

        // Autoplay interval
        this.extensionData.registerSetting({
            setting: `${this.extensionId}.AdvancedSplideAutoplayInterval`,
            type: 'number',
            label: String(app.translator.trans('wusong8899-tag-tiles.admin.AdvancedSplideAutoplayInterval')),
            help: String(app.translator.trans('wusong8899-tag-tiles.admin.AdvancedSplideAutoplayIntervalHelp')),
        });

        // Enable loop mode
        this.extensionData.registerSetting({
            setting: `${this.extensionId}.AdvancedSplideEnableLoopMode`,
            type: 'boolean',
            label: String(app.translator.trans('wusong8899-tag-tiles.admin.AdvancedSplideEnableLoopMode')),
            help: String(app.translator.trans('wusong8899-tag-tiles.admin.AdvancedSplideEnableLoopModeHelp')),
        });

        // Transition speed
        this.extensionData.registerSetting({
            setting: `${this.extensionId}.AdvancedSplideTransitionSpeed`,
            type: 'number',
            label: String(app.translator.trans('wusong8899-tag-tiles.admin.AdvancedSplideTransitionSpeed')),
            help: String(app.translator.trans('wusong8899-tag-tiles.admin.AdvancedSplideTransitionSpeedHelp')),
        });

        // Gap between slides
        this.extensionData.registerSetting({
            setting: `${this.extensionId}.AdvancedSplideGap`,
            type: 'string',
            label: String(app.translator.trans('wusong8899-tag-tiles.admin.AdvancedSplideGap')),
            help: String(app.translator.trans('wusong8899-tag-tiles.admin.AdvancedSplideGapHelp')),
        });

        // Pause on mouse enter
        this.extensionData.registerSetting({
            setting: `${this.extensionId}.AdvancedSplidePauseOnMouseEnter`,
            type: 'boolean',
            label: String(app.translator.trans('wusong8899-tag-tiles.admin.AdvancedSplidePauseOnMouseEnter')),
            help: String(app.translator.trans('wusong8899-tag-tiles.admin.AdvancedSplidePauseOnMouseEnterHelp')),
        });

        // Enable grab cursor
        this.extensionData.registerSetting({
            setting: `${this.extensionId}.AdvancedSplideEnableGrabCursor`,
            type: 'boolean',
            label: String(app.translator.trans('wusong8899-tag-tiles.admin.AdvancedSplideEnableGrabCursor')),
            help: String(app.translator.trans('wusong8899-tag-tiles.admin.AdvancedSplideEnableGrabCursorHelp')),
        });

        // Enable free mode
        this.extensionData.registerSetting({
            setting: `${this.extensionId}.AdvancedSplideEnableFreeMode`,
            type: 'boolean',
            label: String(app.translator.trans('wusong8899-tag-tiles.admin.AdvancedSplideEnableFreeMode')),
            help: String(app.translator.trans('wusong8899-tag-tiles.admin.AdvancedSplideEnableFreeModeHelp')),
        });

        return this;
    }

    /**
     * Register advertisement settings
     */
    registerAdvertisementSettings(): this {
        // Enable advertisements setting
        this.extensionData.registerSetting({
            setting: `${this.extensionId}.EnableAds`,
            type: 'boolean',
            label: String(app.translator.trans('wusong8899-tag-tiles.admin.EnableAds')),
            help: String(app.translator.trans('wusong8899-tag-tiles.admin.EnableAdsHelp')),
        });

        // Advertisement autoplay interval
        this.extensionData.registerSetting({
            setting: `${this.extensionId}.AdAutoplayInterval`,
            type: 'number',
            label: String(app.translator.trans('wusong8899-tag-tiles.admin.AdAutoplayInterval')),
            help: String(app.translator.trans('wusong8899-tag-tiles.admin.AdAutoplayIntervalHelp')),
        });

        return this;
    }

    /**
     * Register all settings for the extension
     */
    registerAllSettings(): this {
        return this
            .registerSocialMediaSettings()
            .registerAdvancedSplideSettings()
            .registerAdvertisementSettings();
    }
}

/**
 * Configuration constants
 */
export const EXTENSION_CONFIG = {
    EXTENSION_ID: 'wusong8899-tag-tiles',
};

/**
 * Initialize admin settings
 * @param extensionId - The extension identifier
 */
export const initializeAdminSettings = (
    extensionId = EXTENSION_CONFIG.EXTENSION_ID
): void => {
    const generator = new SettingsGenerator(extensionId);
    generator.registerAllSettings();
};

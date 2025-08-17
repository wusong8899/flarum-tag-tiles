<?php

declare(strict_types=1);

namespace wusong8899\FlarumTagTiles;

use Flarum\Extend;

class SettingsHelper
{
    /**
     * Generate settings configuration for social media platforms
     *
     * @return array<Extend\Settings> Array of Extend\Settings configurations
     */
    public static function generateSocialMediaSettings(): array
    {
        $settings = [];

        // Add social media settings
        $socialPlatforms = ['Kick', 'Facebook', 'Twitter', 'YouTube', 'Instagram'];
        foreach ($socialPlatforms as $platform) {
            // URL setting
            $settings[] = (new Extend\Settings())->serializeToForum(
                "wusong8899-tag-tiles.Social{$platform}Url",
                "wusong8899-tag-tiles.Social{$platform}Url"
            );

            // Icon setting
            $settings[] = (new Extend\Settings())->serializeToForum(
                "wusong8899-tag-tiles.Social{$platform}Icon",
                "wusong8899-tag-tiles.Social{$platform}Icon"
            );
        }

        return $settings;
    }

    /**
     * Get frontend configuration
     *
     * @return array<Extend\Frontend|Extend\Locales> Array of frontend configurations
     */
    public static function getFrontendConfig(): array
    {
        return [
            (new Extend\Frontend('forum'))
                ->js(__DIR__ . '/../js/dist/forum.js')
                ->css(__DIR__ . '/../less/forum.less'),
            (new Extend\Frontend('admin'))
                ->js(__DIR__ . '/../js/dist/admin.js')
                ->css(__DIR__ . '/../less/admin.less'),
            new Extend\Locales(__DIR__ . '/../locale'),
        ];
    }

    /**
     * Generate advertisement settings configuration
     *
     * @param int $maxAds Maximum number of ads to configure (0 means no limit, will check dynamically)
     * @return array<Extend\Settings> Array of Extend\Settings configurations
     */
    public static function generateAdvertisementSettings(int $maxAds = 0): array
    {
        $settings = [];

        // Add advertisement toggle setting
        $settings[] = (new Extend\Settings())->serializeToForum(
            'wusong8899-tag-tiles.EnableAds',
            'wusong8899-tag-tiles.EnableAds'
        );

        // Add advertisement autoplay interval setting
        $settings[] = (new Extend\Settings())->serializeToForum(
            'wusong8899-tag-tiles.AdAutoplayInterval',
            'wusong8899-tag-tiles.AdAutoplayInterval'
        );

        // Generate dynamic advertisement settings
        // If maxAds is 0, generate settings for reasonable number (up to 50)
        $limit = $maxAds > 0 ? $maxAds : 50;

        for ($i = 1; $i <= $limit; $i++) {
            // Image setting
            $settings[] = (new Extend\Settings())->serializeToForum(
                "wusong8899-tag-tiles.AdImage{$i}",
                "wusong8899-tag-tiles.AdImage{$i}"
            );

            // Link setting
            $settings[] = (new Extend\Settings())->serializeToForum(
                "wusong8899-tag-tiles.AdLink{$i}",
                "wusong8899-tag-tiles.AdLink{$i}"
            );
        }

        return $settings;
    }

    /**
     * Generate advanced splide configuration settings
     *
     * @return array<Extend\Settings> Array of Extend\Settings configurations
     */
    public static function generateAdvancedSplideSettings(): array
    {
        $settings = [];

        // Advanced splide configuration settings
        $advancedSettings = [
            'AdvancedSplideMinSlidesForLoop',
            'AdvancedSplideEnableAutoplay',
            'AdvancedSplideAutoplayInterval',
            'AdvancedSplideEnableLoopMode',
            'AdvancedSplideTransitionSpeed',
            'AdvancedSplideGap',
            'AdvancedSplidePauseOnMouseEnter',
            'AdvancedSplideEnableGrabCursor',
            'AdvancedSplideEnableFreeMode'
        ];

        foreach ($advancedSettings as $setting) {
            $settings[] = (new Extend\Settings())->serializeToForum(
                "wusong8899-tag-tiles.{$setting}",
                "wusong8899-tag-tiles.{$setting}"
            );
        }

        return $settings;
    }

    /**
     * Get complete extension configuration
     *
     * @param int $maxAds Maximum number of ads to configure
     * @return array<Extend\Frontend|Extend\Locales|Extend\Settings> Complete configuration array
     */
    public static function getExtensionConfig(int $maxAds = 0): array
    {
        return array_merge(
            self::getFrontendConfig(),
            self::generateSocialMediaSettings(),
            self::generateAdvertisementSettings($maxAds),
            self::generateAdvancedSplideSettings()
        );
    }
}

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
     * Get complete extension configuration
     *
     * @return array<Extend\Frontend|Extend\Locales|Extend\Settings> Complete configuration array
     */
    public static function getExtensionConfig(): array
    {
        return array_merge(
            self::getFrontendConfig(),
            self::generateSocialMediaSettings()
        );
    }
}

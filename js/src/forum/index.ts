import { extend } from 'flarum/common/extend';
import app from 'flarum/forum/app';
import TagsPage from 'flarum/tags/components/TagsPage';

import { TagTilesManager } from './components/tag-tiles-manager';
import { ErrorHandler } from './utils/error-handler';
import { ConfigManager } from './utils/config-manager';
import { defaultConfig } from '../common/config';

/**
 * Main extension initializer for TagTiles
 */
app.initializers.add(defaultConfig.app.extensionId, () => {
    const errorHandler = ErrorHandler.getInstance();
    const configManager = ConfigManager.getInstance();

    // Initialize error handling
    if (!errorHandler.initialize()) {
        return;
    }

    const tagTilesManager = new TagTilesManager();

    // Extend TagsPage to setup UI components when the page loads
    extend(TagsPage.prototype, 'oncreate', function tagsPageOnCreateExtension(_vnode: unknown) {
        errorHandler.handleSync(() => {
            if (configManager.isTagsPage()) {
                // Force UI components setup
                const DOM_READY_DELAY = 100;
                setTimeout(() => {
                    tagTilesManager.changeCategoryLayout();
                }, DOM_READY_DELAY);
            }
        }, 'TagsPage oncreate extension');
    });

    extend(TagsPage.prototype, 'onupdate', function tagsPageOnUpdateExtension(_vnode: unknown) {
        errorHandler.handleSync(() => {
            // Check if splide container doesn't exist and create it
            if (!document.getElementById(defaultConfig.ui.tagContainerId)) {
                const DOM_READY_DELAY = 100;
                setTimeout(() => {
                    tagTilesManager.changeCategoryLayout();
                }, DOM_READY_DELAY);
            }
        }, 'TagsPage onupdate extension');
    });
});

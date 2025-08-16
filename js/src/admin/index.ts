import app from 'flarum/admin/app';
import { initializeAdminSettings } from './settings-generator';

app.initializers.add('wusong8899/flarum-tag-tiles', (): void => {
    initializeAdminSettings();
});

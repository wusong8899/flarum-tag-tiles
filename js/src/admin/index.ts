import app from 'flarum/admin/app';
import { initializeAdminSettings } from './settings-generator';

app.initializers.add('wusong8899-tag-tiles', (): void => {
    initializeAdminSettings();
});

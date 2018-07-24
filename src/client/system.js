import clientFactory from './client-facotry';
import store from 'system/store';
import app from 'system'

clientFactory('system', store)(app)

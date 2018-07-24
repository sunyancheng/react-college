import clientFactory from './client-facotry';
import store from 'admin/store';
import app from 'admin'
clientFactory('admin', store)(app)

import clientFactory from './client-facotry';
import store from 'vnc/store';
import app from 'vnc'

clientFactory('vnc', store)(app)

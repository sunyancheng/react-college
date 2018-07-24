import clientFactory from './client-facotry';
import store from 'order/store';
import app from 'order'

clientFactory('order', store)(app)

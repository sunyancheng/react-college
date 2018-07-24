import clientFactory from './client-facotry';
import store from 'user/store';
import app from 'user'

clientFactory('user', store)(app)

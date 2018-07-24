import clientFactory from './client-facotry';
import store from 'experiment/store';
import app from 'experiment'

clientFactory('experiment', store)(app)

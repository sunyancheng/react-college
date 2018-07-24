import clientFactory from './client-facotry';
import store from 'exam/store';
import app from 'exam'

clientFactory('exam', store)(app)

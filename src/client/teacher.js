import clientFactory from './client-facotry';
import store from 'teacher/store';
import app from 'teacher'

clientFactory('teacher', store)(app)

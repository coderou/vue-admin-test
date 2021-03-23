// export * as app from '/app'
// export * as settings from '/user'
// export * as user from '/user'
// export * as category from '/category'
import app from './app'
import settings from './user'
import user from './user'
import category from './category'

/* 
  import * as app from './app';
  export app;
  ==> 
  export * as app from './app'
*/

export default {
  app,
  settings,
  user,
  category
}

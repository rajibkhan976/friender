// db.js
import Dexie from 'dexie';
/**
 * This Index DB data base instance
 */
export const clientDB = new Dexie('frinderDB');
clientDB.version(1).stores({
  friendsLists: 'fbId,friendsData', // Primary key and indexed props
});
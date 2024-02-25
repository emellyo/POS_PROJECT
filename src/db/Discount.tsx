import {SQLiteDatabase, enablePromise, openDatabase} from 'react-native-sqlite-storage';
import { Discount } from '../models';

export const getDBConnection = async () => {
   return openDatabase(
    {name: 'DBPOS.db', location: 'default'}
    );
};

enablePromise(true);

export const Discount_CreateTbl = async (db: SQLiteDatabase, tableName: string) => {
  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS ${tableName}(
        discount_ID TEXT PRIMARY KEY NOT NULL,
        discount_Name TEXT NULL,
        discount_Type INT NOT NULL,
        discount_Value REAL NOT NULL,
        restricted_Access INT NOT NULL,
        created_User TEXT NULL,
        created_Date TEXT NULL,
        modified_User TEXT NULL,
        modified_Date TEXT NULL,
        flag INT NOT NULL
    );`;

  await db.executeSql(query);
};

export const Discount_getdata = async (db: SQLiteDatabase, tableName: string): Promise<Discount[]> => {
  try {
    const Lists: Discount[] = [];
    const results = await db.executeSql(`SELECT * FROM ${tableName}`);
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        Lists.push(result.rows.item(index))
      }
    });
    return Lists;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get Add Item !!!');
  }
};

export const Discount_getdataChoose = async (db: SQLiteDatabase, tableName: string): Promise<Discount[]> => {
  try {
    const Lists: Discount[] = [];
    const results = await db.executeSql(`SELECT * FROM ${tableName} WHERE FLAG = 1`);
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        Lists.push(result.rows.item(index))
      }
    });
    return Lists;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get Add Item !!!');
  }
};


export const Discount_savedata = async (db: SQLiteDatabase, tableName: string, lists: Discount[]) => {
  const insertQuery =
    `INSERT OR REPLACE INTO ${tableName}`+
    `(discount_ID, discount_Name, discount_Type, discount_Value, restricted_Access, created_User, created_Date, modified_User, modified_Date)`+
    ` values ` +
    lists.map(
        i => `('${i.discount_ID}', '${i.discount_Name}', ${i.discount_Type}, ${i.discount_Value}, ${i.restricted_Access}, '${i.created_User}', '${i.created_Date}', '${i.modified_User}',`+
        `'${i.modified_Date}',${0})`
    ).join(',');
  return db.executeSql(insertQuery);
};

export const queryselecDiscount = async (db: SQLiteDatabase, query: string) => {
  console.log('querydyn:', query);
  const Lists: Discount[] = [];
    const results = await db.executeSql(query);
    
    results.forEach(results => {
      console.log('length: ', results.rows.length);
      for(let index = 0; index < results.rows.length; index++){
        Lists.push(results.rows.item(index))
      }
     console.log('resultquery: ', results);
    });
    return Lists;
}

export const querydynamic = async (db: SQLiteDatabase, query: string) => {
  console.log('querydyn:', query);
  await db.executeSql(query);
};

export const deletedataAllTbl = async (db: SQLiteDatabase, tableName: string, id: number) => {
  const deleteQuery = `DELETE from ${tableName}`;
  await db.executeSql(deleteQuery);
};

export const dropTbl = async (db: SQLiteDatabase, tableName: string) => {
  const query = `drop table IF EXISTS ${tableName}`;

  await db.executeSql(query);
};
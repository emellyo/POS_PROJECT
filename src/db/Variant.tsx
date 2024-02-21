import {SQLiteDatabase, enablePromise, openDatabase} from 'react-native-sqlite-storage';
import { Variant } from '../models';

export const getDBConnection = async () => {
   return openDatabase(
    {name: 'DBPOS.db', location: 'default'}
    );
};

enablePromise(true);

export const Variant_CreateTbl = async (db: SQLiteDatabase, tableName: string) => {
  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS ${tableName}(
        DOCID TEXT NOT NULL,
        item_Number TEXT NOT NULL,
        item_Name TEXT NULL,
        lineItem_Option INTEGER PRIMARY KEY NOT NULL,
        cB_Available INTEGER NOT NULL,
        option_ID TEXT NULL,
        option_Name TEXT NULL,
        lineItem_Variant INTEGER NOT NULL,
        variant_Name TEXT NULL,
        item_Price REAL NOT NULL,
        item_Cost REAL NOT NULL,
        inStock INTEGER NOT NULL,
        lowStock INTEGER NOT NULL,
        optimalStock INTEGER NOT NULL,
        item_SKU TEXT NULL,
        item_Barcode TEXT NULL,
        QTY_ORDER INT NOT NULL,
        flag INT NOT NULL
    );`;

  await db.executeSql(query);
};

export const Variant_getdata = async (db: SQLiteDatabase, tableName: string): Promise<Variant[]> => {
  try {
    const Lists: Variant[] = [];
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

export const Variant_getdataChoose = async (db: SQLiteDatabase, tableName: string): Promise<Variant[]> => {
  try {
    const Lists: Variant[] = [];
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


export const Variant_savedata = async (db: SQLiteDatabase, tableName: string, lists: Variant[]) => {
  const insertQuery =
    `INSERT OR REPLACE INTO ${tableName}`+
    `(DOCID, item_Number, item_Name, lineItem_Option, cB_Available, option_ID, option_Name, lineItem_Variant,`+
    `variant_Name, item_Price, item_Cost, inStock, lowStock, optimalStock, item_SKU, item_Barcode, QTY_ORDER, flag)`+
    ` values ` +
    lists.map(
        i => `('${''}', '${i.item_Number}', '${i.item_Name}', ${i.lineItem_Option}, ${i.cB_Available}, '${i.option_ID}', '${i.option_Name}', ${i.lineItem_Variant}, '${i.variant_Name}',`+
        `${i.item_Price}, ${i.item_Cost}, ${i.inStock}, ${i.lowStock}, ${i.optimalStock},  '${i.item_SKU}', '${i.item_Barcode}', ${0}, ${i.flag})`
    ).join(',');
  return db.executeSql(insertQuery);
};

export const queryselecVariant = async (db: SQLiteDatabase, query: string) => {
  console.log('querydyn:', query);
  const Lists: Variant[] = [];
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
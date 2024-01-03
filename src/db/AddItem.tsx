import {SQLiteDatabase, enablePromise, openDatabase} from 'react-native-sqlite-storage';
import { AddItem } from '../models';

export const getDBConnection = async () => {
   return openDatabase(
    {name: 'DBPOS.db', location: 'default'}
    );
};

enablePromise(true);

export const AddItem_CreateTbl = async (db: SQLiteDatabase, tableName: string) => {
  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS ${tableName}(
        DOCID TEXT NOT NULL,
        item_Number TEXT NOT NULL,
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
        item_Barcode TEXT NULL
    );`;

  await db.executeSql(query);
};

export const AddItem_getdata = async (db: SQLiteDatabase, tableName: string): Promise<AddItem[]> => {
  try {
    const Lists: AddItem[] = [];
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


export const InRcv_savedata = async (db: SQLiteDatabase, tableName: string, lists: AddItem[]) => {
  const insertQuery =
    `INSERT OR REPLACE INTO ${tableName}`+
    `(DOCID, item_Number, lineItem_Option, cB_Available, option_ID, option_Name, lineItem_Variant,`+
    `variant_Name, item_Price, item_Cost, inStock, lowStock, optimalStock, item_SKU, item_Barcode)`+
    ` values ` +
    lists.map(
        i => `('${''}', '${i.item_Number}', ${i.lineItem_Option}, ${i.cB_Available}, '${i.option_ID}', '${i.option_Name}', ${i.lineItem_Variant}, '${i.variant_Name}',`+
        `${i.item_Price}, ${i.item_Cost}, ${i.inStock}, ${i.lowStock}, ${i.optimalStock},  '${i.item_SKU}', '${i.item_Barcode}')`
    ).join(',');
  return db.executeSql(insertQuery);
};

export const deletedataAllTbl = async (db: SQLiteDatabase, tableName: string, id: number) => {
  const deleteQuery = `DELETE from ${tableName}`;
  await db.executeSql(deleteQuery);
};

export const querydynamic = async (db: SQLiteDatabase, query: string) => {
  console.log('querydyn:', query);
  await db.executeSql(query);
};

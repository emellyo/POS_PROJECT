import {SQLiteDatabase, enablePromise, openDatabase} from 'react-native-sqlite-storage';
import { AddTrxHdr, AddTrxDtl } from '../models';

export const getDBConnection = async () => {
   return openDatabase(
    {name: 'DBPOS.db', location: 'default'}
    );
};

enablePromise(true);

export const AddTrxHdr_CreateTbl = async (db: SQLiteDatabase, tableName: string) => {
  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS ${tableName}(
        UserID TEXT NOT NULL,
        DOCNUMBER TEXT PRIMARY KEY NOT NULL,
        DOCTYPE INT NOT NULL,
        DOCDATE TEXT NOT NULL,
        Store_ID TEXT NULL,
        Site_ID TEXT NULL,
        SalesType_ID TEXT NULL,
        CustName TEXT NULL,
        Total_Line_Item INT NOT NULL,
        ORIGTOTAL REAL NOT NULL,
        SUBTOTAL REAL NOT NULL,
        Tax_Amount REAL NOT NULL,
        Discount_ID TEXT NULL,
        Discount_Amount REAL NOT NULL,
        Amount_Tendered REAL NOT NULL,
        Change_Amount REAL NOT NULL,
        Batch_ID TEXT NOT NULL,
        POS_Device_ID TEXT NULL,
        POS_Version TEXT NULL,
        SyncStatus INT NOT NULL,
        Payment_ID TEXT NOT NULL,
        Payment_Type TEXT NOT NULL,
        Lnitmseq INT NOT NULL
    );`;

  await db.executeSql(query);
};

export const AddTrxDtl_CreateTbl = async (db: SQLiteDatabase, tableName: string) => {
  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS ${tableName}(
        DOCNUMBER TEXT PRIMARY KEY NOT NULL,
        DOCTYPE INT NOT NULL,
        DOCDATE TEXT NOT NULL,
        Lineitmseq INT NOT NULL,
        Item_Number TEXT NOT NULL,
        Item_Description TEXT NULL,
        Quantity INT NOT NULL,
        UofM TEXT NOT NULL,
        Item_Price REAL NOT NULL,
        Item_Cost REAL NOT NULL,
        Store_ID TEXT NULL,
        Site_ID TEXT NULL,
        SalesType_ID TEXT NOT NULL,
        Discount_ID TEXT NOT NULL,
        Discount_Amount REAL NOT NULL,
        Notes TEXT NULL,
        POS_Device_ID TEXT NULL,
        POS_Version TEXT NULL
    );`;

  await db.executeSql(query);
};

export const AddTrxHdr_getdata = async (db: SQLiteDatabase, tableName: string): Promise<AddTrxHdr[]> => {
  try {
    const Lists: AddTrxHdr[] = [];
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

export const AddTrxDtl_getdata = async (db: SQLiteDatabase, tableName: string): Promise<AddTrxDtl[]> => {
  try {
    const Lists: AddTrxDtl[] = [];
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


// export const Variant_savedata = async (db: SQLiteDatabase, tableName: string, lists: Variant[]) => {
//   const insertQuery =
//     `INSERT OR REPLACE INTO ${tableName}`+
//     `(DOCID, item_Number, item_Description,lineItem_Option, cB_Available, option_ID, option_Name, lineItem_Variant,`+
//     `variant_Name, item_Price, item_Cost, inStock, lowStock, optimalStock, item_SKU, item_Barcode, QTY_ORDER, flag)`+
//     ` values ` +
//     lists.map(
//         i => `('${''}', '${i.item_Number}', '${i.item_Description}',${i.lineItem_Option}, ${i.cB_Available}, '${i.option_ID}', '${i.option_Name}', ${i.lineItem_Variant}, '${i.variant_Name}',`+
//         `${i.item_Price}, ${i.item_Cost}, ${i.inStock}, ${i.lowStock}, ${i.optimalStock},  '${i.item_SKU}', '${i.item_Barcode}', ${0}, ${i.flag})`
//     ).join(',');
//   return db.executeSql(insertQuery);
// };

export const queryselecAddTrxHdr = async (db: SQLiteDatabase, query: string) => {
  console.log('querydyn:', query);
  const Lists: AddTrxHdr[] = [];
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

export const queryselecAddTrxDtl = async (db: SQLiteDatabase, query: string) => {
  console.log('querydyn:', query);
  const Lists: AddTrxDtl[] = [];
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

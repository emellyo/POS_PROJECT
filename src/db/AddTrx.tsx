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
        Payment_Type TEXT NOT NULL
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


export const AddTrxDtl_savedata = async (db: SQLiteDatabase, tableName: string, lists: AddTrxDtl[], docnumbr: string, date: string) => {
  // const insertQuery =
  //   `INSERT OR REPLACE INTO ${tableName}`+
  //   `(NO, LNITMSEQ_ITEM, ITEMNMBR, LNITMSEQ, BIN, QUANTITYAVAILABLE, QUANTITY)`+
  //   ` values ` +
  //   lists.map(
  //       i => `(${i.NO}, ${i.LNITMSEQ_ITEM}, '${i.ITEMNMBR}', ${i.LNITMSEQ}, '${i.BIN}', ${i.QUANTITYAVAILABLE}, ${i.QUANTITY})`
  //   ).join(',');
    const insertData =
    `INSERT INTO ${tableName}`+
    `(DOCNUMBER, DOCTYPE, DOCDATE, Lineitmseq, Item_Number, Item_Description, Quantity, UofM,`+
    `Item_Price, Item_Cost, Store_ID, Site_ID, SalesType_ID, Discount_ID, Discount_Amount, Notes, POS_Device_ID, POS_Version)`;
    var insertQuery = "";
    lists.map((i, index) => {
        insertQuery = insertData + "\n" +
        `select '${docnumbr}', ${1}, '${date}'` + "\n" +
        `WHERE NOT EXISTS(SELECT ITEMNMBR FROM ${tableName} WHERE ITEMNMBR='${i.ITEMNMBR}' and LNITMSEQ=${i.LNITMSEQ} and LNITMSEQ_ITEM = ${i.LNITMSEQ_ITEM})`;
        db.executeSql(insertQuery);
});
    console.log('query INSERT: ', insertQuery)
  return db.executeSql(insertQuery);
};

// export const AddTrxDtl_savedata = async (db: SQLiteDatabase, tableName: string, lists: AddTrxDtl[]) => {
//   const insertQuery =
//     `INSERT OR REPLACE INTO ${tableName}`+
//     `(DOCNUMBER, DOCTYPE, DOCDATE, Lineitmseq, Item_Number, Item_Description, Quantity, UofM,`+
//     `Item_Price, Item_Cost, Store_ID, Site_ID, SalesType_ID, Discount_ID, Discount_Amount, Notes, POS_Device_ID, POS_Version)`+
//     ` values ` +
//     lists.map(
//         i => `('${''}', '${i.item_Number}', '${i.item_Name}', ${i.lineItem_Option}, ${i.cB_Available}, '${i.option_ID}', '${i.option_Name}', ${i.lineItem_Variant}, '${i.variant_Name}',`+
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

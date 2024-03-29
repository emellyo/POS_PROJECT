import {SQLiteDatabase, enablePromise, openDatabase} from 'react-native-sqlite-storage';
import { AddTrxHdr, AddTrxDtl, Variant } from '../models';

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
        DOCNUMBER TEXT  NOT NULL,
        DOCTYPE INT NOT NULL,
        DOCDATE TEXT NOT NULL,
        Lineitmseq INT PRIMARY KEY NOT NULL,
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
        POS_Version TEXT NULL,
        variant_Name TEXT NULL
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

export const queryselectTrx = async (db: SQLiteDatabase, query: string) => {
  console.log('querydyn:', query);
  const Lists: AddTrxDtl[] = [];
    const results = await db.executeSql(query);
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        Lists.push(result.rows.item(index))
      }
    });
    return Lists;
};


// export const AddTrxDtl_savedata = async (db: SQLiteDatabase, tableName: string ,lists: AddTrxDtl[], docnumbr: string, date: string, lnitmseq: number, qty: number, notes: string) => {
//     const insertData =
//     `INSERT INTO ${tableName}`+
//     `(DOCNUMBER, DOCTYPE, DOCDATE, Lineitmseq, Item_Number, Item_Description, Quantity, UofM,`+
//     `Item_Price, Item_Cost, Store_ID, Site_ID, SalesType_ID, Discount_ID, Discount_Amount, Notes, POS_Device_ID, POS_Version, variant_Name)`;
//     var insertQuery = "";
//     lists.map((i, index) => {
//         insertQuery = insertData + "\n" +
//         `select '${docnumbr}', ${1}, '${date}', ${lnitmseq}, '${i.Item_Number}, '${i.Item_Description}', '${qty}', '${'PC'}', ${i.Item_Price}, ${i.Item_Cost}, '${''}', '${''}', '${''}',` + "\n" +
//         `'${''}', ${0}, '${notes}, '${''}, '${''}', '${i.variant_Name}'` + "\n" +
//         `WHERE NOT EXISTS(SELECT It FROM ${tableName} WHERE Item_Number='${i.Item_Number}')`;
//         db.executeSql(insertQuery);
// });
//     console.log('query INSERT: ', insertQuery)
//   return db.executeSql(insertQuery);
// };

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

export const AddTrxDtl_getdataBills = async (db: SQLiteDatabase, tableName: string, docnumbr: string): Promise<AddTrxDtl[]> => {
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


export const AddTrxDtl_getdataPrint = async (db: SQLiteDatabase, tableName: string, docnumbr: string): Promise<AddTrxDtl[]> => {
  try {
    const Lists: AddTrxDtl[] = [];
    const results = await db.executeSql(`SELECT Quantity, Item_Description, Item_Price, variant_Name FROM ${tableName}`);
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

export const AddTrxDtl_getdataBillsDetails = async (db: SQLiteDatabase, tableName: string, docnumbr: string): Promise<AddTrxDtl[]> => {
  try {
    const Lists: AddTrxDtl[] = [];
    const results = await db.executeSql(`SELECT * FROM ${tableName} where DOCNUMBER = '${docnumbr}'`);
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

export const AddTrxDtl_getdataBillsCount = async (db: SQLiteDatabase, tableName: string, docnumbr: string): Promise<AddTrxDtl[]> => {
  try {
    const Lists: AddTrxDtl[] = [];
    const results = await db.executeSql(`SELECT COUNT(*) AS TOTALDETAIL FROM ${tableName} WHERE DOCNUMBER = '${docnumbr}' `);
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

export const AddTrxDtl_savedata = async (db: SQLiteDatabase, tableName: string ,
   docnumbr: string, date: string, lnitmseq: number, qty: number, notes: string, itemnmbr: string, itemname: string, itemprice: number,
   itemcost: number, variantname: string) => {
  const insertQuery =
    `INSERT INTO ${tableName}`+
    `(DOCNUMBER, DOCTYPE, DOCDATE, Lineitmseq, Item_Number, Item_Description, Quantity, UofM,`+
    `Item_Price, Item_Cost, Store_ID, Site_ID, SalesType_ID, Discount_ID, Discount_Amount, Notes, POS_Device_ID, POS_Version, variant_Name)`+
    ` values ` +
 `('${docnumbr}', ${1}, '${date}', ${lnitmseq}, '${itemnmbr}','${itemname}', ${qty}, '${'PCS'}', ${itemprice}, ${itemcost}, '${''}', '${''}', '${''}',` + "\n" +
  `'${''}', ${0}, '${notes}', '${''}', '${''}', '${variantname}')`;
  // join(',')

  return db.executeSql(insertQuery);
};

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

export const dropTbl = async (db: SQLiteDatabase, tableName: string) => {
  const query = `drop table IF EXISTS ${tableName}`;

  await db.executeSql(query);
};
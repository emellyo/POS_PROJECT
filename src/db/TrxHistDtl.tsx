import {SQLiteDatabase, enablePromise, openDatabase} from 'react-native-sqlite-storage';
import {TrxHistDtl} from '../models';

export const getDBConnection = async () => {
   return openDatabase(
    {name: 'DBPOS.db', location: 'default'}
    );
};

enablePromise(true);

export const TrxHistDtl_CreateTbl = async (db: SQLiteDatabase, tableName: string) => {
  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS ${tableName}(
        docnumber TEXT NOT NULL,
        doctype INT NOT NULL,
        docdate TEXT NOT NULL,
        store_ID TEXT NOT NULL,
        salesType_ID TEXT NOT NULL,
        custName TEXT NOT NULL,
        salesType_Name TEXT NOT NULL,
        payment_ID TEXT NOT NULL,
        payment_Name TEXT NOT NULL,
        total_Line_Item INT NOT NULL,
        origtotal REAL NOT NULL,
        subtotal REAL NOT NULL,
        amount_Tendered REAL NOT NULL,
        tax_Amount REAL NOT NULL,
        discount_ID TEXT NOT NULL,
        discount_Amount REAL NOT NULL,
        amount_Tendered1 REAL NOT NULL,
        change_Amount REAL NOT NULL,
        batch_ID TEXT NOT NULL,
        created_User TEXT NOT NULL,
        created_Date TEXT NOT NULL,
        created_time TEXT NOT NULL,
        lineitmseq INT PRIMARY KEY NOT NULL,
        item_Number TEXT NOT NULL,
        item_Description TEXT NOT NULL,
        quantity INT NOT NULL,
        uofM TEXT NOT NULL,
        notes TEXT NULL,
        refundnumber TEXT NOT NULL,
        amt_Refund REAL NOT NULL,
        userName TEXT NOT NULL
    );`;

  await db.executeSql(query);
};


export const TrxHistDtl_getdata = async (db: SQLiteDatabase, tableName: string): Promise<TrxHistDtl[]> => {
  try {
    const Lists: TrxHistDtl[] = [];
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



export const TrxHistDtl_getdataDTL = async (db: SQLiteDatabase, tableName: string, docnumber: string): Promise<TrxHistDtl[]> => {
  try {
    const Lists: TrxHistDtl[] = [];
    const results = await db.executeSql(`SELECT strftime('%m', docdate) || '-' || strftime('%d', docdate) || '-' || strftime('%Y', docdate) AS formatted_date, docnumber, salesType_Name, strftime('%H:%M:%S', created_time) AS formatted_datetime, origtotal, change_Amount, payment_Name, tax_Amount, amt_Refund, userName FROM ${tableName} where docnumber = '${docnumber}' LIMIT 1`);
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

export const TrxHistDtl_getdataItemDtl = async (db: SQLiteDatabase, tableName: string, docnumber: string): Promise<TrxHistDtl[]> => {
  try {
    const Lists: TrxHistDtl[] = [];
    const results = await db.executeSql(`SELECT item_Number, item_Description, lineitmseq, quantity, uofM, notes FROM ${tableName} where docnumber = '${docnumber}'`);
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

export const TrxHistDtl_savedata = async (db: SQLiteDatabase, tableName: string, lists: TrxHistDtl[]) => {
  const insertQuery =
    `INSERT OR REPLACE INTO ${tableName}`+
    `(docnumber, doctype, docdate, store_ID, salesType_ID, custName, salesType_Name, payment_ID, payment_Name, total_Line_Item, origtotal, subtotal, amount_Tendered,`+
    `tax_Amount, discount_ID, discount_Amount, amount_Tendered1, change_Amount, batch_ID, created_User, created_Date, created_time, lineitmseq, item_Number, item_Description, quantity, uofM, notes, refundnumber, amt_Refund, userName)`+
    ` values ` +
    lists.map(
        i => `('${i.docnumber}', ${i.doctype}, '${i.docdate}', '${i.store_ID}', '${i.salesType_ID}', '${i.custName}','${i.salesType_Name}' ,'${i.payment_ID}', '${i.payment_Name}', ${i.total_Line_Item}, ${i.origtotal}, ${i.subtotal}, ${i.amount_Tendered},`+
        `${i.tax_Amount}, '${i.discount_ID}', ${i.discount_Amount}, ${i.amount_Tendered1}, ${i.change_Amount},  '${i.batch_ID}', '${i.created_User}', '${i.created_Date}', '${i.created_time}', ${i.lineitmseq}, '${i.item_Number}', '${i.item_Description}', ${i.quantity}, '${i.uofM}', '${i.notes}', '${i.refundnumber}', ${i.amt_Refund}, '${i.userName}')`
    ).join(',');
  return db.executeSql(insertQuery)
};

export const queryselecTrxHistDtl = async (db: SQLiteDatabase, query: string) => {
  console.log('querydyn:', query);
  const Lists: TrxHistDtl[] = [];
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
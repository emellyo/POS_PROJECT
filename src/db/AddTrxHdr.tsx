import {SQLiteDatabase, enablePromise, openDatabase} from 'react-native-sqlite-storage';
import {AddTrxHdr} from '../models';

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



export const AddTrxHdr_getdataHDR = async (db: SQLiteDatabase, tableName: string, Batch_ID: string): Promise<AddTrxHdr[]> => {
  try {
    const Lists: AddTrxHdr[] = [];
    const results = await db.executeSql(`SELECT * FROM ${tableName} where Batch_ID = '${Batch_ID}'`);
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

export const AddTrxHdr_getdatashift = async (db: SQLiteDatabase, tableName: string, Batch_ID: string): Promise<AddTrxHdr[]> => {
  try {
    const Lists: AddTrxHdr[] = [];
    const results = await db.executeSql(`SELECT COUNT(*) as InvoicePosted, SUM(Amount_Tendered) AS setsum_Tendered, SUM(Change_Amount) AS setsum_Changes, SUM(Discount_Amount) AS setsum_Amount_Discount, 
    SUM(Tax_Amount) AS setsum_Amount_Tax, SUM(ORIGTOTAL) AS ORIGTOTL, SUM(SUBTOTAL) AS SUBTOTAL FROM ${tableName} where Batch_ID = '${Batch_ID}'`);
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

export const AddTrxHdr_getdatacash = async (db: SQLiteDatabase, tableName: string, Batch_ID: string): Promise<AddTrxHdr[]> => {
  try {
    const Lists: AddTrxHdr[] = [];
    const results = await db.executeSql(`SELECT SUM(ORIGTOTAL) as TOTALCASH FROM ${tableName} where Batch_ID = '${Batch_ID}' AND Payment_ID = 'PAY0001'`);
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

export const AddTrxHdr_getdatabca = async (db: SQLiteDatabase, tableName: string, Batch_ID: string): Promise<AddTrxHdr[]> => {
  try {
    const Lists: AddTrxHdr[] = [];
    const results = await db.executeSql(`SELECT SUM(Amount_Tendered) as TOTALCASH FROM ${tableName} where Batch_ID = '${Batch_ID}' AND Payment_ID = 'PAY0002'`);
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

export const AddTrxHdr_getdatamandiri = async (db: SQLiteDatabase, tableName: string, Batch_ID: string): Promise<AddTrxHdr[]> => {
  try {
    const Lists: AddTrxHdr[] = [];
    const results = await db.executeSql(`SELECT SUM(Amount_Tendered) as TOTALCASH FROM ${tableName} where Batch_ID = '${Batch_ID}' AND Payment_ID = 'PAY0003'`);
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

export const AddTrxHdr_getdatagopay = async (db: SQLiteDatabase, tableName: string, Batch_ID: string): Promise<AddTrxHdr[]> => {
  try {
    const Lists: AddTrxHdr[] = [];
    const results = await db.executeSql(`SELECT SUM(Amount_Tendered) as TOTALCASH FROM ${tableName} where Batch_ID = '${Batch_ID}' AND Payment_ID = 'PAY0004'`);
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


export const AddTrxHdr_savedata = async (db: SQLiteDatabase, tableName: string ,
   UserID: string, DOCNUMBER: string, DOCDATE: string, Store_ID: string, SalesType_ID: string, 
  CustName: string, Total_Line_Item: number, ORIGTOTAL: number, SUBTOTAL: number, Tax_Amount: number, Discount_Amount: number, 
Amount_Tendered: number, Change_Amount: number, Batch_ID: string, Payment_ID: string, Payment_Type: string) => {
  const insertQuery =
    `INSERT INTO ${tableName}`+
    `(UserID, DOCNUMBER, DOCTYPE, DOCDATE, Store_ID, Site_ID, SalesType_ID, CustName, Total_Line_Item, ORIGTOTAL, SUBTOTAL,`+
   `Tax_Amount, Discount_ID, Discount_Amount, Amount_Tendered, Change_Amount, Batch_ID, POS_Device_ID, POS_Version, SyncStatus, Payment_ID, Payment_Type)`+
    ` values ` +
 `('${UserID}', '${DOCNUMBER}', ${1}, '${DOCDATE}', '${Store_ID}', '${''}', '${SalesType_ID}','${CustName}', ${Total_Line_Item}, ` + "\n" +
  `${ORIGTOTAL}, ${SUBTOTAL}, ${Tax_Amount}, '${''}', ${Discount_Amount}, ${Amount_Tendered}, ${Change_Amount}, '${Batch_ID}', '${''}', '${''}', ${0}, '${Payment_ID}', '${Payment_Type}')`;
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
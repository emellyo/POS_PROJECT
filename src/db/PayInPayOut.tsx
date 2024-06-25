import {SQLiteDatabase, enablePromise, openDatabase} from 'react-native-sqlite-storage';
import {PayInPayOut} from '../models';

export const getDBConnection = async () => {
   return openDatabase(
    {name: 'DBPOS.db', location: 'default'}
    );
};

enablePromise(true);

export const PayInPayOut_CreateTbl = async (db: SQLiteDatabase, tableName: string) => {
  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS ${tableName}(
        Batch_ID TEXT NOT NULL,
        Type_CashManagement INT NOT NULL,
        Amount REAL NOT NULL,
        Sequence INT PRIMARY KEY NOT NULL,
        Notes TEXT NULL,
        POS_ID TEXT NULL,
        UserID TEXT NOT NULL
    );`;

  await db.executeSql(query);
};


export const PayInPayOut_getdata = async (db: SQLiteDatabase, tableName: string): Promise<PayInPayOut[]> => {
  try {
    const Lists: PayInPayOut[] = [];
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



export const PayInPayOut_getdataHDR = async (db: SQLiteDatabase, tableName: string, Batch_ID: string): Promise<PayInPayOut[]> => {
  try {
    const Lists: PayInPayOut[] = [];
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

export const PayInPayOut_savedata = async (db: SQLiteDatabase, tableName: string ,
   Batch_ID: string, Type_CashManagement: number, Amount: number, Sequence: number, notes: string, userid: string) => {
  const insertQuery =
    `INSERT INTO ${tableName}`+
    `(Batch_ID, Type_CashManagement, Amount, Sequence, Notes, POS_ID, UserID)`+
    ` values ` +
 `('${Batch_ID}', ${Type_CashManagement}, ${Amount}, ${Sequence}, '${notes}', '${userid}' )`;
  // join(',')

  return db.executeSql(insertQuery);
};

export const queryselecPayInPayOut = async (db: SQLiteDatabase, query: string) => {
  console.log('querydyn:', query);
  const Lists: PayInPayOut[] = [];
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
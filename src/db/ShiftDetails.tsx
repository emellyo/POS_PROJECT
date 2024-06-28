import {SQLiteDatabase, enablePromise, openDatabase} from 'react-native-sqlite-storage';
import { ShiftDetail} from '../models';

export const getDBConnection = async () => {
   return openDatabase(
    {name: 'DBPOS.db', location: 'default'}
    );
};

enablePromise(true);

export const ShiftDetail_CreateTbl = async (db: SQLiteDatabase, tableName: string) => {
  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS ${tableName}(
        Batch_ID TEXT PRIMARY KEY NOT NULL,
        LastEdit_Date TEXT NOT NULL,
        LastEdit_time TEXT NOT NULL,
        Store_ID TEXT NULL,
        POS_Device_ID TEXT NULL,
        Opening_Date TEXT NOT NULL,
        Opening_time TEXT NOT NULL,
        Closing_Date TEXT NOT NULL,
        Closing_time TEXT NOT NULL,
        Sum_Amount_Opening REAL NOT NULL,
        Sum_Amount_Closing REAL NOT NULL,
        Sum_Invoice_Posted REAL NOT NULL,
        Sum_Tendered REAL NOT NULL,
        Sum_Changes REAL NOT NULL,
        Sum_Amount_Discount REAL NOT NULL,
        Sum_Amount_Tax REAL NOT NULL,
        Sum_Invoice_Refund_Posted REAL NOT NULL,
        Sum_Amount_PayOut REAL NOT NULL,
        Sum_Amount_PayIn REAL NOT NULL,
        Count_Customers INT NOT NULL,
        Difference REAL NOT NULL,
        Status_Batch INT NOT NULL
    );`;

  await db.executeSql(query);
};



export const queryselectTrx = async (db: SQLiteDatabase, query: string) => {
  console.log('querydyn:', query);
  const Lists: ShiftDetail[] = [];
    const results = await db.executeSql(query);
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        Lists.push(result.rows.item(index))
      }
    });
    return Lists;
};


// export const ShiftDetail_savedata = async (db: SQLiteDatabase, tableName: string ,lists: ShiftDetail[], docnumbr: string, date: string, lnitmseq: number, qty: number, notes: string) => {
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

export const ShiftDetail_getdata = async (db: SQLiteDatabase, tableName: string, Batch_ID: string): Promise<ShiftDetail[]> => {
  try {
    const Lists: ShiftDetail[] = [];
    const results = await db.executeSql(`SELECT * FROM ${tableName} where Batch_ID = '${Batch_ID}' and Status_Batch = 0`);
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

export const ShiftDetail_getdataAll = async (db: SQLiteDatabase, tableName: string, Batch_ID: string): Promise<ShiftDetail[]> => {
  try {
    const Lists: ShiftDetail[] = [];
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

export const ShiftDetail_getdataSum = async (db: SQLiteDatabase, tableName: string, date: string): Promise<ShiftDetail[]> => {
  try {
    const Lists: ShiftDetail[] = [];
    const results = await db.executeSql(`SELECT * FROM ${tableName} where Opening_Date = '${date}' and Status_Batch = 0`);
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

export const ShiftDetail_getdataClos = async (db: SQLiteDatabase, tableName: string, date: string): Promise<ShiftDetail[]> => {
  try {
    const Lists: ShiftDetail[] = [];
    const results = await db.executeSql(`SELECT * FROM ${tableName} where Opening_Date = '${date}' and Status_Batch = 1`);
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

export const ShiftDetail_getdataSumClose = async (db: SQLiteDatabase, tableName: string, date: string): Promise<ShiftDetail[]> => {
  try {
    const Lists: ShiftDetail[] = [];
    const results = await db.executeSql(`SELECT * FROM ${tableName} where Opening_Date = '${date}' and Status_Batch = 1`);
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

export const ShiftDetail_getdataBills = async (db: SQLiteDatabase, tableName: string, docnumbr: string): Promise<ShiftDetail[]> => {
  try {
    const Lists: ShiftDetail[] = [];
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


export const ShiftDetail_getdataPrint = async (db: SQLiteDatabase, tableName: string, docnumbr: string): Promise<ShiftDetail[]> => {
  try {
    const Lists: ShiftDetail[] = [];
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

export const ShiftDetail_getdataBillsDetails = async (db: SQLiteDatabase, tableName: string, docnumbr: string): Promise<ShiftDetail[]> => {
  try {
    const Lists: ShiftDetail[] = [];
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

export const ShiftDetail_getdataBillsCount = async (db: SQLiteDatabase, tableName: string, date: string): Promise<ShiftDetail[]> => {
  try {
    const Lists: ShiftDetail[] = [];
    const results = await db.executeSql(`SELECT COUNT(*) AS TOTALSHIFT FROM ${tableName} WHERE Opening_Date = '${date}' and Status_Batch = 0 `);
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

export const ShiftDetail_getdataBillsCountSumm = async (db: SQLiteDatabase, tableName: string,  date: string): Promise<ShiftDetail[]> => {
  try {
    const Lists: ShiftDetail[] = [];
    const results = await db.executeSql(`SELECT COUNT(*) AS TOTALSHIFT FROM ${tableName} WHERE Opening_Date = '${date}' AND Status_Batch = 0 `);
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

export const ShiftDetail_savedata = async (db: SQLiteDatabase, tableName: string ,
   Batch_ID: string, date: string, openamount: number ,time: string, Store_ID: string) => {
  const insertQuery =
    `INSERT INTO ${tableName}`+
    `(Batch_ID, LastEdit_Date, LastEdit_time, Store_ID, POS_Device_ID, Opening_Date, Opening_time, Closing_Date, Closing_time,`+
    `Sum_Amount_Opening, Sum_Amount_Closing, Sum_Invoice_Posted, Sum_Tendered, Sum_Changes, Sum_Amount_Discount, Sum_Amount_Tax, Sum_Invoice_Refund_Posted, Sum_Amount_PayOut, Sum_Amount_PayIn, Count_Customers, Difference, Status_Batch)`+
    ` values ` +
 `('${Batch_ID}', '${date}', '${time}', '${Store_ID}', '${''}', '${date}', '${time}', '${''}', '${''}', ${openamount}, ${0},` + "\n" +
 `${0}, ${0}, ${0}, ${0}, ${0}, ${0}, ${0}, ${0}, ${0}, ${0}, ${0})`;
  // join(',')

  return db.executeSql(insertQuery);
};


export const ShiftDetail_UpdateData = async (db: SQLiteDatabase, tableName: string,  date: string, amount: number, Batch_ID: string): Promise<ShiftDetail[]> => {
  try {
    const Lists: ShiftDetail[] = [];
    const results = await db.executeSql(`UPDATE ${tableName} SET Sum_Amount_PayIn = ${amount} WHERE Opening_Date = '${date}' AND Batch_ID = '${Batch_ID}' AND Status_Batch = 0 `);
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



export const queryselecShiftDetail = async (db: SQLiteDatabase, query: string) => {
  console.log('querydyn:', query);
  const Lists: ShiftDetail[] = [];
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
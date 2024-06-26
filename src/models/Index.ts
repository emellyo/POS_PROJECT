import { NumericAnimation } from "react-native-reanimated";

export type Variant ={
    DOCID: string;
    item_Number: string;
    item_Name: string;
    lineItem_Option: number;
    cB_Available: number;
    option_ID: string;
    option_Name: string;
    lineItem_Variant: number;
    variant_Name: string;
    item_Price: number;
    item_Cost: number;
    inStock: number;
    lowStock: number;
    optimalStock: number;
    item_SKU: string;
    item_Barcode: string;
    QTY_ORDER: number;
    flag: number;
}

export type Discount ={
    discount_ID: string,
    discount_Name: string,
    discount_Type: number,
    discount_Value: number,
    restricted_Access: number,
    created_User: string,
    created_Date: string,
    modified_User: string,
    modified_Date: string
}

export type AddTrxHdr ={
    UserID: string;
    DOCNUMBER: string;
    DOCTYPE: number;
    DOCDATE: string;
    Store_ID: string;
    Site_ID: string;
    SalesType_ID: string;
    CustName: string;
    Total_Line_Item: number;
    ORIGTOTAL: number;
    SUBTOTAL: number;
    Tax_Amount: number;
    Discount_ID: string;
    Discount_Amount: number;
    Amount_Tendered: number;
    Change_Amount: number;
    Batch_ID: string;
    POS_Device_ID: string;
    POS_Version: string;
    SyncStatus: number;
    Payment_ID: string;
    Payment_Type: string;
}

export type AddTrxDtl ={
    DOCNUMBER: string;
    DOCTYPE: number;
    DOCDATE: number;
    Lineitmseq: number;
    Item_Number: string;
    Item_Description: string;
    Quantity: number;
    UofM: string;
    Item_Price: number;
    Item_Cost: number;
    Store_ID: string;
    Site_ID: string;
    SalesType_ID: string;
    Discount_ID: string;
    Discount_Amount: number;
    Notes: string;
    POS_Device_ID: string;
    POS_Version: string;
    variant_Name: string;
}

export type ShiftDetail ={
    Batch_ID: string,
    LastEdit_Date: string,
    LastEdit_time: string,
    Store_ID: string,
    POS_Device_ID: string,
    Opening_Date: string,
    Opening_time: string,
    Closing_Date: string,
    Closing_time: string,
    Sum_Amount_Opening: number,
    Sum_Amount_Closing: number,
    Sum_Invoice_Posted: number,
    Sum_Tendered: number,
    Sum_Changes: number,
    Sum_Amount_Discount: number,
    Sum_Amount_Tax: number,
    Sum_Invoice_Refund_Posted: number,
    Sum_Amount_PayOut: number,
    Sum_Amount_PayIn: number,
    Count_Customers: number,
    Status_Batch: number
}
export type PayInPayOut ={
    Batch_ID: string,
    Type_CashManagement: number,
    Amount: number,
    Sequence: number,
    Notes: string,
    POS_ID: string,
    UserID: string,
    Date: string,
    Time: string
}
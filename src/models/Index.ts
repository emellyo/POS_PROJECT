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
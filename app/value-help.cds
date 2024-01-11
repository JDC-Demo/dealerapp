using { my.motorsport as schema } from '../db/schema';
using { my.motorsport as masterdata } from '../db/master-data';


annotate schema.Order with {
       to_Customer @Common.ValueList: {
        CollectionPath: 'Customer',
        Label: 'Customer ID',
        Parameters : [
            {
                $Type: 'Common.ValueListParameterInOut',
                LocalDataProperty : to_Customer_customerID,
                ValueListProperty: 'customerID' 
            },
            {
                $Type: 'Common.ValueListParameteDisplayOnly',
                ValueListProperty: 'firstName' 
            },
            {
                $Type: 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'lastName' 
            } ,
            {
                $Type: 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'city' 
            } 
                 ]
    };
}


annotate schema.OrderItem with {

    to_Product @Common.ValueList: {
        CollectionPath: 'Product',
        Label: '',
        Parameters : [
            {
                $Type: 'Common.ValueListParameterInOut',
                LocalDataProperty : to_Product_productID,
                ValueListProperty: 'productID' 
            },
            {
                $Type: 'Common.ValueListParameteDisplayOnly',
                ValueListProperty: 'productName' 
            },

            {
                $Type: 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'price'
            } ,
            {
                $Type: 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'description' 
            }
                 ]
    };
     

    currencyCode @Common.ValueList: {
    CollectionPath : 'Currencies',
    Label : '',
    Parameters : [
      {$Type: 'Common.ValueListParameterInOut', LocalDataProperty: currencyCode_code, ValueListProperty: 'code'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'name'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'descr'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'symbol'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'minor'}
    ]
  };


}

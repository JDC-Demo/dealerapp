using OrderService as service from '../../srv/service';
using from '../label';



annotate service.Orders with {
    to_Customer @Common.Text : to_Customer.companyName
};
annotate service.Orders with {
    orderID @(Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Orders',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : orderID,
                    ValueListProperty : 'orderID',
                },
            ],
        },
        Common.ValueListWithFixedValues : true
)};

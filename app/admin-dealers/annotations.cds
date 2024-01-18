using AdminService as service from '../../srv/service';

annotate service.Customers with {
    companyName @(Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Customers',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : companyName,
                    ValueListProperty : 'companyName',
                },
            ],
        },
        Common.ValueListWithFixedValues : true
)};

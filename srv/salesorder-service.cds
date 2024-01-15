using {OP_API_SALES_ORDER_SRV_0001 as external} from './external/OP_API_SALES_ORDER_SRV_0001';

service BackendService {

    entity SalesOrder as projection on external.A_SalesOrder{
        key SalesOrder ,
        SalesOrderType ,
        SalesOrganization,
        DistributionChannel ,
        OrganizationDivision ,
        ExternalDocumentID,
        SalesOrderDate,
        ShippingType,
        TotalNetAmount,
        ShippingCondition
      //  SalesOrderItem as Items
    };

    }; 
    

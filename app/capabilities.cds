using OrderService  from '../srv/service';
using CustomerService from '../srv/service';
using ProductService from '../srv/service';
using AdminService from '../srv/service';
using BackendService from '../srv/salesorder-service';


annotate OrderService.Orders with @odata.draft.enabled;
annotate OrderService.Orders with @Common.SemanticKey: [orderUUID];
annotate OrderService.OrderItems with @Common.SemanticKey: [itemUUID, to_Order_orderUUID]; 
annotate OrderService.ProductCatalogue with @common.SemanticKey: [productID];


annotate AdminService.Customers with @odata.draft.enabled;
annotate AdminService.Products with @odata.draft.enabled;

annotate AdminService.OrderTemplate with @odata.draft.enabled;
annotate AdminService.OrderTemplate with @Common.SemanticKey: [orderUUID];
annotate AdminService.OrderTemplateItem with @Common.SemanticKey: [itemUUID, to_Order_orderUUID]; 


annotate OrderService.OrderTemplate with @Common.SemanticKey: [orderUUID];
annotate OrderService.OrderTemplateItem with @Common.SemanticKey: [itemUUID, to_Order_orderUUID]; 

annotate BackendService.SalesOrder with @Common.SemanticKey: [SalesOrder];


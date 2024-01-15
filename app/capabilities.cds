using OrderService  from '../srv/service';
using CustomerService from '../srv/service';
using ProductService from '../srv/service';

annotate OrderService.Orders with @odata.draft.enabled;
annotate OrderService.Orders with @Common.SemanticKey: [orderUUID];
annotate OrderService.OrderItems with @Common.SemanticKey: [itemUUID, to_Order_orderUUID]; 
annotate OrderService.ProductCatalogue with @common.SemanticKey: [productID];


annotate CustomerService.Customers with @odata.draft.enabled;
annotate ProductService.Products with @odata.draft.enabled;

annotate OrderService.OrderTemplate with @odata.draft.enabled;
annotate OrderService.OrderTemplate with @Common.SemanticKey: [orderUUID];
annotate OrderService.OrderTemplateItem with @Common.SemanticKey: [itemUUID, to_Order_orderUUID]; 


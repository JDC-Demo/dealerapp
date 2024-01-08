using OrderService  from '../srv/service';

annotate OrderService.Orders with @odata.draft.enabled;
annotate OrderService.Orders with @Common.SemanticKey: [orderUUID];
annotate OrderService.OrderItems with @Common.SemanticKey: [itemUUID, to_Order_orderUUID]; 

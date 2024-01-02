using OrderService  from '../srv/service';

annotate OrderService.Orders with @odata.draft.enabled;
annotate OrderService.Orders with @Common.SemanticKey: [ID];
annotate OrderService.OrderItems with @Common.SemanticKey: [ID]; 

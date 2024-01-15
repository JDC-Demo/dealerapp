
using { my.motorsport as orderschema } from '../db/schema'; 
using { my.motorsport as masterdataschema } from '../db/master-data';

// import the extenal sales order APckeI service
//using { OP_API_SALES_ORDER_SRV_0001 as external } from './external/OP_API_SALES_ORDER_SRV_0001';

service OrderService {
  
  @(restrict: [
    { grant: ['*'], to: 'authenticated-user'},
  //  { grant: 'READ', to: 'authenticated-user'},
    { grant: ['*'], to: 'admin'}
  ])
  entity Orders as projection on orderschema.Order actions { 
    action createOrderByTemplate ();// returns Orders;
  };
   entity OrderItems as projection on orderschema.OrderItem;

  entity OrderTemplate as projection on orderschema.OrderTemplate actions {
     action addFromTemplateToOrder()  returns Orders;
       };
  entity OrderTemplateItem  as projection on orderschema.OrderTemplateItem; 
 
  @ readonly  entity ProductCatalogue as projection on masterdataschema.Product actions {
    action addProductToOrder ();
  };

};


 
 
service CustomerService {
  @(restrict: [
    { grant: ['*'], to: 'authenticated-user'},
    { grant: ['*'], to: 'admin'}

  ])
  entity Customers as projection on masterdataschema.Customer;
}

service ProductService {
  @(restrict: [
    { grant: ['*'], to: 'authenticated-user'},
    { grant: ['*'], to: 'admin'}
  ])

  
  entity Products as projection on masterdataschema.Product;

}

using { my.motorsport as orderschema } from '../db/schema'; 
using { my.motorsport as masterdataschema } from '../db/master-data';

// import the extenal sales order APckeI service
//using { OP_API_SALES_ORDER_SRV_0001 as external } from './external/OP_API_SALES_ORDER_SRV_0001';

@requires: 'authenticated-user'  
service OrderService {


  
//add a label for comment
/*
type inText : {
  comment: String ;// @title: 'Comment';
};

*/
  /* @(restrict: [
    { grant: ['*'], to: 'authenticated-user'}
  //  { grant: 'READ', to: 'authenticated-user'},
 //   { grant: ['*'], to: 'admin'}
  ]) */
  entity Orders as projection on orderschema.Order actions { 
    action createOrderByTemplate ();// returns Orders;
    action confirmOrder();  //(text:inText:comment);
    action autoSuggestion();  //(text:inText:comment);
  };

   entity OrderItems as projection on orderschema.OrderItem;

  @readonly   entity OrderTemplate as projection on orderschema.OrderTemplate actions {
     action addFromTemplateToOrder()  returns Orders;
       };
  entity OrderTemplateItem  as projection on orderschema.OrderTemplateItem; 
 
  @readonly  entity ProductCatalogue as projection on masterdataschema.Product actions {
    action addProductToOrder ();
  };

};

//@requires: 'dealeradmin'  
service AdminService {
  /*  @(restrict: [
   // { grant: ['*'], to: 'authenticated-user'},
    { grant: ['*'], to: 'dealeradmin'}

  ])
*/

type paramin : {
  customerID: Integer ;// @title: 'Comment';
};


  entity Customers as projection on masterdataschema.Customer;
  entity Products as projection on masterdataschema.Product;
  entity OrderTemplate as projection on orderschema.OrderTemplate actions {
    action createOrderByTemplate(customerID:paramin:customerID) ;
  };
  entity OrderTemplateItem  as projection on orderschema.OrderTemplateItem; 
} 
 
service CustomerService {
  /*@(restrict: [
    { grant: ['READ'], to: 'authenticated-user'},
    { grant: ['*'], to: 'dealeradmin'}

  ]) */
  entity Customers as projection on masterdataschema.Customer;
}

service ProductService {
/*  @(restrict: [
    { grant: ['READ'], to: 'authenticated-user'},
    { grant: ['*'], to: 'dealeradmin'}
  ])
*/
  
  entity Products as projection on masterdataschema.Product;

};


 
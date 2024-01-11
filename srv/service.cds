
using { my.motorsport as orderschema } from '../db/schema'; 
using { my.motorsport as masterdataschema } from '../db/master-data';


service OrderService {
  
  @(restrict: [
    { grant: ['*'], to: 'authenticated-user'},
  //  { grant: 'READ', to: 'authenticated-user'},
    { grant: ['*'], to: 'admin'}
  ])
  entity Orders as projection on orderschema.Order;
  entity OrderItems as projection on orderschema.OrderItem;
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
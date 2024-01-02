
using { my.motorsport as orderschema } from '../db/schema';
using { my.motorsport as torderschema } from '../db/master-order';
using { my.motorsport as masterdataschema } from '../db/master-data';


service OrderService {
  entity Orders as projection on orderschema.Order;
  entity OrderItems as projection on orderschema.OrderItem;
}
 
 
 
namespace my.motorsport;

using { Currency, Country, custom.managed, sap } from './common';
using {my.motorsport.Product as Product} from '../db/master-data';

entity Order : managed  {
  key ID: Integer; //UUID;
  orderedBy: String;
  orderDate: Date;
  status: String;
  deliveryAddress: String;
  totalAmount: Decimal(10, 2);
  currencyCode   : Currency;
  description    : String(1024);
  to_Items: Composition of many OrderItem on to_Items.to_Order = $self;
}

entity OrderItem : managed {
  key ID: UUID; 
  to_Order : Association to Order;
  to_Product: Association to Product;
  quantity: Integer;
  netPrice: Decimal(10, 2);
  currencyCode   : Currency;
}

namespace my.motorsport;

using { Currency, Country, custom.managed, sap } from './common';
using {my.motorsport.Products as Products} from '../db/master-data';

entity Orders {
  key ID: Integer; //UUID;
  orderedBy: String;
  orderDate: Date;
  status: String;
  deliveryAddress: String;
  totalAmount: Decimal(10, 2);
  currencyCode   : Currency;
  description    : String(1024);
  to_Items: Composition of many OrderItems on to_Items.parent = $self;
}

entity OrderItems {
  key ID: UUID;
  parent: Association to one Orders;
  product: Association to Products;
  quantity: Integer;
  price: Decimal(10, 2);
  currencyCode   : Currency;
}

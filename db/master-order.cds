namespace my.motorsport;
using { Currency, Country, custom.managed, sap } from './common';
using {my.motorsport.Product as Product} from '../db/master-data';


entity OrderTemplate {
  key ID: UUID;
  packageName : String;
  validFrom: Date;
  validTo: Date;
  type: Association to TemplateType;
  status: String;
  totalAmount: Decimal(10, 2);
  to_Items: Composition of many OrderTemplateItem on to_Items.parent = $self;
}

entity OrderTemplateItem {
  key ID: UUID;
  parent: Association to OrderTemplate;
  product: Association to Product;
  quantity: Integer;
  price: Decimal(10, 2);
}

entity TemplateType : sap.common.CodeList {
  key code : String(2) enum {
    Promotion     = 'PU';
    OrderPack     = 'SU';
  };
}
 
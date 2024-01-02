namespace my.motorsport;
using { Currency, Country, custom.managed, sap } from './common';
using {my.motorsport.Products as Products} from '../db/master-data';


entity OrderTemplates {
  key ID: UUID;
  packageName : String;
  validFrom: Date;
  validTo: Date;
  type: Association to TemplateType;
  status: String;
  totalAmount: Decimal(10, 2);
  items: Composition of many OrderTemplateItems on items.parent = $self;
}

entity OrderTemplateItems {
  key ID: UUID;
  parent: Association to OrderTemplates;
  product: Association to Products;
  quantity: Integer;
  price: Decimal(10, 2);
}

entity TemplateType : sap.common.CodeList {
  key code : String(2) enum {
    Promotion     = 'PU';
    OrderPack     = 'SU';
  };
}
 
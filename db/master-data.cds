namespace my.motorsport;

using { Currency, Country, custom.managed,  sap } from '../db/common';
// ensure all masterdata entities are available to clients
@cds.autoexpose //@readonly
aspect MasterData {}
 
entity Product : MasterData ,managed{
  key productID: String; // @readonly @Core.Computed;
  productName: String;
  productDescription: String;
  price: Decimal(10, 2); 
  currencyCode   : Currency default 'USD';
  category: String; 
  image: String  @UI : {IsImageURL : true};// This can store a reference to the image location
    // Additional fields
  productModel: String; // The model of the motorsport product
  productBrand: String; // The brand of the motorsport product
  productYear: Integer; // The year of the motorsport product
  productColor: String; // The color of the motorsport product
  productSize: String; // The size of the motorsport product (could be relevant for gear, helmets, etc.)
  productCondition: String; // The condition of the motorsport product (new, used, etc.)
  stockQuantity: Integer; // The quantity of the motorsport product in stock
  productCategory: String; // The category of the motorsport product (gear, helmets, etc.)
}

entity Customer :  MasterData {
  key customerID : Integer; // @readonly @Core.Computed;
  firstName      : String(40);
  lastName       : String(40);
  title          : String(10);
  street         : String(60);
  postalCode     : String(10);
  city           : String(40);
  countryCode    : Country;
  phoneNumber    : String(30);
  eMailAddress   : String(256);
  companyName    : String(40);
  companyAddress : String(60);
  @virtual
   salesData : SalesData;
};


type SalesData : {
  currentyear_sales : Integer default 100000;
  lastyear_sales : Integer default 90000;
};
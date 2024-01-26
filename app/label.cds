using { my.motorsport as schema } from '../db/schema';
using { my.motorsport as masterdata } from '../db/master-data';
using { Currency,custom.managed, sap.common.CodeList } from '../db/common';


annotate schema.Order with @title: '{i18n>Order}' {

  orderUUID   @UI.Hidden;
  orderID     @title: '{i18n>OrderID}' @Common.Text: description;
  description @title: '{i18n>Description}';
  to_Customer  @title: '{i18n>CustomerID}' @Common.Text: to_Customer.companyName;
  orderStatus  @title: '{i18n>Status}' @Common.Text: orderStatus.name @Common.TextArrangement: #TextOnly;
  totalAmount @title: '{i18n>TotalAmount}' @Measures.ISOCurrency: currencyCode_code;
  orderDate   @title: '{i18n>OrderDate}';
  orderedBy   @title: '{i18n>OrderedBy}';
  to_Items @UI.Hidden;


  paymentMethod @title: '{i18n>PaymentMethod}';
  paymentDate @title: '{i18n>PaymentDate}';
  shippingMethod @title: '{i18n>ShippingMethod}';
  trackingNumber @title: '{i18n>TrackingNumber}';
  estimatedDeliveryDate @title: '{i18n>EstimatedDeliveryDate}';
  orderNotes @title: '{i18n>OrderNotes}';
  billingAddress @title: '{i18n>BillingAddress}';
  discount @title: '{i18n>Discount}' @Measures.ISOCurrency: currencyCode_code @readonly: true;
  tax @title: '{i18n>Tax}'@Measures.ISOCurrency: currencyCode_code;
  deliveryAddress @title: '{i18n>DeliveryAddress}';
  deliveryContactNumber @title: '{i18n>DeliveryContactNumber}';
  deliveryInstructions @title: '{i18n>DeliveryInstructions}';
  isPaid @title: '{i18n>IsPaid}'; 
  cancellationReason @title: '{i18n>CancellationReason}';

}

annotate schema.OrderItem with @title: '{i18n>OrderItem}' {
  
  itemUUID @UI.Hidden;
  itemID @title: '{i18n>ItemID}';
  to_Order @UI.Hidden;
  to_Product @title: '{i18n>ProductID}' @Common.Text: to_Product.productName;
  quantity @title: '{i18n>Quantity}';
  autoSuggested @title : '{i18n>AISuggested}' @UI.DataField: { Value: autoSuggested, Criticality: #BOOLEAN };
  unitPrice @title: '{i18n>UnitPrice}' @Measures.ISOCurrency: currencyCode_code;
  netPrice @title: '{i18n>NetPrice}'  @Measures.ISOCurrency: currencyCode_code;
  currencyCode @title: '{i18n>CurrencyCode}';
  productModel @title: '{i18n>ProductModel}';
  productBrand @title: '{i18n>ProductBrand}';
  productYear @title: '{i18n>ProductYear}';
  productColor @title: '{i18n>ProductColor}';
  productSize @title: '{i18n>ProductSize}';
  productCondition @title: '{i18n>ProductCondition}'; 

  
}

annotate masterdata.Product with @title: '{i18n>Product}' {


  productID @title: '{i18n>ProductID}';
  productModel @title: '{i18n>ProductModel}';
  productBrand @title: '{i18n>ProductBrand}';
  productYear @title: '{i18n>ProductYear}';
  productColor @title: '{i18n>ProductColor}';
  productSize @title: '{i18n>ProductSize}';
  productName @title: '{i18n>ProductName}';
  productDescription @title: '{i18n>ProductDescription}';
  productCategory @title: '{i18n>ProductCategory}';
  price @title: '{i18n>Price}' @Measures.ISOCurrency: currencyCode_code;
  productCondition @title: '{i18n>ProductCondition}';
  stockQuantity @title: '{i18n>StockQuantity}';
}

annotate masterdata.Customer with @title: '{i18n>Customer}' {

  customerID @title: '{i18n>CustomerID}';
  firstName @title: '{i18n>FirstName}';
  lastName @title: '{i18n>LastName}';
  title  @title: '{i18n>title}';
  eMailAddress @title: '{i18n>Email}';
  phoneNumber @title: '{i18n>Phone}';
  address @title: '{i18n>Address}';
  city @title: '{i18n>City}';
  countryCode @title: '{i18n>Country}';
  postalCode @title: '{i18n>PostalCode}';

  companyName @title: '{i18n>CompanyName}'; 
  companyAddress @title: '{i18n>CompanyAddress}'; 
}

annotate schema.OrderStatus with {
  code @Common.Text: name @Common.TextArrangement: #TextOnly;
};


annotate schema.OrderTemplate with @title: '{i18n>OrderTemplate}' {

  orderUUID   @UI.Hidden;
  orderID     @title: '{i18n>OrderID}' @Common.Text: description;
  description @title: '{i18n>Description}';
  totalAmount @title: '{i18n>TotalAmount}' @Measures.ISOCurrency: currencyCode_code;
  to_Items @UI.Hidden;
  orderNotes @title: '{i18n>OrderNotes}';
  
  discount @title: '{i18n>Discount}' @Measures.ISOCurrency: currencyCode_code @readonly: true;
  tax @title: '{i18n>Tax}'@Measures.ISOCurrency: currencyCode_code;
}

annotate schema.OrderTemplateItem with @title: '{i18n>OrderTemplateItem}' {

  itemUUID @UI.Hidden;
  itemID @title: '{i18n>ItemID}';
  to_Order @UI.Hidden;
  to_Product @title: '{i18n>ProductID}' @Common.Text: to_Product.productName;
  quantity @title: '{i18n>Quantity}';
  unitPrice @title: '{i18n>UnitPrice}' @Measures.ISOCurrency: currencyCode_code;
  netPrice @title: '{i18n>NetPrice}'  @Measures.ISOCurrency: currencyCode_code;
  currencyCode @title: '{i18n>CurrencyCode}';
  productModel @title: '{i18n>ProductModel}';
  productBrand @title: '{i18n>ProductBrand}';
  productYear @title: '{i18n>ProductYear}';
  productColor @title: '{i18n>ProductColor}';
  productSize @title: '{i18n>ProductSize}';
  productCondition @title: '{i18n>ProductCondition}'; 
}
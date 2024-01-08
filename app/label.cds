using { my.motorsport as schema } from '../db/schema';
using { my.motorsport as masterdata } from '../db/master-data';
using { Currency,custom.managed, sap.common.CodeList } from '../db/common';


annotate schema.Order with @title: '{i18n>Order}' {

  orderUUID   @UI.Hidden;
  orderID     @title: '{i18n>OrderID}';
  to_Customer  @title: '{i18n>CustomerID}';
  status      @title: '{i18n>Status}';
  totalAmount @title: '{i18n>TotalAmount}' @Measures.ISOCurrency: currencyCode_code;
  orderDate   @title: '{i18n>OrderDate}';

  to_Items @UI.Hidden;


  paymentMethod @title: '{i18n>PaymentMethod}';
  shippingMethod @title: '{i18n>ShippingMethod}';
  trackingNumber @title: '{i18n>TrackingNumber}';
  estimatedDeliveryDate @title: '{i18n>EstimatedDeliveryDate}';
  orderNotes @title: '{i18n>OrderNotes}';
  billingAddress @title: '{i18n>BillingAddress}';
  discount @title: '{i18n>Discount}';
  tax @title: '{i18n>Tax}';
  deliveryContactNumber @title: '{i18n>DeliveryContactNumber}';
  deliveryInstructions @title: '{i18n>DeliveryInstructions}';
  isPaid @title: '{i18n>IsPaid}';
  paymentDate @title: '{i18n>PaymentDate}';
  cancellationReason @title: '{i18n>CancellationReason}';

}

annotate schema.OrderItem with @title: '{i18n>OrderItem}' {
  
  itemUUID @UI.Hidden;
  itemID @title: '{i18n>ItemID}';
  to_Order @UI.Hidden;
  to_Product @title: '{i18n>ProductID}' @Common.Text: to_Product.productID;
  quantity @title: '{i18n>Quantity}';
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
  price @title: '{i18n>Price}' @Measures.ISOCurrency: currencyCode_code;
  productCondition @title: '{i18n>ProductCondition}';
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
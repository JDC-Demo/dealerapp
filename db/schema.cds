namespace my.motorsport;

using { Currency, custom.managed, sap.common.CodeList } from './common';
using { my.motorsport.Product as Product , 
        my.motorsport.Customer as Customer} from '../db/master-data';


entity Order : managed  {
  key orderUUID :UUID @odata.Type:'Edm.String';
  orderID       : Integer @readonly default 0;
  to_Customer   :  Association to Customer;
  orderDate     : Date;
  orderedBy     : String; // The name of the person who placed the order
  status         : String;
  deliveryAddress: String; 
  totalAmount     : Decimal(10, 2) @Core.Computed;
  currencyCode   : Currency;
  description    : String(1024);
  to_Items       : Composition of many OrderItem on to_Items.to_Order = $self;

  paymentMethod: String; // e.g., "Credit Card", "PayPal"
  shippingMethod: String; // e.g., "Standard", "Express"
  trackingNumber: String;
  estimatedDeliveryDate: Date;
  orderNotes: String(2048); // Any additional notes or instructions for the order
  billingAddress: String; // The address where the bill is sent
  discount: Decimal(10, 2); // Any discount applied to the order
  tax: Decimal(10, 2); // Tax applied to the order
  deliveryContactNumber: String; // Contact number for delivery-related communication
  deliveryInstructions: String(2048); // Any specific instructions for delivery
  isPaid: Boolean; // Whether the order has been paid or not
  paymentDate: Date; // The date when the payment was made
  cancellationReason: String(1024); // If the order was cancelled, the reason for cancellation
}

entity OrderItem : managed {
  key itemUUID: UUID @odata.Type:'Edm.String';
  itemID: Integer @Core.Computed;
  to_Order: Association to Order;
  to_Product: Association to Product;
  quantity: Integer;
  netPrice: Decimal(10, 2) @Core.Computed;
  currencyCode   : Currency;

// pricing
  discount : Decimal(10, 2); // Any discount applied to the order item
  tax: Decimal(10, 2); // Tax applied to the order item
  totalAmount: Decimal(10, 2) @Core.Computed;

 //delivery and return
  deliveryDate: Date @Core.Computed; // The date when the order item is expected to be delivered
  deliveryStatus: String @Core.Computed; // The status of the delivery of the order item
  deliveryTrackingNumber: String @Core.Computed; // The tracking number of the delivery of the order item
  deliveryNotes: String(2048) @Core.Computed; // Any additional notes or instructions for the delivery of the order item
  cancellationReason: String(1024) @Core.Computed; // If the order item was cancelled, the reason for cancellation
  cancellationDate: Date @Core.Computed; // The date when the order item was cancelled
  cancellationNotes: String(2048) @Core.Computed; // Any additional notes or instructions for the cancellation of the order item
  isCancelled: Boolean @Core.Computed; // Whether the order item was cancelled or not
  isDelivered: Boolean @Core.Computed; // Whether the order item was delivered or not
  isReturned: Boolean @Core.Computed; // Whether the order item was returned or not
  returnReason: String(1024) @Core.Computed; // If the order item was returned, the reason for return
  returnDate: Date @Core.Computed; // The date when the order item was returned
  returnNotes: String(2048) @Core.Computed; // Any additional notes or instructions for the return of the order item
  returnTrackingNumber: String @Core.Computed; // The tracking number of the return of the order item
  returnStatus: String @Core.Computed; // The status of the return of the order item
   
    // Additional fields
  productModel: String @Core.Computed; // The model of the motorsport product
  productBrand: String @Core.Computed; // The brand of the motorsport product
  productYear: Integer @Core.Computed; // The year of the motorsport product
  productColor: String; // The color of the motorsport product
  productSize: String; // The size of the motorsport product (could be relevant for gear, helmets, etc.)
  productCondition: String; // The condition of the motorsport product (new, used, etc.)
}

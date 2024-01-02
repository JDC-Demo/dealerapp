
using {OrderService } from './service';

using { my.motorsport.Product} from '../db/master-data';

annotate OrderService.Orders with @(
UI.HeaderInfo : {
  TypeName : 'Order',
  TypeNamePlural : 'Orders ',
  Title : { Value : ID },
  Description : { Value : status }
});

annotate OrderService.Orders with @(
  UI.SelectionFields : [ ID, status ] 
);

annotate OrderService.Orders with @(
  UI.PresentationVariant : {
    Text           : 'Default',
    Visualizations : ['@UI.LineItem'],
    SortOrder      : [{
      $Type      : 'CommonI.SortOrderType',
      Property   : ID,
      Descending : false
      }]
  });

annotate OrderService.Orders with @(
  UI.LineItem : [
    { Value : ID, Label : 'Order number' },
    { Value : orderDate, Label : 'Ordered Date' },
    { Value : orderedBy,  Label : 'Order Placed By' },
    { Value : status, Label : 'Status' },
    { Value : totalAmount, Label : 'Amount' }
  ]);



  annotate OrderService.Orders with @(
    UI.Facets : [
      {  // Order details
        $Type  : 'UI.ReferenceFacet',
        ID     : 'OrderGeneralInformation',
        Target : '@UI.FieldGroup#OrderData',
        Label  : 'General Information'    
      }, 
      {  // order item list
        $Type  : 'UI.ReferenceFacet',
        Target : 'to_Items/@UI.PresentationVariant',
        Label  : 'Order Items'
      }
  ]);

 annotate OrderService.Orders with @(
  UI.FieldGroup #OrderData : {
    Data : [ { Value : ID  , Label : 'Order No.'} , 
    { Value : orderDate , Label : 'Ordered Date'} , 
    { Value : orderedBy , Label : 'Order Placed By'} ,
    { Value : status , Label : 'Status' }, 
    { Value : totalAmount , Label : ' Total Amount' } ]
  });

annotate OrderService.OrderItems with @(
  UI.PresentationVariant : {
    Text           : 'Default',
    Visualizations : ['@UI.LineItem'],
    SortOrder      : [{
      $Type      : 'CommonI.SortOrderType',
      Property   : ID,
      Descending : true
      }]
  }

  );

annotate OrderService.OrderItems  with @(
  UI.LineItem : [
    { Value : to_Product.image, Label : ' '},
    { Value : to_Product.productName, Label : 'Product Name' },
    { Value : to_Product_ID, Label : 'Product ID' },

    { Value : quantity, Label : 'Quantity' },
    { Value : price, Label : 'Price' },
    { Value : totalAmount, Label : 'Total Amount' }
  ]);

using OrderService from './service';



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
      Descending : true
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
    Data : [ { Value : ID } , 
    { Value : orderDate , Label : 'Ordered Date'} , 
    { Value : orderedBy , Label : 'Order Placed By'} ,
    { Value : status , Label : 'Status' }, 
    { Value : totalAmount , Label : ' Total Amount' } ]
  });

annotate OrderService.OrderItems with @UI: {
    Identification                : [{Value: product_ID}, ],
    HeaderInfo                    : {
        TypeName      : 'Product',
        TypeNamePlural: 'Products',
        Title         : {Value: ''},
        Description   : {Value: ''}
    },
    PresentationVariant           : {
        Visualizations: ['@UI.LineItem'],
        SortOrder     : [{
            $Type     : 'Common.SortOrderType',
            Property  : product_ID,
            Descending: false
        }]
    },
    SelectionFields               : [],
    LineItem                      : [
     { Value: product.image, Label: '   ' },
      { Value: product_ID, Label: 'Product' },
      { Value: price,  Label: 'Unit Price' },
      { Value: quantity, Label: 'Quantity' },
      { Value: price, Label: 'Price' }
    ]
};
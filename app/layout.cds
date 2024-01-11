
using {OrderService } from '../srv/service';

using { my.motorsport.Product as Product, my.motorsport.Customer as Customer} from '../db/master-data';
 
annotate OrderService.Orders with @(
UI.HeaderInfo : {
  TypeName : 'Order',
  TypeNamePlural : 'Orders ',
  Title : { Value : orderID },
  Description : { Value : description }
});

annotate OrderService.Orders with @(
  UI.SelectionFields : [ orderID, status ] 
);

annotate OrderService.Orders with @(
  UI.PresentationVariant : {
    Text           : 'Default',
    Visualizations : ['@UI.LineItem'],
    SortOrder      : [{
      $Type      : 'CommonI.SortOrderType',
      Property   : orderID 
      }]
  });

 

annotate OrderService.Orders with @(
  UI.LineItem : [
    { Value : orderID },
    { Value : to_Customer.companyName,   ![@UI.Importance]: #High, ![@UI.NavigationProperty]: true  },
    { Value : description },
    { Value : orderStatus_code,  ![@UI.Importance]: #High },
    { Value : totalAmount ,  ![@UI.Importance]: #High}, 
    { Value : estimatedDeliveryDate, Label : 'Estimated Delivery Date' },
    { Value : isPaid},
    { Value : orderedBy },
    { Value : orderDate },
    { Value : paymentMethod },
    { Value : shippingMethod },
    { Value : trackingNumber },
    { Value : orderNotes},
    { Value : billingAddress},
    { Value : discount },
    { Value : tax },
    { Value : deliveryContactNumber },
    { Value : deliveryInstructions },
    { Value : deliveryAddress },
    { Value : paymentDate},
    { Value : cancellationReason} 
  ]);



  annotate OrderService.Orders with @(
    UI.Facets : [
      {  // Order details
        $Type  : 'UI.ReferenceFacet',
        ID     : 'OrderGeneralInformation',
        Target : '@UI.FieldGroup#GeneralInformation',
        Label  : 'General Information'    
      }, 
      {  // order item list
        $Type  : 'UI.ReferenceFacet',
        Target : 'to_Items/@UI.PresentationVariant',
        Label  : ''
      },
            {  // PaymentDetails
        $Type  : 'UI.ReferenceFacet',
        ID     : 'OrderPaymentDetails',
        Target : '@UI.FieldGroup#PaymentDetails',
        Label  : 'Payment'    
      }, 
            {  // DeliveryDetails
        $Type  : 'UI.ReferenceFacet',
        ID     : 'OrderDeliveryDetails',
        Target : '@UI.FieldGroup#DeliveryDetails',
        Label  : 'Delivery'    
      }, 
            {  // BillingDetails
        $Type  : 'UI.ReferenceFacet',
        ID     : 'OrderBillingDetails',
        Target : '@UI.FieldGroup#BillingDetails',
        Label  : 'Billing'    
      }, 
            {  // CancellationDetails
        $Type  : 'UI.ReferenceFacet',
        ID     : 'OrderCancellationDetails',
        Target : '@UI.FieldGroup#CancellationDetails',
        Label  : 'Cancellation'    
      },
            {  // Administrativedata
        $Type  : 'UI.ReferenceFacet',
        ID     : 'OrderAdministrativedata',
        Target : '@UI.FieldGroup#Administrativedata',
        Label  : 'Administrative Data'    
      }

  ]);

annotate OrderService.Orders with @(
  UI.FieldGroup #GeneralInformation : {
    Data : [ 
   //   { Value : orderID  },
      { Value : description},
      { Value : to_Customer_customerID },
      { Value : orderedBy},
      { Value : orderDate },
      { Value : totalAmount },
      { Value : discount},
      { Value : tax },
      { Value : orderStatus_code },
      { Value : orderNotes }
    ]
  });

annotate OrderService.Orders with @(
  UI.FieldGroup #PaymentDetails : {
    Data : [ 
      { Value : paymentMethod },
      { Value : isPaid },
      { Value : paymentDate }
    ]
  });

annotate OrderService.Orders with @(
  UI.FieldGroup #DeliveryDetails : {
    Data : [ 
      { Value : deliveryAddress},
      { Value : shippingMethod },
      { Value : trackingNumber },
      { Value : estimatedDeliveryDate},
      { Value : deliveryContactNumber },
      { Value : deliveryInstructions }
    ]
  });

annotate OrderService.Orders with @(
  UI.FieldGroup #BillingDetails : {
    Data : [ 
      { Value : billingAddress, }
    ]
  });

annotate OrderService.Orders with @(
  //UI.Identification : [ {value : ID, label : 'Order No.'} ],
  UI.FieldGroup #CancellationDetails : {
    Data : [ 
      { Value : cancellationReason}
    ]
  });

annotate OrderService.Orders with @(
  //UI.Identification : [ {value : ID, label : 'Order No.'} ],
  UI.FieldGroup #Administrativedata : {
    Data : [ 
      { Value : createdAt},
      { Value : createdBy},
      { Value : LastChangedAt},
      { Value : LastChangedBy}
    ]
  });

 
annotate OrderService.OrderItems  with @UI : {
    Identification                : [{Value: productID}, ],
    HeaderInfo: {
      TypeName: 'Product',
      TypeNamePlural: 'Products',
      Title: { Value: itemID },
      Description: { Value: to_Product.productName }
    },
    PresentationVariant : {
        Visualizations: ['@UI.LineItem'],
        SortOrder     : [{
            $Type     : 'Common.SortOrderType',
            Property  : itemID
        }]
    },
  SelectionFields               : [ ],
  LineItem : [
    { Value : to_Product.image, Label : ' ', ![@UI.Importance]: #High},
    { Value : itemID,  ![@UI.Importance]: #High},
    { Value : to_Product_productID, ![@UI.Importance]: #High, ![@UI.NavigationProperty]: true  },
   // { Value : to_Product.productName, ![@UI.Importance]: #High},
    { Value : quantity,  ![@UI.Importance]: #High},
 //   { Value : to_Product.price,  ![@UI.Importance]: #High},
    { Value : unitPrice,  ![@UI.Importance]: #High},
    { Value : netPrice , ![@UI.Importance]: #High},
    { Value : to_Product.productDescription},
    { Value : productModel },
    { Value : productBrand },
    { Value : productYear, ![@UI.Importance]: #High},
    { Value : productColor,  ![@UI.Importance]: #High},
    { Value : productSize, ![@UI.Importance]: #High},
    { Value : productCondition,  ![@UI.Importance]: #Medium}
  
  ],
  Facets  : [ {  // General Information
     $Type  : 'UI.Collection.Facet',
      ID     : 'OrderItem',
      Label  : 'Order Item',    
      Facets: [
                { // General Information
                    $Type  : 'UI.ReferenceFacet',
                    ID     : 'ItemGeneralInformation',
                    Target : '@UI.FieldGroup#ItemGeneralInformation',
                    Label  : 'General Information'    
                },
                { // Product Details
                    $Type  : 'UI.ReferenceFacet',
                    ID     : 'ProductDetails',
                    Target : '@UI.FieldGroup#ProductDetails',
                    Label  : 'Product Details'    
                }
            ]
      }
  ],
  FieldGroup #ItemGeneralInformation : {
    Data : [ 
      { Value : itemID, Label : 'Line No.' },
      { Value : to_Product_productID, Label : 'Product ID' },
      { Value : quantity, Label : 'Quantity' },
      { Value : to_Product.price, Label : 'Price' },
      { Value : netPrice, Label : 'Net Price' },
      { Value : to_Product.currencyCode_code, Label : 'Currency' },
      { Value : to_Product.productDescription, Label : 'Description' }
    ]
  },
  FieldGroup #ProductDetails : {
    Data : [ 
      { Value : to_Product.image, Label : ' ' },
      { Value : to_Product.productName, Label : 'Product Name' },
      { Value : productModel, Label : 'Product Model' },
      { Value : productBrand, Label : 'Product Brand' },
      { Value : productYear, Label : 'Product Year' },
      { Value : productColor, Label : 'Product Color' },
      { Value : productSize, Label : 'Product Size' },
      { Value : productCondition, Label : 'Product Condition' }
    ]
  }
};

 annotate Customer with @(
    UI: {
        HeaderInfo: {
            TypeName: '{i18n>Customer}',
            TypeNamePlural: '{i18n>Customers}',
            Title: { Value: companyName, Label: '{i18n>CompanyName}' },
            Description: { Value: eMailAddress, Label: '{i18n>EmailAddress}' }
        },
        Identification: [
            { Value: customerID, Label: '{i18n>CustomerID}' },
            { Value: firstName, Label: '{i18n>FirstName}' },
            { Value: lastName, Label: '{i18n>LastName}' },
            { Value: companyName, Label: '{i18n>CompanyName}' }
        ],
        PresentationVariant: {
        Visualizations: ['@UI.LineItem'],
        SortOrder     : [{
            $Type     : 'Common.SortOrderType',
            Property  : customerID
        }]
        },
        LineItem: [
            { Value: firstName, Label: '{i18n>FirstName}' },
            { Value: lastName, Label: '{i18n>LastName}' },
            { Value: eMailAddress, Label: '{i18n>Email}' },
            { Value: phoneNumber, Label: '{i18n>PhoneNumber}' },
            { Value: companyName, Label: '{i18n>CompanyName}' },
            { Value: companyAddress, Label: '{i18n>CompanyAddress}' }
        ],
        SelectionFields: [
            companyName 
        ],
        Facets: [
            { $Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#General' },
            { $Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#Details' },
            { $Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#Company' }
        ],
        FieldGroup#General: {
            Data: [
                { Value: customerID, Label: '{i18n>CustomerID}' },
                { Value: firstName, Label: '{i18n>FirstName}' },
                { Value: lastName, Label: '{i18n>LastName}' },
                { Value: title, Label: '{i18n>Title}' }
            ]
        },
        FieldGroup#Details: {
            Data: [
                { Value: street, Label: '{i18n>Street}' },
                { Value: postalCode, Label: '{i18n>PostalCode}' },
                { Value: city, Label: '{i18n>City}' },
                { Value: countryCode_code, Label: '{i18n>Country}' },
                { Value: phoneNumber, Label: '{i18n>PhoneNumber}' },
                { Value: eMailAddress, Label: '{i18n>EmailAddress}' }
            ]
        },
        FieldGroup#Company: {
            Data: [
                { Value: companyName, Label: '{i18n>CompanyName}' },
                { Value: companyAddress, Label: '{i18n>CompanyAddress}' }
            ]
        }
    }
);

annotate Product with @(
    UI: {
          HeaderInfo: {
            TypeName: '{i18n>Product}',
            TypeNamePlural: '{i18n>Products}',
            Title: { Value: productName, Label: '{i18n>ProductName}' },
            Description: { Value: productDescription, Label: '{i18n>ProductDescription}' }
        },
        Identification: [
            { Value: productID, Label: '{i18n>ProductID}' },
            { Value: productName, Label: '{i18n>ProductName}' },
            { Value: price, Label: '{i18n>Price}' },
            { Value: productCategory, Label: '{i18n>ProductCategory}' }
        ],
            PresentationVariant : {
        Visualizations: ['@UI.LineItem'],
        SortOrder     : [{
            $Type     : 'Common.SortOrderType',
            Property  : productID
        }]
    },
        LineItem: [
          { Value: image, Label: ' ' },
          { Value: productID, Label: '{i18n>ProductID}' },
            { Value: productName, Label: '{i18n>ProductName}' },
            { Value: productDescription, Label: '{i18n>ProductDescription}' },
            { Value: price, Label: '{i18n>Price}' },
            { Value: productCategory, Label: '{i18n>ProductCategory}' },
            { Value: productModel, Label: '{i18n>ProductModel}' },
            { Value: productBrand, Label: '{i18n>ProductBrand}' },
            { Value: productYear, Label: '{i18n>ProductYear}' },
            { Value: productColor, Label: '{i18n>ProductColor}' },
            { Value: productSize, Label: '{i18n>ProductSize}' },
            { Value: productCondition, Label: '{i18n>ProductCondition}' },
            { Value: stockQuantity, Label: '{i18n>StockQuantity}' }
        ],
        SelectionFields: [
            productName, productID, productModel 
        ],
       Facets: [
            { $Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#General' },
            { $Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#Details' },
            { $Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#Stock' },
            { $Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#Image' }
        ],
        FieldGroup#General: {
            Data: [
                { Value: productID, Label: '{i18n>ProductID}' },
                { Value: productName, Label: '{i18n>ProductName}' },
                { Value: price, Label: '{i18n>Price}' },
                { Value: productCategory, Label: '{i18n>ProductCategory}' }
            ]
        },
        FieldGroup#Details: {
            Data: [
                { Value: productModel, Label: '{i18n>ProductModel}' },
                { Value: productBrand, Label: '{i18n>ProductBrand}' },
                { Value: productYear, Label: '{i18n>ProductYear}' },
                { Value: productColor, Label: '{i18n>ProductColor}' },
                { Value: productSize, Label: '{i18n>ProductSize}' },
                { Value: productCondition, Label: '{i18n>ProductCondition}' }
            ]
        },
        FieldGroup#Stock: {
            Data: [
                { Value: stockQuantity, Label: '{i18n>StockQuantity}' }
            ]
        },
        FieldGroup#Image: {
            Data: [
                { Value: image, Label: '{i18n>ProductImage}', ![@UI.Importance]: #HIGH }
            ]
        }
    }
);
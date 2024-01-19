
using {OrderService,ProductService,CustomerService } from '../srv/service';

using { my.motorsport.Product as Product, my.motorsport.Customer as Customer} from '../db/master-data';


 annotate AdminService.Customers with @(
    UI: {
        HeaderInfo: {
            TypeName: 'Dealer',
            TypeNamePlural: 'Dealers',
            Title: { Value: companyName, Label: '{i18n>CompanyName}' },
            Description: { Value: eMailAddress, Label: '{i18n>EmailAddress}' }
        },
        Identification: [
            { Value: customerID, Label: '{i18n>CustomerID}' },
       //     { Value: firstName, Label: '{i18n>FirstName}' },
       //     { Value: lastName, Label: '{i18n>LastName}' },
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
            { Value: companyName, Label: '{i18n>CompanyName}' },
            { Value: companyAddress, Label: '{i18n>CompanyAddress}' },
        //    {Value: salesData_currentyear_sales, Label : 'Current year Sales', ![@UI.Importance]: #High},
 
            { Value: customerID, Label: '{i18n>CustomerID}' },
       //     { Value: firstName, Label: '{i18n>ContactFirstName}' },
       //     { Value: lastName, Label: '{i18n>ContactLastName}' },
       //     { Value: eMailAddress, Label: '{i18n>ContactEmail}' },
            { Value: phoneNumber, Label: '{i18n>PhoneNumber}' }
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
       //         { Value: firstName, Label: '{i18n>FirstName}' },
       //         { Value: lastName, Label: '{i18n>LastName}' },
       //         { Value: title, Label: '{i18n>Title}' }
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

annotate AdminService.Products with @(
    UI: {
          HeaderInfo: {
            TypeName: '{i18n>Product}',
            TypeNamePlural: '{i18n>Products}',
            Title: { Value: productName, Label: '{i18n>ProductName}' },
            Description: { Value: productDescription, Label: '{i18n>ProductDescription}' }
        },
        Identification: [
         //   { $Type  : 'UI.DataFieldForAction', Action : 'ProductService.addToOrder',   Label  : '{i18n>AddToOrder}'   },
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
   //         { $Type  : 'UI.DataFieldForAction', Action : 'ProductService.addToOrder',   Label  : '{i18n>AddToOrder}'   },
            { Value: image, Label: ' ' },
            { Value: productID, Label: '{i18n>ProductID}' },
            { Value: productName, Label: '{i18n>ProductName}' },
            { Value: productDescription, Label: '{i18n>ProductDescription}' },
            { Value: price, Label: '{i18n>Price}' },
             { Value: stockQuantity, Label: '{i18n>StockQuantity}' },
            { Value: productCategory, Label: '{i18n>ProductCategory}' },
            { Value: productModel, Label: '{i18n>ProductModel}' },
            { Value: productBrand, Label: '{i18n>ProductBrand}' },
            { Value: productYear, Label: '{i18n>ProductYear}' }
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
                { Value: productDescription, Label: '{i18n>ProductDescription}' },
                { Value: price, Label: '{i18n>Price}' },
        //        { Value: currencyCode_code, Label: '{i18n>CurrencyCode}'},
                { Value: productCategory, Label: '{i18n>ProductCategory}' }
            ]
        },
        FieldGroup#Details: {
            Data: [
                { Value: productModel, Label: '{i18n>ProductModel}' },
                { Value: productBrand, Label: '{i18n>ProductBrand}' },
                { Value: productYear, Label: '{i18n>ProductYear}' }
   //             { Value: productColor, Label: '{i18n>ProductColor}' },
   //             { Value: productSize, Label: '{i18n>ProductSize}' },
   //             { Value: productCondition, Label: '{i18n>ProductCondition}' }
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



annotate AdminService.OrderTemplate with @(
    UI: {
      HeaderInfo: {
        TypeName : 'Template',
        TypeNamePlural : 'Templates ',
        Title : { Value : orderID },
        Description : { Value : description },
        SelectionFields : [ orderID ] },
      PresentationVariant : {
    Text           : 'Default',
    Visualizations : ['@UI.LineItem'],
    SortOrder      : [{
      $Type      : 'CommonI.SortOrderType',
      Property   : orderID 
      }]},
LineItem : [
    { $Type  : 'UI.DataFieldForAction', Action : 'AdminService.createOrderByTemplate',   Label  : '{i18n>CopyTemplateOrder}'   },
    { Value : orderID ,  Label  : 'Template ID' },
    { Value : description },
    { Value : totalAmount ,  ![@UI.Importance]: #High},
    { Value : orderNotes}
  ] ,
    Facets : [
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
            {  // Administrativedata
        $Type  : 'UI.ReferenceFacet',
        ID     : 'OrderAdministrativedata',
        Target : '@UI.FieldGroup#Administrativedata',
        Label  : 'Administrative Data'    
      }

  ],
FieldGroup #GeneralInformation : {
    Data : [ 
   //   { Value : orderID  },
      { $Type  : 'UI.DataFieldForAction', Action : 'AdminService.createOrderByTemplate',   Label  : '{i18n>CopyTemplateOrder}'   },
      { Value : description},
      { Value : totalAmount },
      { Value : discount },
      { Value : orderNotes }
    ]
  },
  FieldGroup #Administrativedata : {
    Data : [ 
      { Value : createdAt},
      { Value : createdBy},
      { Value : LastChangedAt},
      { Value : LastChangedBy}
    ]
  }
  });

 
annotate AdminService.OrderTemplateItem  with @UI : {
    Identification                : [{Value: to_Product_productID}, ],
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
 //   { Value : to_Product.productDescription},
    { Value : to_Product.productModel, Label : 'Product Model' },
    { Value : to_Product.productBrand, Label : 'Product Brand' },
    { Value : to_Product.productYear, Label : 'Product Year' }
   // { Value : productColor,  ![@UI.Importance]: #High},
   // { Value : productSize, ![@UI.Importance]: #High},
   // { Value : productCondition,  ![@UI.Importance]: #Medium}
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
      { Value : to_Product.productModel, Label : 'Product Model' },
      { Value : to_Product.productBrand, Label : 'Product Brand' },
      { Value : to_Product.productYear, Label : 'Product Year' }
   // { Value : productColor,  ![@UI.Importance]: #High},
   // { Value : productSize, ![@UI.Importance]: #High},
   // { Value : productCondition,  ![@UI.Importance]: #Medium}
    ]
  }
};

using { BackendService } from '../srv/salesorder-service';

annotate BackendService.SalesOrder with @(
  UI: {
        HeaderInfo: {
            TypeName: 'Sales Order',
            TypeNamePlural: 'Sales Orders',
            Title: { Value: SalesOrder, Label: 'Sales Order' },
            Description: { Value: SalesOrderType, Label: 'Sales Order Type' }
        },
        PresentationVariant : {
        Visualizations: ['@UI.LineItem'],
        SortOrder     : [{
            $Type     : 'Common.SortOrderType',
            Property  : SalesOrder
        }],
        },
    LineItem: [
      { Value: SalesOrder, Label: 'Sales Order' },
      { Value: SalesOrderType, Label: 'Sales Order Type' },
      { Value: SalesOrganization, Label: 'Sales Organization' },
      { Value: DistributionChannel, Label: 'Distribution Channel' },
      { Value: OrganizationDivision, Label: 'Organization Division' },
      { Value: ExternalDocumentID, Label: 'External Document ID' },
      { Value: SalesOrderDate, Label: 'Sales Order Date' },
      { Value: ShippingType, Label: 'Shipping Type' },
      { Value: TotalNetAmount, Label: 'Total Net Amount' }
    ],
     SelectionFields: [
            { Value: SalesOrder, Label: 'Sales Order' },
            { Value: SalesOrderType, Label: 'Sales Order Type' }
        ]
  }
);
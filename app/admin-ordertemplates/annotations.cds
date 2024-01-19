using AdminService as service from '../../srv/service';
using from '../admin-layout';



annotate service.OrderTemplate with @(
    UI.PresentationVariant : {
        Text : 'Default',
        Visualizations : [
            '@UI.LineItem',
        ],
        SortOrder : [
            {
                $Type : 'CommonI.SortOrderType',
                Property : orderID,
            },
            {
                $Type : 'Common.SortOrderType',
                Property : orderID,
                Descending : true,
            },
        ],
    }
);

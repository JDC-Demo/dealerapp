using OrderService as service from '../../srv/service';
using from '../layout';



annotate service.ProductCatalogue with @(
    UI.SelectionPresentationVariant #table : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : ![@UI.PresentationVariant],
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
            ],
        },
    }
);

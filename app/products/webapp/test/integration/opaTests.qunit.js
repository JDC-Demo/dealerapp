sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'products/test/integration/FirstJourney',
		'products/test/integration/pages/ProductCatalogueList',
		'products/test/integration/pages/ProductCatalogueObjectPage'
    ],
    function(JourneyRunner, opaJourney, ProductCatalogueList, ProductCatalogueObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('products') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheProductCatalogueList: ProductCatalogueList,
					onTheProductCatalogueObjectPage: ProductCatalogueObjectPage
                }
            },
            opaJourney.run
        );
    }
);
sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'productcatalogue/test/integration/FirstJourney',
		'productcatalogue/test/integration/pages/ProductCatalogueList',
		'productcatalogue/test/integration/pages/ProductCatalogueObjectPage'
    ],
    function(JourneyRunner, opaJourney, ProductCatalogueList, ProductCatalogueObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('productcatalogue') + '/index.html'
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
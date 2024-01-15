sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'adminordertemplates/test/integration/FirstJourney',
		'adminordertemplates/test/integration/pages/OrderTemplateList',
		'adminordertemplates/test/integration/pages/OrderTemplateObjectPage',
		'adminordertemplates/test/integration/pages/OrderTemplateItemObjectPage'
    ],
    function(JourneyRunner, opaJourney, OrderTemplateList, OrderTemplateObjectPage, OrderTemplateItemObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('adminordertemplates') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheOrderTemplateList: OrderTemplateList,
					onTheOrderTemplateObjectPage: OrderTemplateObjectPage,
					onTheOrderTemplateItemObjectPage: OrderTemplateItemObjectPage
                }
            },
            opaJourney.run
        );
    }
);
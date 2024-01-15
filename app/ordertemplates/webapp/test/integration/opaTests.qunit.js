sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'ordertemplates/test/integration/FirstJourney',
		'ordertemplates/test/integration/pages/OrderTemplateList',
		'ordertemplates/test/integration/pages/OrderTemplateObjectPage',
		'ordertemplates/test/integration/pages/OrderTemplateItemObjectPage'
    ],
    function(JourneyRunner, opaJourney, OrderTemplateList, OrderTemplateObjectPage, OrderTemplateItemObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('ordertemplates') + '/index.html'
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
sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'dealertemplate/test/integration/FirstJourney',
		'dealertemplate/test/integration/pages/OrderTemplateList',
		'dealertemplate/test/integration/pages/OrderTemplateObjectPage',
		'dealertemplate/test/integration/pages/OrderTemplateItemObjectPage'
    ],
    function(JourneyRunner, opaJourney, OrderTemplateList, OrderTemplateObjectPage, OrderTemplateItemObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('dealertemplate') + '/index.html'
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
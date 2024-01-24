sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'admintemplate/test/integration/FirstJourney',
		'admintemplate/test/integration/pages/OrderTemplateList',
		'admintemplate/test/integration/pages/OrderTemplateObjectPage',
		'admintemplate/test/integration/pages/OrderTemplateItemObjectPage'
    ],
    function(JourneyRunner, opaJourney, OrderTemplateList, OrderTemplateObjectPage, OrderTemplateItemObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('admintemplate') + '/index.html'
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
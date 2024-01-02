sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'dearlerapp/test/integration/FirstJourney',
		'dearlerapp/test/integration/pages/OrdersList',
		'dearlerapp/test/integration/pages/OrdersObjectPage',
		'dearlerapp/test/integration/pages/OrderItemsObjectPage'
    ],
    function(JourneyRunner, opaJourney, OrdersList, OrdersObjectPage, OrderItemsObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('dearlerapp') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheOrdersList: OrdersList,
					onTheOrdersObjectPage: OrdersObjectPage,
					onTheOrderItemsObjectPage: OrderItemsObjectPage
                }
            },
            opaJourney.run
        );
    }
);
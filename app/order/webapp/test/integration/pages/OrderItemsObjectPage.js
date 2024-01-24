sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'order',
            componentId: 'OrderItemsObjectPage',
            contextPath: '/Orders/to_Items'
        },
        CustomPageDefinitions
    );
});
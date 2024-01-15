sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'adminordertemplates',
            componentId: 'OrderTemplateItemObjectPage',
            contextPath: '/OrderTemplate/to_Items'
        },
        CustomPageDefinitions
    );
});
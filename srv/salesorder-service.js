const cds = require('@sap/cds');

module.exports = cds.service.impl(async function() {
	const { SalesOrder } = this.entities;
	const service = await cds.connect.to('OP_API_SALES_ORDER_SRV_0001');
	this.on('READ', SalesOrder, request => {
		return service.tx(request).run(request.query);
	});
});
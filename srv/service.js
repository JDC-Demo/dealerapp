const cds = require("@sap/cds/libx/_runtime/cds")

class OrderService extends cds.ApplicationService {

    init() {

        /**
     * Reflect definitions from the service's CDS model
     */
        const { Orders, OrderItems, Product } = this.entities


        /**
     * Fill in primary keys and defaults for new order.
  
        */
        this.before('CREATE', 'Orders', async req => {
            const { maxID } = await SELECT.one`max(orderID) as maxID`.from(Orders)
            if (!maxID) req.data.orderID = 1
            else {
                req.data.orderID = maxID + 1
            }
            req.data.orderStatus_code = 'O'
            req.data.orderDate = (new Date).toISOString().slice(0, 10) // today

        })


        /**
         * Fill in defaults for new item when editing order.
         */
        this.before('NEW', 'OrderItems.drafts', async (req) => {

            const { to_Order_orderUUID } = req.data
            const { maxID } = await SELECT.one`max(itemID) as maxID`.from(OrderItems).where({ to_Order_orderUUID })
            if (!maxID) req.data.itemID = 1
            else
                req.data.itemID = maxID + 1

        })



        this.after('UPDATE', 'OrderItems.drafts', async (_, req) => {
            if ('quantity' in req.data) {
                const { itemUUID } = req.data;
                const { to_Product_productID } = await SELECT.one().from(OrderItems.drafts).where({ itemUUID });
                const { price } = await SELECT.one().from(Product).where({ productID: to_Product_productID });
                return await cds.run(UPDATE(OrderItems.drafts).set({ netPrice: price * req.data.quantity, unitPrice: price }).where({ itemUUID: itemUUID }));

            }

        })



        this.after('UPDATE', 'Orders', async (_, req) => {
                const { orderUUID } = req.data;
                console.log(req.data);
                const { sum } = await SELECT.one`sum(netPrice) as sum`.from(OrderItems).where({ to_Order_orderUUID : orderUUID})
                console.log(sum);
                const discount = sum * .03;
                const tax = ( sum-discount ) * 0.07;
                const total = sum + tax - discount;

                // update total price on orders
               return   await cds.run(UPDATE(Orders).set({ tax : tax, totalAmount: total, discount: discount }).where({ orderUUID }))
                // 
 

        })

        /**
         * Changes to  orders not allowed after approval or cancelled.
         */
        this.before(['UPDATE', 'DELETE'], 'Orders', async (req) => {
            const { orderStatus } = await SELECT.one`orderStatus`.from(Orders).where({ orderID: req.data.orderID })
            if (orderStatus === 'C' || orderStatus === 'A') req.reject(403, 'Order cannot be updated')
        })


 

        return super.init()

    }
}


module.exports = { OrderService }
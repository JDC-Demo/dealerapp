class OrderService extends cds.ApplicationService {

init() {

      /**
   * Reflect definitions from the service's CDS model
   */
    const { Orders, OrderItems } = this.entities

    
      /**
   * Fill in primary keys for new order.

      */



this.before ('CREATE', 'Orders', async req => { 
    const { maxID } = await SELECT.one `max(orderID) as maxID` .from (Orders)
    req.data.orderID = maxID + 1
})


      /**
   * Fill in primary keys for new order item.
   */
this.before ('NEW', 'OrderItems', async (req) => {
    const {to_Orders_orderID  } = req.data
    const { maxID } = await SELECT.one `max(itemID) as maxID` .from (OrderItems) .where ({to_Orders_orderID})
    req.data.itemID = maxID + 1
})

  // Add base class's handlers. Handlers registered above go first.
return super.init()

}}


module.exports = { OrderService }
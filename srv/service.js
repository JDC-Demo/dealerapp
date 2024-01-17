const cds = require("@sap/cds/libx/_runtime/cds")

class OrderService extends cds.ApplicationService {

    init() {

        /**
     * Reflect definitions from the service's CDS model
     */
        const { Orders, OrderItems, Product, OrderTemplate, OrderTemplateItem, ProductCatalogue } = this.entities

 

        // create a function to update unit price and net price for order line items using uuid

        this._updateOrderLineItem = async function (orderUUID, req, srv) {
            const orderLineItems = await srv.tx(req).run(SELECT.from('OrderItems').where({ to_Order_orderUUID: orderUUID }));
            for (let i = 0; i < orderLineItems.length; i++) {
                const { price } = await srv.tx(req).run(SELECT.one().from(ProductCatalogue).where({ productID: orderLineItems[i].to_Product_productID }));
                orderLineItems[i].netPrice = price * orderLineItems[i].quantity;
                orderLineItems[i].unitPrice = price;
                const result = await srv.tx(req).run(UPDATE(OrderItems).set({ netPrice: price * orderLineItems[i].quantity, unitPrice: price }).where({ itemUUID: orderLineItems[i].itemUUID }));
            }
        }


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
         * Fill in defaults for new item when adding products to order.
         */
                this.before('CREATE', 'OrderItems', async (req) => {
                    console.log('  create before OrderItems called', req.data);
                    const { to_Order_orderUUID } = req.data
                    const { maxID } = await SELECT.one`max(itemID) as maxID`.from(OrderItems).where({ to_Order_orderUUID })
                    if (!maxID) req.data.itemID = 1
                    else
                        req.data.itemID = maxID + 1
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


        this.before('UPDATE', 'OrderItems', async (req) => {
            console.log('  update before OrderItems called');
            console.log(req.data);
            let newQuantity = 0;
            const { itemUUID } = req.data;
            console.log(await SELECT.one().from(OrderItems).where({ itemUUID }));
            const { to_Product_productID, quantity } = await SELECT.one().from(OrderItems).where({ itemUUID });
            const { price } = await SELECT.one().from(ProductCatalogue).where({ productID: to_Product_productID });
            if ('quantity' in req.data)
                newQuantity = req.data.quantity;
            else
                newQuantity = quantity;

            req.data.netPrice = price * newQuantity;
            req.data.unitPrice = price;
            //     return await cds.run(UPDATE(OrderItems).set({ netPrice: price * newQuantity, unitPrice: price }).where({ itemUUID: itemUUID }));

        });

        this.after('UPDATE', 'OrderItems', async (_, req) => {
            console.log('  update after OrderItems called');
            const { itemUUID } = req.data;
            const { to_Order_orderUUID } = await SELECT.one().from(OrderItems).where({ itemUUID });
            const { sum } = await SELECT.one`sum(netPrice) as sum`.from(OrderItems).where({ to_Order_orderUUID: to_Order_orderUUID })
            
            // console.log(sum);
            const discount = (sum * .03).toFixed(2) ;
            const tax = ((sum - discount) * 0.07).toFixed(2) ;           
            const totalAmount =  ( parseFloat(sum) + parseFloat(tax) - parseFloat(discount)).toFixed(2) ;
            // console.log( discount,tax, totalAmount);
            
            // add a value 6 months into future 
            const estimatedDeliveryDate = new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().slice(0, 10) // today

            // update total price on orders
            return await cds.run(UPDATE(Orders).set({ estimatedDeliveryDate: estimatedDeliveryDate, tax: tax, totalAmount: totalAmount, discount: discount }).where({ orderUUID: to_Order_orderUUID }))
            // 

        });



        this.after('UPDATE', 'OrderItems.drafts', async (_, req) => {
            console.log('  update items after handler called for draft')
            if ('quantity' in req.data) {
                const { itemUUID } = req.data;
                const { to_Product_productID } = await SELECT.one().from(OrderItems.drafts).where({ itemUUID });
                const { price } = await SELECT.one().from(ProductCatalogue).where({ productID: to_Product_productID });
                await cds.run(UPDATE(OrderItems.drafts).set({ netPrice: price * req.data.quantity, unitPrice: price }).where({ itemUUID: itemUUID }));
            }

            //update the total price and taxes after editing  items
            const {to_Order_orderUUID} = await SELECT.one().from(OrderItems.drafts).where({ itemUUID: req.data.itemUUID });
            const { sum } = await SELECT.one`sum(netPrice) as sum`.from(OrderItems.drafts).where({ to_Order_orderUUID: to_Order_orderUUID })
            // console.log(sum);
            // add a value 6 months into future 
            const estimatedDeliveryDate = new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().slice(0, 10) // today
            if( parseFloat(sum) > 0)
               {
            const discount = (sum * .03).toFixed(2) ;
            const tax = ((sum - discount) * 0.07).toFixed(2) ;           
            const totalAmount =  ( parseFloat(sum) + parseFloat(tax) - parseFloat(discount)).toFixed(2) ;
            return await cds.run(UPDATE(Orders).set({ estimatedDeliveryDate: estimatedDeliveryDate, tax: tax, totalAmount: totalAmount, discount: discount }).where({ orderUUID : to_Order_orderUUID}))
               }
               else {
                return await cds.run(UPDATE(Orders).set({ estimatedDeliveryDate: estimatedDeliveryDate, tax: 0.00, totalAmount: 0.00, discount: 0.00 }).where({ orderUUID : to_Order_orderUUID}))
               } 
        })

        this.before('UPDATE', 'Orders', async (req) => {
            console.log('  update orders >> before handler called')
            const { orderStatus } = await SELECT.one`orderStatus`.from(Orders).where({ orderUUID: req.data.orderUUID })
            if (orderStatus === 'C' || orderStatus === 'A') req.reject(403, 'Order cannot be updated')

            const { orderUUID } = req.data;
            const { sum } = await SELECT.one`sum(netPrice) as sum`.from(OrderItems).where({ to_Order_orderUUID: orderUUID })
            // console.log(sum);
            
            if( parseFloat(sum) > 0)
               {
            const discount = (sum * .03).toFixed(2) ;
            const tax = ((sum - discount) * 0.07).toFixed(2) ;           
            const totalAmount =  ( parseFloat(sum) + parseFloat(tax) - parseFloat(discount)).toFixed(2) ;
//            console.log( discount,tax, totalAmount);
            
            req.data.tax = tax;
            req.data.totalAmount = totalAmount;
            req.data.discount = discount;
               }

               else {
                req.data.tax = 0.00;
                req.data.totalAmount = 0.00;
                req.data.discount = 0.00;

               }

            // add a value 6 months into future 
            const estimatedDeliveryDate = new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().slice(0, 10) // today
            req.data.estimatedDeliveryDate = estimatedDeliveryDate;
            
        })

        // After items are deleted recalculate the order prices

        this.after('DELETE', "OrderItems.drafts", async (_, req) => {

            const {to_Order_orderUUID} = await SELECT.one().from(OrderItems.drafts).where({ itemUUID: req.data.itemUUID });
            const { sum } = await SELECT.one`sum(netPrice) as sum`.from(OrderItems.drafts).where({ to_Order_orderUUID: to_Order_orderUUID })
            // add a value 6 months into future 
            const estimatedDeliveryDate = new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().slice(0, 10) // today
            if( parseFloat(sum) > 0)
               {
            const discount = (sum * .03).toFixed(2) ;
            const tax = ((sum - discount) * 0.07).toFixed(2) ;           
            const totalAmount =  ( parseFloat(sum) + parseFloat(tax) - parseFloat(discount)).toFixed(2) ;
            return await cds.run(UPDATE(Orders).set({ estimatedDeliveryDate: estimatedDeliveryDate, tax: tax, totalAmount: totalAmount, discount: discount }).where({ orderUUID : to_Order_orderUUID}))
               }
               else {
                return await cds.run(UPDATE(Orders).set({ estimatedDeliveryDate: estimatedDeliveryDate, tax: 0.00, totalAmount: 0.00, discount: 0.00 }).where({ orderUUID : to_Order_orderUUID}))
               } 
        });


        // update to order
        this.after('UPDATE', 'Orders', async (_, req) => {
            const { orderStatus } = await SELECT.one`orderStatus`.from(Orders).where({ orderUUID: req.data.orderUUID })
            if (orderStatus === 'C' || orderStatus === 'A') req.reject(403, 'Order cannot be updated')

        })

        /**
         * Changes to  orders not allowed after approval or cancelled.
         */
        this.before('DELETE', 'Orders', async (req) => {
            console.log('  delete orders before handler called')
          //  console.log(req.data)
            const { orderStatus } = await SELECT.one`orderStatus`.from(Orders).where({ orderUUID: req.data.orderUUID })
            if (orderStatus === 'C' || orderStatus === 'A') req.reject(403, 'Order cannot be updated')



        })




        /**
     * Fill in primary keys and defaults for new order.
  
        */
        this.before('CREATE', 'OrderTemplate', async req => {
            const { maxID } = await SELECT.one`max(orderID) as maxID`.from(OrderTemplate)
            if (!maxID) req.data.orderID = 1
            else {
                req.data.orderID = maxID + 1
            }

        })


        /**
         * Fill in defaults for new item when editing order.
         */
        this.before('NEW', 'OrderTemplateItem.drafts', async (req) => {

            const { to_Order_orderUUID } = req.data
            const { maxID } = await SELECT.one`max(itemID) as maxID`.from(OrderTemplateItem).where({ to_Order_orderUUID })
            if (!maxID) req.data.itemID = 1
            else
                req.data.itemID = maxID + 1

        })



        this.after('UPDATE', 'OrderTemplateItem.drafts', async (_, req) => {
            if ('quantity' in req.data) {
                const { itemUUID } = req.data;
                const { to_Product_productID } = await SELECT.one().from(OrderTemplateItem.drafts).where({ itemUUID });
                const { price } = await SELECT.one().from(Product).where({ productID: to_Product_productID });
                return await cds.run(UPDATE(OrderTemplateItem.drafts).set({ netPrice: price * req.data.quantity, unitPrice: price }).where({ itemUUID: itemUUID }));

            }

        })



        this.after('UPDATE', 'OrderTemplate', async (_, req) => {
            const { orderUUID } = req.data;
            //       console.log(req.data);
            const { sum } = await SELECT.one`sum(netPrice) as sum`.from(OrderTemplateItem).where({ to_Order_orderUUID: orderUUID })
            //      console.log(sum);
            const discount = sum * .03;
            const total = sum - discount;
            //     console.log( discount,tax, total);

            // update total price on orders
            return await cds.run(UPDATE(OrderTemplate).set({ totalAmount: total.toFixed(2), discount: discount.toFixed(2) }).where({ orderUUID }))
            // 


        })


        this.on('createOrderByTemplate', async (req) => {

            const { orderUUID } = req.params[0];
            //   console.log(req.params);
            //    console.log(orderUUID);

        });


        this.on('addFromTemplateToOrder', async (req) => {

            const srv = await cds.connect.to('OrderService')
            const { orderUUID } = req.params[0];

            // Fetch the sales order to be copied
            const [salesOrder] = await SELECT.from(req.subject).where({ orderUUID: orderUUID });
            if (!salesOrder) throw new Error(`Sales order with UUID ${orderUUID} not found`);

            const salesOrderItems = await srv.tx(req).run(SELECT.from('OrderTemplateItem').where({ to_Order_orderUUID: orderUUID }));

            // Create a new sales order with the copied data
            const newSalesOrder = { ...salesOrder, orderUUID: cds.utils.uuid() };
            const newSalesOrderItems = salesOrderItems.map(item => ({
                ...item,
                itemUUID: cds.utils.uuid(),
                to_Order_orderUUID: newSalesOrder.orderUUID
            }));
            newSalesOrder.to_Customer_customerID = 28;



            await srv.tx(req).run(INSERT.into('Orders').entries(newSalesOrder));
            await srv.tx(req).run(INSERT.into('OrderItems').entries(newSalesOrderItems));
            await this._updateOrderLineItem(newSalesOrder.orderUUID, req, srv)


            const { sum } = await SELECT.one`sum(netPrice) as sum`.from(OrderItems).where({ to_Order_orderUUID: newSalesOrder.orderUUID })
            // console.log(sum);
            const discount = sum * .03;
            const tax = (sum - discount) * 0.07;
            const total = sum + tax - discount;
            await cds.run(UPDATE(Orders).set({ tax: tax.toFixed(2), totalAmount: total.toFixed(2), discount: discount.toFixed(2) }).where({ orderUUID: newSalesOrder.orderUUID }));


            req.info(`Added to order '${newSalesOrder.orderID}'`);

        });


        //add handler for Add to Order action
        this.on('addProductToOrder', async req => {
            // print the user
            console.log(req.user.id);
            const { productID } = req.params[0];
            const quantity = 1;
            const { price } = await SELECT.one().from(ProductCatalogue).where({ productID });
            const srv = await cds.connect.to('OrderService')

            // fetch order with status open for customer 28
            //select the latest order with status open for customer 28
            const [salesOrder] = await srv.tx(req).run(SELECT.from('Orders').where({ orderStatus_code: 'O', to_Customer_customerID: 28 }));
            //  console.log('salesOrder  ');
            //   console.log(salesOrder)

            let orderID = 0, itemID = 0, newSalesOrderItem = {}, newSalesOrder = {}, updSalesOrderItem = {};

            if (salesOrder) {
                console.log('order found');
                //  add the product as new order line item
                orderID = salesOrder.orderID;
                newSalesOrder = salesOrder;
                const { maxID } = await srv.tx(req).run(SELECT.one`max(itemID) as maxID`.from(OrderItems).where({ to_Order_orderUUID: salesOrder.orderUUID }));
                if (!maxID) itemID = 1
                else {
                    itemID = maxID + 1
                }

                // check if product already exists in order then add quantity
                const [chkorderItem] = await srv.tx(req).run(SELECT.from('OrderItems').where({ to_Order_orderUUID: salesOrder.orderUUID, to_Product_productID: productID }));
                if (chkorderItem && Object.keys(chkorderItem).length > 0) {
                    console.log('product quantity incremented to existing open order');
                    updSalesOrderItem = {
                        ...chkorderItem,
                        quantity: chkorderItem.quantity + quantity,
                        netPrice: (chkorderItem.quantity + quantity) * price
                    };
                }
                else {
                    console.log('new product added to existing open order : ' , itemID);
                    newSalesOrderItem = {
                        itemID : itemID,
                        quantity: quantity,
                        to_Product_productID: productID,
                        netPrice: quantity * price,
                        unitPrice: price,
                        currencyCode_code: 'USD',
                        itemUUID: cds.utils.uuid(),
                        to_Order_orderUUID: salesOrder.orderUUID
                    };
                }
            }
            else {
                console.log('order not found; new order created');
                // create a new order
                const { maxID } = await srv.tx(req).run(SELECT.one`max(orderID) as maxID`.from(Orders))
                if (!maxID) orderID = 1
                else {
                    orderID = maxID + 1
                }
                // Create a new sales order with the copied data
                newSalesOrder = {
                    orderUUID: cds.utils.uuid(),
                    orderID: orderID,
                    to_Customer_customerID: 28,
                    currencyCode_code: 'USD',
                    orderStatus_code: 'O',
                    orderDate: (new Date).toISOString().slice(0, 10)
                };

                await srv.tx(req).run(INSERT.into('Orders').entries(newSalesOrder));

                newSalesOrderItem = [{
                    itemID: 1,
                    quantity: quantity,
                    to_Product_productID: productID,
                    netPrice: quantity * price,
                    unitPrice: price,
                    currencyCode_code: 'USD',
                    itemUUID: cds.utils.uuid(),
                    to_Order_orderUUID: newSalesOrder.orderUUID,
                    itemUUID: cds.utils.uuid()
                }];
            }

            if (newSalesOrderItem && Object.keys(newSalesOrderItem).length > 0) {
                console.log('insert order item to persistense');
                await srv.tx(req).run(INSERT.into('OrderItems').entries(newSalesOrderItem));
                await srv.tx(req).run(UPDATE(OrderItems).set({ itemID : itemID, netPrice: price * newSalesOrderItem.quantity, unitPrice: price }).where({ itemUUID: newSalesOrderItem.itemUUID }));

            }
            else {
                console.log('update order item found to persistense');
                await srv.tx(req).run(UPDATE(OrderItems).set({ quantity: updSalesOrderItem.quantity, netPrice: updSalesOrderItem.netPrice }).where({ itemUUID: updSalesOrderItem.itemUUID }));
            }

            const { sum } = await srv.tx(req).run(SELECT.one`sum(netPrice) as sum`.from(OrderItems).where({ to_Order_orderUUID: newSalesOrderItem.to_Order_orderUUID }));
            const discount = sum * .03;
            const tax = (sum - discount) * 0.07;
            const total = sum + tax - discount;

            await cds.run(UPDATE(Orders).set({ tax: tax.toFixed(2), totalAmount: total.toFixed(2), discount: discount.toFixed(2) }).where({ orderUUID: newSalesOrderItem.to_Order_orderUUID }));
            // return a message order is added
            req.info(`Product added to order '${orderID}'`);

        })


        return super.init()
    }
};

class ProductService extends cds.ApplicationService {

    init() {

        /**
     * Reflect definitions from the service's CDS model
     */
        const { Products } = this.entities
/*
        this.before('CREATE', 'Products', async req => {
            const { maxID } = await SELECT.one`max(productID) as maxID`.from(Products)
            if (!maxID) req.data.productID = 1
            else {
                req.data.productID = maxID + 1
            }

        })
*/

        return super.init()
    }

};
class CustomerService extends cds.ApplicationService {

    init() {

        /**
    * Reflect definitions from the service's CDS model
    */
        const { Customers } = this.entities
/*
        this.before('CREATE', 'Customers', async req => {
            const { maxID } = await SELECT.one`max(customerID) as maxID`.from(Customers)
            if (!maxID) req.data.customerID = 1
            else {
                req.data.customerID = maxID + 1
            }

        })
*/

        return super.init()
    }

};

module.exports = { OrderService, CustomerService, ProductService }
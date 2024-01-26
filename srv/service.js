const cds = require("@sap/cds/libx/_runtime/cds")

class OrderService extends cds.ApplicationService {

    init() {

        const CUSTOMER = 100010002;
         

        const cat1 = ['B7B-14611-00-00','BB5-E4611-01-00','BD3-E4611-00-00'];
        const cat2 = ['BHR-24110-00-00','BD3-F4110-10-00','BB5-F4110-01-00'];
        const cat3 = ['GYT-5PA35-10-AL'];
    /**
     * Reflect definitions from the service's CDS model
     */
        const { Orders, OrderItems, Product, OrderTemplate, OrderTemplateItem, ProductCatalogue } = this.entities

 

        // create a function to update unit price and net price for order line items using uuid

        this._updateOrderLineItem = async function (orderUUID, req, srv) {
            console.log('Order service : line item net price update')
            const orderLineItems = await srv.tx(req).run(SELECT.from('OrderItems').where({ to_Order_orderUUID: orderUUID }));
            for (let i = 0; i < orderLineItems.length; i++) {
                const { price } = await srv.tx(req).run(SELECT.one().from(ProductCatalogue).where({ productID: orderLineItems[i].to_Product_productID }));
                orderLineItems[i].netPrice = price * orderLineItems[i].quantity;
                orderLineItems[i].unitPrice = price;
             //   console.log(  orderLineItems[i]);
                const result = await srv.tx(req).run(UPDATE(OrderItems).set({ netPrice: price * orderLineItems[i].quantity, unitPrice: price }).where({ itemUUID: orderLineItems[i].itemUUID }));
            }
        }


        /**
     * Fill in primary keys and defaults for new order.
  
        */
        this.before('CREATE', 'Orders', async req => {
            console.log('OrderService: before create handler >> Orders');
            console.log(req.data);
            const { maxID } = await SELECT.one`max(orderID) as maxID`.from(Orders)
            if (!maxID) req.data.orderID = 1
            else {
                req.data.orderID = maxID + 1
            }
            req.data.orderStatus_code = 'O'
            req.data.orderDate = (new Date).toISOString().slice(0, 10) // today
            req.data.orderedBy  = req.user.id;

        });
         /**
            * Fill in net line total after items in draft are added for a new order
  
        */
         this.after('CREATE', 'Orders',  async (_, req) => {
            console.log('OrderService: after create handler >> Orders');
            console.log(req.data);
  
            const { orderUUID } = req.data;
            const max =   await SELECT.one`count(*) as max`.from(OrderItems.drafts).where({ to_order_orderUUID: orderUUID }); 
            // update total if atleast on draft item is present
            if (max > 1) {
                const { sum } = await SELECT.one`sum(netPrice) as sum`.from(OrderItems.drafts).where({ to_Order_orderUUID: orderUUID })
                console.log(sum);
                const discount = (sum * .03).toFixed(2) ;
                const tax = ((sum - discount) * 0.07).toFixed(2) ;           
                const totalAmount =  ( parseFloat(sum) + parseFloat(tax) - parseFloat(discount)).toFixed(2) ;
                console.log( discount,tax, parseFloat(totalAmount));
                
                // add a value 6 months into future 
                const estimatedDeliveryDate = new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().slice(0, 10) // today
                return await cds.run(UPDATE(Orders).set({ estimatedDeliveryDate: estimatedDeliveryDate, tax: tax, totalAmount: totalAmount, discount: discount }).where({ orderUUID: orderUUID }))
            }
        });

        /**
         * Fill in defaults for new item when adding products to order.
         */
                this.before('CREATE', 'OrderItems', async (req) => {
                    console.log('OrderService: before create handler >> OrderItems');
                    console.log(req.data);
                    const { to_Order_orderUUID } = req.data
                    const { maxID } = await SELECT.one`max(itemID) as maxID`.from(OrderItems).where({ to_Order_orderUUID })
                    if (!maxID) req.data.itemID = 1
                    else
                        req.data.itemID = maxID + 1
                })

        /**
         * Fill in net price for new item when adding products to order.
         */
          this.after('CREATE', 'OrderItems',  async (_, req) => {
            
            console.log('OrderService: after create handler >> OrderItems');
            const { itemUUID } = req.data; 
            const { to_Product_productID, quantity } = await SELECT.one().from(OrderItems).where({ itemUUID });
            const { price } = await SELECT.one().from(ProductCatalogue).where({ productID: to_Product_productID });
            await cds.run(UPDATE(OrderItems).set({ netPrice: price * quantity, unitPrice: price }).where({ itemUUID: itemUUID }));
        
        
            // update the order header after new item is added

            const { to_Order_orderUUID } = await SELECT.one().from(OrderItems).where({ itemUUID });
            console.log(to_Order_orderUUID);
            const { sum } = await SELECT.one`sum(netPrice) as sum`.from(OrderItems).where({ to_Order_orderUUID: to_Order_orderUUID })
            console.log(sum);
            const discount = (sum * .03).toFixed(2) ;
            const tax = ((sum - discount) * 0.07).toFixed(2) ;           
            const totalAmount =  ( parseFloat(sum) + parseFloat(tax) - parseFloat(discount)).toFixed(2) ;
            console.log( discount,tax, parseFloat(totalAmount));
            
            // add a value 6 months into future 
            const estimatedDeliveryDate = new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().slice(0, 10) // today
            return await cds.run(UPDATE(Orders).set({ estimatedDeliveryDate: estimatedDeliveryDate, tax: tax, totalAmount: totalAmount, discount: discount }).where({ orderUUID: to_Order_orderUUID }))
        
        })
    
                    

        /**
         * Fill in defaults for new item when editing order.
         */
        this.before('NEW', 'OrderItems.drafts', async (req) => {
            console.log('OrderService: before new handler >> OrderItems drafts');
            const { to_Order_orderUUID } = req.data
            const { maxID } = await SELECT.one`max(itemID) as maxID`.from(OrderItems).where({ to_Order_orderUUID })
            if (!maxID) req.data.itemID = 1
            else
                req.data.itemID = maxID + 1
        })


        this.before('UPDATE', 'OrderItems', async (req) => {
            console.log('OrderService: before update handler >> OrderItems');
            let newQuantity = 0;
            const { itemUUID } = req.data;
          //  console.log(await SELECT.one().from(OrderItems).where({ itemUUID }));
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
            console.log('OrderService: after update handler >> OrderItems');
            const { itemUUID } = req.data;
            const { to_Order_orderUUID } = await SELECT.one().from(OrderItems).where({ itemUUID });
            console.log(to_Order_orderUUID);
            const { sum } = await SELECT.one`sum(netPrice) as sum`.from(OrderItems).where({ to_Order_orderUUID: to_Order_orderUUID })
            console.log(sum);
            const discount = (sum * .03).toFixed(2) ;
            const tax = ((sum - discount) * 0.07).toFixed(2) ;           
            const totalAmount =  ( parseFloat(sum) + parseFloat(tax) - parseFloat(discount)).toFixed(2) ;
            console.log( discount,tax, parseFloat(totalAmount));
            
            // add a value 6 months into future 
            const estimatedDeliveryDate = new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().slice(0, 10) // today

            // update total price on orders
          //  return await cds.run(UPDATE(Orders).set({ estimatedDeliveryDate: estimatedDeliveryDate, tax: tax, discount: discount }).where({ orderUUID: to_Order_orderUUID }))
            return await cds.run(UPDATE(Orders).set({ estimatedDeliveryDate: estimatedDeliveryDate, tax: tax, totalAmount: totalAmount, discount: discount }).where({ orderUUID: to_Order_orderUUID }))
          
            // 

        });



        this.after('UPDATE', 'OrderItems.drafts', async (_, req) => { 
            console.log('OrderService: after update handler >> OrderItems drafts');
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
            return await cds.run(UPDATE(Orders).set({ estimatedDeliveryDate: estimatedDeliveryDate, tax: tax, totalAmount: parseFloat(totalAmount), discount: discount }).where({ orderUUID : to_Order_orderUUID}))
               }
               else {
                return await cds.run(UPDATE(Orders).set({ estimatedDeliveryDate: estimatedDeliveryDate, tax: 0.00, totalAmount: 0.00, discount: 0.00 }).where({ orderUUID : to_Order_orderUUID}))
               } 
        })

        this.before('UPDATE', 'Orders', async (req) => {
            console.log('OrderService: before update handler >> Orders');
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

            console.log('OrderService: after delete  handler >> OrderItems drafts');
            // check if any items are present in draft
            const max =   await SELECT.one`count(*) as max`.from(OrderItems.drafts).where({ itemUUID: req.data.itemUUID }); 
           if (max > 1) {
               const {to_Order_orderUUID} = await SELECT.one().from(OrderItems.drafts).where({ itemUUID: req.data.itemUUID }); 
               const { sum } = await SELECT.one`sum(netPrice) as sum`.from(OrderItems.drafts).where({ to_Order_orderUUID: to_Order_orderUUID })
               console.log(sum);
               const discount = (sum * .03).toFixed(2) ;
               const tax = ((sum - discount) * 0.07).toFixed(2) ;           
               const totalAmount =  ( parseFloat(sum) + parseFloat(tax) - parseFloat(discount)).toFixed(2) ;
               return await cds.run(UPDATE(Orders).set({ tax: tax, totalAmount:  parseFloat(totalAmount), discount: discount }).where({ orderUUID : to_Order_orderUUID}))
              
            }
           else    
            { 
                try {
               const {to_Order_orderUUID} = await SELECT.one().from(OrderItems).where({ itemUUID: req.data.itemUUID }); 
              return await cds.run(UPDATE(Orders).set({  totalAmount:0.00, tax: 0.00, totalAmount: 0.00, discount: 0.00 }).where({ orderUUID : to_Order_orderUUID}))
            }
            catch(err) {
                    console.log('to_Order_orderUUID not defined ' );
            }
            } 
        });



        // update to order
        this.after('UPDATE', 'Orders', async (_, req) => {
          // console.log(req.data);
           const { orderUUID }  = req.data;
            console.log('OrderService: after update  handler >> Orders');
            const { orderStatus } = await SELECT.one`orderStatus`.from(Orders).where({ orderUUID: req.data.orderUUID })
            if (orderStatus === 'C' || orderStatus === 'A') req.reject(403, 'Order cannot be updated')
       /*
                let  suggestedItems = [] ;
                    const tx = cds.transaction(req);
                    const orderItems = await tx.run( SELECT.from(OrderItems).where({ to_Order_orderUUID: orderUUID }));
                    const productIDs = orderItems.map(item => item.to_Product_productID);
                    console.log(productIDs);
  
                    let commonProductIds = productIDs.filter(productId => cat1.includes(productId) || cat2.includes(productId) || cat3.includes(productId));

                    commonProductIds.forEach(productId => {
                        console.log(productId)
                        if (cat1.includes(productId)) {
                   //     suggestedItems.push('EXHAUST PIPE ASSY 1(2BS-14610-00-00), EXHAUST PIPE ASSY(1TP-14610-10-00)');
                            if(!productIDs.includes('2BS-14610-00-00'))
                            suggestedItems.push('EXHAUST PIPE ASSY 1');
                        } 
                        else if (cat2.includes(productId)) {

                            if(!productIDs.includes('BP6-Y2410-01-X8'))
                            //suggestedItems.push('FUEL TANK COMP. - BMC(BEA-Y2410-00-01), FUEL TANK COMP. - DNMG(23P-YK241-01-PC), FUEL TANK COMP. - PGD(BP6-Y2410-01-X8)');
                            suggestedItems.push('FUEL TANK COMP. - PGD');
                        }
                        else if (cat3.includes(productId)) {
                            //suggestedItems.push('FUEL TANK COMP. - BMC(BEA-Y2410-00-01), FUEL TANK COMP. - DNMG(23P-YK241-01-PC), FUEL TANK COMP. - PGD(BP6-Y2410-01-X8)');
                            if(!productIDs.includes('GYT-5PA56-20-00'))
                            suggestedItems.push('GYTR Clutch Pressure Plate');
                        }
                    });
                   if (suggestedItems.length > 0 )
                    {
                        console.log( suggestedItems.length ) ;
                        console.log('inside loop');
                        req.info(`Order saved. \n Suggested product(s) to add : \n ${ suggestedItems.join('\n')} `); 
                    } */
                  //  let string = suggestedItems.join('\n');
                     

 
        })

        /**
         * Changes to  orders not allowed after approval or cancelled.
         */
        this.before('DELETE', 'Orders', async (req) => {
            console.log('OrderService: before delete handler >> Orders');
            const srv = await cds.connect.to('OrderService')
            const { orderStatus_code } = await srv.tx(req).run(SELECT.one`orderStatus_code`.from(Orders).where({ orderUUID: req.data.orderUUID }))
            if (orderStatus_code === 'C' || orderStatus_code === 'A') 
                req.reject(403, 'Order cannot be deleted if its approved or cancelled');
        })


        this.on('autoSuggestion', async (req) => {
            console.log('OrderService: autoSuggestion handler'); 
            const srv = await cds.connect.to('OrderService')

         //   const draft = await cds.connect.to('Draft')
            console.log(req.params);
            const { orderUUID } = req.params[0];
            // retrieve the order status from order
            const { orderStatus_code } = await srv.tx(req).run(SELECT.one`orderStatus_code`.from(Orders).where({ orderUUID: orderUUID }))
            if (orderStatus_code === 'C' || orderStatus_code === 'A') 
                req.reject(403, 'Order cannot be updated if its approved or cancelled');

            const newItems = await this._addSuggestedOrderLineItem(orderUUID, req, srv)
            const newItemsDraft = await this._addSuggestedOrderLineItemFromDraft(orderUUID, req, srv)
        
            if(newItems.length > 0  || newItemsDraft.length > 0) {
                for (let i = 0; i < newItems.length; i++) {
                    console.log(newItems[i]);
                    await srv.tx(req).run(INSERT.into('OrderItems').entries(newItems[i]));
                }
          
                for (let i = 0; i < newItemsDraft.length; i++) {

                    let record = {...newItemsDraft[i], DraftAdministrativeData_DraftUUID : cds.utils.uuid()};
                    console.log(record);

                    await srv.tx(req).run(INSERT.into('OrderItems.Drafts').entries(record));
                }
                    
                let mergedItems = [...newItems, ...newItemsDraft];

            req.info(`${ mergedItems.length } AI recommendation(s) added to the order`); 
            }
            else  
            req.info(`No products for AI recommendation at the moment`); 
        });

        this._addSuggestedOrderLineItem = async function (orderUUID, req, srv) {
            
            const tx = cds.transaction(req);
            const orderItems = await tx.run( SELECT.from(OrderItems).where({ to_Order_orderUUID: orderUUID }));
            const itemIDs = orderItems.map(item => item.itemID);
            const productIDs = orderItems.map(item => item.to_Product_productID);
            const base = {  to_Order_orderUUID:orderUUID, quantity : parseInt(1), autoSuggested : true};
            
            let suggestedItems = [] ;
            let maxItemID = Math.max(...itemIDs);
            let commonProductIds = productIDs.filter(productId => cat1.includes(productId) || cat2.includes(productId) || cat3.includes(productId));
            
            //construct the data for new line items as per suggested  model
            commonProductIds.forEach(productId => {
                console.log(productId);
                        
                if ((cat1.includes(productId)) && (!productIDs.includes('2BS-14610-00-00')) ) 
                {
                   //     suggestedItems.push('EXHAUST PIPE ASSY 1(2BS-14610-00-00), EXHAUST PIPE ASSY(1TP-14610-10-00)');
                    maxItemID++;
                    suggestedItems.push({ ...base, itemUUID: cds.utils.uuid(),itemID : parseInt(maxItemID), to_Product_productID : '2BS-14610-00-00' }); //EXHAUST PIPE ASSY 1
                } 

                else if ((cat2.includes(productId)) && (!productIDs.includes('BP6-Y2410-01-X8')) )
                {
                    maxItemID++;
                    suggestedItems.push({ ...base,  itemUUID: cds.utils.uuid(),itemID : parseInt(maxItemID),to_Product_productID : 'BP6-Y2410-01-X8'}); //FUEL TANK COMP. - PGD
                }
                    //suggestedItems.push('FUEL TANK COMP. - BMC(BEA-Y2410-00-01), FUEL TANK COMP. - DNMG(23P-YK241-01-PC), FUEL TANK COMP. - PGD(BP6-Y2410-01-X8)');                
                else if ((cat3.includes(productId)) && (!productIDs.includes('GYT-5PA56-20-00')) )
                {
                    //suggestedItems.push('FUEL TANK COMP. - BMC(BEA-Y2410-00-01), FUEL TANK COMP. - DNMG(23P-YK241-01-PC), FUEL TANK COMP. - PGD(BP6-Y2410-01-X8)');
                    maxItemID++;
                    suggestedItems.push({  ...base,  itemUUID: cds.utils.uuid(), itemID : parseInt(maxItemID),to_Product_productID : 'GYT-5PA56-20-00'}); //GYTR Clutch Pressure Plate
                }
            })
            console.log('from new records /n ' , suggestedItems)
            return suggestedItems;
        } 


        this._addSuggestedOrderLineItemFromDraft = async function (orderUUID, req, srv) {
            
            const tx = cds.transaction(req);
            const orderItems = await tx.run( SELECT.from(OrderItems.drafts).where({ to_Order_orderUUID: orderUUID }));
            const itemIDs = orderItems.map(item => item.itemID);
            const productIDs = orderItems.map(item => item.to_Product_productID);
            const base = {  to_Order_orderUUID:orderUUID, quantity : parseInt(1), autoSuggested : true,  IsActiveEntity: false,
                HasActiveEntity: false,
                HasDraftEntity: false
            };
            
            let suggestedItems = [] ;
            let maxItemID = Math.max(...itemIDs);
            let commonProductIds = productIDs.filter(productId => cat1.includes(productId) || cat2.includes(productId) || cat3.includes(productId));
            
            //construct the data for new line items as per suggested  model
            commonProductIds.forEach(productId => {
                console.log(productId);
                        
                if ((cat1.includes(productId)) && (!productIDs.includes('2BS-14610-00-00')) ) 
                {
                   //     suggestedItems.push('EXHAUST PIPE ASSY 1(2BS-14610-00-00), EXHAUST PIPE ASSY(1TP-14610-10-00)');
                    maxItemID++;
                    suggestedItems.push({ ...base,  itemUUID: cds.utils.uuid(),  itemID : parseInt(maxItemID), to_Product_productID : '2BS-14610-00-00' }); //EXHAUST PIPE ASSY 1
                } 

                else if ((cat2.includes(productId)) && (!productIDs.includes('BP6-Y2410-01-X8')) )
                {
                    maxItemID++;
                    suggestedItems.push({ ...base,  itemUUID: cds.utils.uuid(), itemID : parseInt(maxItemID),to_Product_productID : 'BP6-Y2410-01-X8'}); //FUEL TANK COMP. - PGD
                }
                    //suggestedItems.push('FUEL TANK COMP. - BMC(BEA-Y2410-00-01), FUEL TANK COMP. - DNMG(23P-YK241-01-PC), FUEL TANK COMP. - PGD(BP6-Y2410-01-X8)');                
                else if ((cat3.includes(productId)) && (!productIDs.includes('GYT-5PA56-20-00')) )
                {
                    //suggestedItems.push('FUEL TANK COMP. - BMC(BEA-Y2410-00-01), FUEL TANK COMP. - DNMG(23P-YK241-01-PC), FUEL TANK COMP. - PGD(BP6-Y2410-01-X8)');
                    maxItemID++;
                    suggestedItems.push({  ...base, itemUUID: cds.utils.uuid(), itemID : parseInt(maxItemID),to_Product_productID : 'GYT-5PA56-20-00'}); //GYTR Clutch Pressure Plate
                }
            })
            console.log(`from drafts /n` , suggestedItems)
            return suggestedItems;
        } 

        this.on('confirmOrder', async (req) => {
            console.log('OrderService: confirmOrder handler'); 
            const srv = await cds.connect.to('OrderService')
            console.log(req.params);
            const { orderUUID } = req.params[0];
            const {orderID}= await  srv.tx(req).run(SELECT.one().from('Orders').where({ orderUUID: orderUUID }));
            await cds.run(UPDATE(Orders).set({ orderStatus_code:'A'}).where({ orderUUID: orderUUID }));
            req.info(`Order '${orderID}' successfully submitted for processing`);
        });

        this.on('addFromTemplateToOrder', async (req) => {
            console.log('OrderService: addFromTemplateToOrder handler');
            const srv = await cds.connect.to('OrderService')
            const { orderUUID } = req.params[0];

            // Fetch the purchase order to be copied
            const [purchaseOrder] = await SELECT.from(req.subject).where({ orderUUID: orderUUID });
            if (!purchaseOrder) throw new Error(`Sales order with UUID ${orderUUID} not found`);

            const purchaseOrderItems = await srv.tx(req).run(SELECT.from('OrderTemplateItem').where({ to_Order_orderUUID: orderUUID }));

            // Create a new  purchase order with the copied data
            const newpurchaseOrder = { ...purchaseOrder, orderUUID: cds.utils.uuid() };
      
          //string to float
          newpurchaseOrder.discount = parseFloat(newpurchaseOrder.discount);
          newpurchaseOrder.tax = parseFloat(newpurchaseOrder.tax);
          newpurchaseOrder.totalAmount = parseFloat(newpurchaseOrder.totalAmount);

            const newpurchaseOrderItems = purchaseOrderItems.map(item => ({
                ...item,
                itemUUID: cds.utils.uuid(),
                to_Order_orderUUID: newpurchaseOrder.orderUUID,
                netPrice : (parseFloat(item.unitPrice) * parseFloat(item.quantity)).toFixed(2),
                unitPrice : parseFloat(item.unitPrice)

            }));
            newpurchaseOrder.to_Customer_customerID = CUSTOMER;
            newpurchaseOrder.orderNotes = `Copied from template ${purchaseOrder.orderID}`;



            await srv.tx(req).run(INSERT.into('Orders').entries(newpurchaseOrder));

              //insert each item of newpurchaseOrderItems to OrderItems
              for (let i = 0; i < newpurchaseOrderItems.length; i++) {
                await srv.tx(req).run(INSERT.into('OrderItems').entries(newpurchaseOrderItems[i]));
            }

            req.info(`Added to order '${newpurchaseOrder.orderID}'`);

        });


        //add handler for Add to Order action
        this.on('addProductToOrder', async req => {

            console.log('OrderService: addProductToOrder handler');
            // print the user
            console.log(req.user.id);
            const { productID } = req.params[0];
            const quantity = 1;
            const { price } = await SELECT.one().from(ProductCatalogue).where({ productID });
            const srv = await cds.connect.to('OrderService')


            const [purchaseOrder] = await srv.tx(req).run(SELECT.from('Orders').where({ orderStatus_code: 'O', to_Customer_customerID: CUSTOMER }));
            let orderID = 0, itemID = 0, newpurchaseOrderItem = {}, newpurchaseOrder = {}, updpurchaseOrderItem = {};

            if (purchaseOrder) {
                console.log('order found');
                //  add the product as new order line item
                orderID = purchaseOrder.orderID;
                newpurchaseOrder = purchaseOrder;
                const { maxID } = await SELECT.one`max(itemID) as maxID`.from(OrderItems).where({ to_Order_orderUUID: purchaseOrder.orderUUID });                
             //   const { maxID } = await srv.tx(req).run(SELECT.one`max(itemID) as maxID`.from(OrderItems).where({ to_Order_orderUUID: purchaseOrder.orderUUID }));
                 console.log(maxID)
                
                 if (!maxID) itemID = 1
                else {
                    itemID = maxID + 1
                }

                // check if product already exists in order then add quantity
                const [chkorderItem] = await srv.tx(req).run(SELECT.from('OrderItems').where({ to_Order_orderUUID: purchaseOrder.orderUUID, to_Product_productID: productID }));
                if (chkorderItem && Object.keys(chkorderItem).length > 0) {
                    console.log('product quantity incremented to existing open order');
                    updpurchaseOrderItem = {
                        ...chkorderItem,
                        quantity: chkorderItem.quantity + quantity,
                        netPrice: (chkorderItem.quantity + quantity) * price
                    };
                }
                else {
                    console.log('new product added to existing open order : ' , itemID);
                    newpurchaseOrderItem = {
                        itemID : itemID,
                        quantity: quantity,
                        to_Product_productID: productID,
                        netPrice: quantity * price,
                        unitPrice: price,
                        currencyCode_code: 'USD',
                        itemUUID: cds.utils.uuid(),
                        to_Order_orderUUID: purchaseOrder.orderUUID
                    };
                }
            }
            else {
                console.log('order not found; new order created');
                // create a new order
                  const { maxID } = await SELECT.one`max(orderID) as maxID`.from(Orders);
                // console.log(maxID)
                if (!maxID) orderID = 1
                else {
                    orderID = maxID + 1
                }
                // Create a new sales order with the copied data
                newpurchaseOrder = {
                    orderUUID: cds.utils.uuid(),
                    orderID: orderID,
                    to_Customer_customerID: CUSTOMER,
                    currencyCode_code: 'USD',
                    orderStatus_code: 'O',
                    orderDate: (new Date).toISOString().slice(0, 10)
                };

                await srv.tx(req).run(INSERT.into('Orders').entries(newpurchaseOrder));

                newpurchaseOrderItem = [{
                    itemUUID: cds.utils.uuid(),
                    itemID: 1,
                    quantity: quantity,
                    to_Product_productID: productID,
                    netPrice: quantity * price,
                    unitPrice: price,
                    currencyCode_code: 'USD',
                    itemUUID: cds.utils.uuid(),
                    to_Order_orderUUID: newpurchaseOrder.orderUUID,
                    itemUUID: cds.utils.uuid()
                }];
            }

            if (newpurchaseOrderItem && Object.keys(newpurchaseOrderItem).length > 0) {
                console.log('insert order item to persistense');
           //     await srv.tx(req).run(INSERT.into('OrderItems').entries(newpurchaseOrderItem[0]));

                await srv.tx(req).run(INSERT.into('OrderItems').entries(newpurchaseOrderItem));
             //   await srv.tx(req).run(UPDATE(OrderItems).set({ netPrice: price * newpurchaseOrderItem.quantity, unitPrice: price }).where({ itemUUID: newpurchaseOrderItem[0].itemUUID }));

            }
            else {
                console.log('update order item found to persistense');
                await srv.tx(req).run(UPDATE(OrderItems).set({ quantity: updpurchaseOrderItem.quantity, netPrice: updpurchaseOrderItem.netPrice }).where({ itemUUID: updpurchaseOrderItem.itemUUID }));
            }


           // return a message order is added
            req.info(`Product added to order '${orderID}'`);

        })

             
        /**
     * Fill in primary keys and defaults for new order.
  
        */
        this.before('CREATE', 'OrderTemplate', async req => {
            console.log('before handler >> orderTemplate');
            const { maxID } = await SELECT.one`max(orderID) as maxID`.from(OrderTemplate)
            if (!maxID) req.data.orderID = 1
            else {
                req.data.orderID = maxID + 1
            }

        })

                /**
         * Fill in defaults for new item when adding products to order.
         */
                this.before('CREATE', 'OrderTemplateItem', async (req) => {
                    console.log('before handler >> orderTemplate Item');
                    console.log('  create before OrderTemplateItem called', req.data);
                    const { to_Order_orderUUID } = req.data
                    const { maxID } = await SELECT.one`max(itemID) as maxID`.from(OrderTemplateItem).where({ to_Order_orderUUID })
                    if (!maxID) req.data.itemID = 1
                    else
                        req.data.itemID = maxID + 1
                })

                
        /**
         * Fill in defaults for new item when editing order.
         */
        this.before('NEW', 'OrderTemplateItem.drafts', async (req) => {
            console.log('New handler >> orderTemplateItem drafts');
            const { to_Order_orderUUID } = req.data
            const { maxID } = await SELECT.one`max(itemID) as maxID`.from(OrderTemplateItem).where({ to_Order_orderUUID })
            if (!maxID) req.data.itemID = 1
            else
                req.data.itemID = maxID + 1

        })


        this.before(['PATCH','UPDATE'], 'OrderTemplateItem', async (req) => {
            console.log('  update before OrderTemplateItem called');
            console.log(req.data);
            let newQuantity = 0;
            const { itemUUID } = req.data;
            console.log(await SELECT.one().from(OrderTemplateItem).where({ itemUUID }));
            const { to_Product_productID, quantity } = await SELECT.one().from(OrderTemplateItem).where({ itemUUID });
            const { price } = await SELECT.one().from(Products).where({ productID: to_Product_productID });
            if ('quantity' in req.data)
                newQuantity = req.data.quantity;
            else
                newQuantity = quantity;

            req.data.netPrice = price * newQuantity;
            req.data.unitPrice = price;
            //     return await cds.run(UPDATE(OrderItems).set({ netPrice: price * newQuantity, unitPrice: price }).where({ itemUUID: itemUUID }));

        });

        this.after(['PATCH','UPDATE'],  'OrderTemplateItem', async (_, req) => {
            console.log('  update after OrderTemplateItem called');
            const { itemUUID } = req.data;
            const { to_Order_orderUUID } = await SELECT.one().from(OrderTemplateItem).where({ itemUUID });
            const { sum } = await SELECT.one`sum(netPrice) as sum`.from(OrderTemplateItem).where({ to_Order_orderUUID: to_Order_orderUUID })
            
            // console.log(sum);
            const discount = (sum * .03).toFixed(2) ;
            const tax = ((sum - discount) * 0.07).toFixed(2) ;           
            const totalAmount =  ( parseFloat(sum) + parseFloat(tax) - parseFloat(discount)).toFixed(2) ;
            // console.log( discount,tax, totalAmount);
 
            // update total price on orders
            return await cds.run(UPDATE(OrderTemplate).set({  tax: tax, totalAmount: totalAmount, discount: discount }).where({ orderUUID: to_Order_orderUUID }))
            // 

        });


        this.after(['PATCH','UPDATE'], 'OrderTemplateItem.drafts', async (_, req) => {
            console.log('after handler >> orderTemplateItem drafts');
            if ('quantity' in req.data) {
                const { itemUUID } = req.data;
                const { to_Product_productID } = await SELECT.one().from(OrderTemplateItem.drafts).where({ itemUUID });
                const { price } = await SELECT.one().from(Products).where({ productID: to_Product_productID });
                await cds.run(UPDATE(OrderTemplateItem.drafts).set({ netPrice: price * req.data.quantity, unitPrice: price }).where({ itemUUID: itemUUID }));

            }

            //update the total price and taxes after editing  items
            const {to_Order_orderUUID} = await SELECT.one().from(OrderTemplateItem.drafts).where({ itemUUID: req.data.itemUUID });
            const { sum } = await SELECT.one`sum(netPrice) as sum`.from(OrderTemplateItem.drafts).where({ to_Order_orderUUID: to_Order_orderUUID })
             console.log(sum);
            // add a value 6 months into future 
               if( parseFloat(sum) > 0)
               {
            const discount = (sum * .03).toFixed(2) ;
            const tax = ((sum - discount) * 0.07).toFixed(2) ;           
            const totalAmount =  ( parseFloat(sum) + parseFloat(tax) - parseFloat(discount)).toFixed(2) ;
            return await cds.run(UPDATE(OrderTemplate).set({  tax: tax, totalAmount: totalAmount, discount: discount }).where({ orderUUID : to_Order_orderUUID}))
               }
               else {
                return await cds.run(UPDATE(OrderTemplate).set({  tax: 0.00, totalAmount: 0.00, discount: 0.00 }).where({ orderUUID : to_Order_orderUUID}))
               } 
        })


        this.before(['PATCH','UPDATE'], 'OrderTemplate', async (req) => {
            console.log('  update OrderTemplate >> before handler called')
            const { orderStatus } = await SELECT.one`orderStatus`.from(OrderTemplate).where({ orderUUID: req.data.orderUUID })
            if (orderStatus === 'C' || orderStatus === 'A') req.reject(403, 'Order cannot be updated')

            const { orderUUID } = req.data;
            const { sum } = await SELECT.one`sum(netPrice) as sum`.from(OrderTemplateItem).where({ to_Order_orderUUID: orderUUID })
             console.log(sum);
            
            if( parseFloat(sum) > 0)
               {
            const discount = (sum * .03).toFixed(2) ;
            const tax = ((sum - discount) * 0.07).toFixed(2) ;           
            const totalAmount =  ( parseFloat(sum) + parseFloat(tax) - parseFloat(discount)).toFixed(2) ;
            console.log( discount,tax, totalAmount);
            
            req.data.tax = tax;
            req.data.totalAmount = totalAmount;
            req.data.discount = discount;
               }

               else {
                req.data.tax = 0.00;
                req.data.totalAmount = 0.00;
                req.data.discount = 0.00;

               }
  
        })

                // After items are deleted recalculate the order prices

                this.after('DELETE', "OrderTemplateItem.drafts", async (_, req) => {

                    const {to_Order_orderUUID} = await SELECT.one().from(OrderTemplateItem.drafts).where({ itemUUID: req.data.itemUUID });
                    const { sum } = await SELECT.one`sum(netPrice) as sum`.from(OrderTemplateItem.drafts).where({ to_Order_orderUUID: to_Order_orderUUID })
                    console.log(sum);
                   if( parseFloat(sum) > 0)
                       {
                    const discount = (sum * .03).toFixed(2) ;
                    const tax = ((sum - discount) * 0.07).toFixed(2) ;           
                    const totalAmount =  ( parseFloat(sum) + parseFloat(tax) - parseFloat(discount)).toFixed(2) ;
                    return await cds.run(UPDATE(Orders).set({ tax: tax, totalAmount: totalAmount, discount: discount }).where({ orderUUID : to_Order_orderUUID}))
                       }
                       else {
                        return await cds.run(UPDATE(Orders).set({   tax: 0.00, totalAmount: 0.00, discount: 0.00 }).where({ orderUUID : to_Order_orderUUID}))
                       } 
                });
        


        this.after(['PATCH','UPDATE'],'OrderTemplate', async (_, req) => {
            const { orderUUID } = req.data;
            //       console.log(req.data);
            const { sum } = await SELECT.one`sum(netPrice) as sum`.from(OrderTemplateItem).where({ to_Order_orderUUID: orderUUID })
                  console.log(sum);
            const discount = sum * .03;
            const total = sum - discount;
            //     console.log( discount,tax, total);

            // update total price on orders
            return await cds.run(UPDATE(OrderTemplate).set({ totalAmount: total.toFixed(2), discount: discount.toFixed(2) }).where({ orderUUID }))
            // 


        })


        this.on('createOrderByTemplate', async (req) => {


            const srv = await cds.connect.to('OrderService')
            const { orderUUID } = req.params[0];

            // Fetch the purchase order to be copied
            const [purchaseOrder] = await SELECT.from(req.subject).where({ orderUUID: orderUUID });
            if (!purchaseOrder) throw new Error(`order with UUID ${orderUUID} not found`);

            const purchaseOrderItems = await srv.tx(req).run(SELECT.from('OrderTemplateItem').where({ to_Order_orderUUID: orderUUID }));

            // Create a new  purchase order with the copied data
            const newpurchaseOrder = { ...purchaseOrder, orderUUID: cds.utils.uuid() };
            const newpurchaseOrderItems = purchaseOrderItems.map(item => ({
                ...item,
                itemUUID: cds.utils.uuid(),
                to_Order_orderUUID: newpurchaseOrder.orderUUID
            }));
            newpurchaseOrder.to_Customer_customerID = CUSTOMER;



            await srv.tx(req).run(INSERT.into('Orders').entries(newpurchaseOrder));
            await srv.tx(req).run(INSERT.into('OrderItems').entries(newpurchaseOrderItems));
            await this._updateOrderLineItem(newpurchaseOrder.orderUUID, req, srv)

           console.log('creation of order from template done');
 
            req.info(`Added to order '${newpurchaseOrder.orderID}'`);

      
        });

        return super.init()
    }
};


class ProductService extends cds.ApplicationService {

    init() {

        /**
     * Reflect definitions from the service's CDS model
     */
        const { Products } = this.entities
        this.before('READ', 'Customers', async req => {
          
            // populate the salesdata with random vales 
            const customers = await SELECT.from('Customers');
            for (const customer of customers) {
            customer.salesData = {
            //generate random
            //lastyear_sales: Math.floor(Math.random() * 1000), // generate a random string
                currentyear_sales: Math.random().toString(36).substring(2, 15), // generate a random string
                lastyear_sales: Math.random().toString(36).substring(2, 15) // generate a random string
            };
            }
            req.results = customers;

        })
        return super.init();
    }

};
class CustomerService extends cds.ApplicationService {

    init() {

        /**
    * Reflect definitions from the service's CDS model
    */
        const { Customers } = this.entities
         

        return super.init()
    }

};

class AdminService extends cds.ApplicationService {

    init() {

        
        const CUSTOMER = 100010002;
        /**
     * Reflect definitions from the service's CDS model
     */
        const { Products, OrderTemplate, OrderTemplateItem, Customers } = this.entities
 
                        /**
     * Fill in primary keys and defaults for new order.
  
        */
        this.before('CREATE', 'OrderTemplate', async req => {
            console.log('AdminService: before create handler >> orderTemplate');
            const { maxID } = await SELECT.one`max(orderID) as maxID`.from(OrderTemplate)
            if (!maxID) req.data.orderID = 1
            else {
                req.data.orderID = maxID + 1
            }

        })

                /**
         * Fill in defaults for new item when adding products to order.
         */
                this.before('CREATE', 'OrderTemplateItem', async (req) => {
                    console.log('AdminService : before create handler >> orderTemplate Item');
                    console.log('  create before OrderTemplateItem called', req.data);
                    const { to_Order_orderUUID } = req.data
                    const { maxID } = await SELECT.one`max(itemID) as maxID`.from(OrderTemplateItem).where({ to_Order_orderUUID })
                    if (!maxID) req.data.itemID = 1
                    else
                        req.data.itemID = maxID + 1
                })

                
        /**
         * Fill in defaults for new item when editing order.
         */
        this.before('NEW', 'OrderTemplateItem.drafts', async (req) => {
            console.log('AdminService : New before handler >> orderTemplateItem drafts');
            const { to_Order_orderUUID } = req.data
            const { maxID } = await SELECT.one`max(itemID) as maxID`.from(OrderTemplateItem).where({ to_Order_orderUUID })
            if (!maxID) req.data.itemID = 1
            else
                req.data.itemID = maxID + 1

        })

        
        this.after(['PATCH','UPDATE'], 'OrderTemplateItem.drafts', async (_, req) => {
            console.log('AdminService : after update/patch handler >> orderTemplateItem drafts');
            if ('quantity' in req.data) {
                const { itemUUID } = req.data;
                const { to_Product_productID } = await SELECT.one().from(OrderTemplateItem.drafts).where({ itemUUID });
                const { price } = await SELECT.one().from(Products).where({ productID: to_Product_productID });
                await cds.run(UPDATE(OrderTemplateItem.drafts).set({ netPrice: price * req.data.quantity, unitPrice: price }).where({ itemUUID: itemUUID }));

            }

            //update the total price and taxes after editing  items
            const {to_Order_orderUUID} = await SELECT.one().from(OrderTemplateItem.drafts).where({ itemUUID: req.data.itemUUID });
            const { sum } = await SELECT.one`sum(netPrice) as sum`.from(OrderTemplateItem.drafts).where({ to_Order_orderUUID: to_Order_orderUUID })
             console.log(sum);
            // add a value 6 months into future 
               if( parseFloat(sum) > 0)
               {
            const discount = (sum * .03).toFixed(2) ;
            const tax = ((sum - discount) * 0.07).toFixed(2) ;           
            const totalAmount =  ( parseFloat(sum) + parseFloat(tax) - parseFloat(discount)).toFixed(2) ;
            return await cds.run(UPDATE(OrderTemplate.drafts).set({  tax: tax, totalAmount: totalAmount, discount: discount }).where({ orderUUID : to_Order_orderUUID}))
               }
               else {
                return await cds.run(UPDATE(OrderTemplate.drafts).set({  tax: 0.00, totalAmount: 0.00, discount: 0.00 }).where({ orderUUID : to_Order_orderUUID}))
               } 
        })



        this.before(['PATCH','UPDATE'], 'OrderTemplateItem', async (req) => {
            console.log('  AdminService : before update handler >> OrderTemplateItem called');
            console.log(req.data);
            let newQuantity = 0;
            const { itemUUID } = req.data;
            console.log(await SELECT.one().from(OrderTemplateItem).where({ itemUUID }));
            const { to_Product_productID, quantity } = await SELECT.one().from(OrderTemplateItem).where({ itemUUID });
            const { price } = await SELECT.one().from(Products).where({ productID: to_Product_productID });
            if ('quantity' in req.data)
                newQuantity = req.data.quantity;
            else
                newQuantity = quantity;

            req.data.netPrice = price * newQuantity;
            req.data.unitPrice = price;
            //     return await cds.run(UPDATE(OrderItems).set({ netPrice: price * newQuantity, unitPrice: price }).where({ itemUUID: itemUUID }));

        });

        this.after(['PATCH','UPDATE'],  'OrderTemplateItem', async (_, req) => {
            console.log('  AdminService : after update/patch >> OrderTemplateItem called');
            const { itemUUID } = req.data;
            const { to_Order_orderUUID } = await SELECT.one().from(OrderTemplateItem).where({ itemUUID });
            const { sum } = await SELECT.one`sum(netPrice) as sum`.from(OrderTemplateItem).where({ to_Order_orderUUID: to_Order_orderUUID })
            
            // console.log(sum);
            const discount = (sum * .03).toFixed(2) ;
            const tax = ((sum - discount) * 0.07).toFixed(2) ;           
            const totalAmount =  ( parseFloat(sum) + parseFloat(tax) - parseFloat(discount)).toFixed(2) ;
            // console.log( discount,tax, totalAmount);
 
            // update total price on orders
            return await cds.run(UPDATE(OrderTemplate).set({  tax: tax, totalAmount: totalAmount, discount: discount }).where({ orderUUID: to_Order_orderUUID }))
            // 

        });


        this.before(['PATCH','UPDATE'], 'OrderTemplate', async (req) => {
            console.log('  AdminService : before update >> OrderTemplate called')
       //     const { orderStatus } = await SELECT.one`orderStatus`.from(OrderTemplate).where({ orderUUID: req.data.orderUUID })
       //     if (orderStatus === 'C' || orderStatus === 'A') req.reject(403, 'Order cannot be updated')

            const { orderUUID } = req.data;
            const { sum } = await SELECT.one`sum(netPrice) as sum`.from(OrderTemplateItem).where({ to_Order_orderUUID: orderUUID })
             console.log(sum);
            
            if( parseFloat(sum) > 0)
               {
            const discount = (sum * .03).toFixed(2) ;
            const tax = ((sum - discount) * 0.07).toFixed(2) ;           
            const totalAmount =  ( parseFloat(sum) + parseFloat(tax) - parseFloat(discount)).toFixed(2) ;
            console.log( discount,tax, totalAmount);
            
            req.data.tax = tax;
            req.data.totalAmount = totalAmount;
            req.data.discount = discount;
               }

               else {
                req.data.tax = 0.00;
                req.data.totalAmount = 0.00;
                req.data.discount = 0.00;

               }
  
        })

                // After items are deleted recalculate the order prices

                this.after('DELETE', "OrderTemplateItem.drafts", async (_, req) => {

                    console.log(' AdminService : after delete handler >> OrderTemplate ')
                    const max =   await SELECT.one`count(*) as max`.from(OrderTemplateItem.drafts).where({ itemUUID: req.data.itemUUID }); 
                   if (max > 1) {
                       const {to_Order_orderUUID} = await SELECT.one().from(OrderTemplateItem.drafts).where({ itemUUID: req.data.itemUUID }); 
                       const { sum } = await SELECT.one`sum(netPrice) as sum`.from(OrderTemplateItem).where({ to_Order_orderUUID: to_Order_orderUUID })
                       console.log(sum);
                       const discount = (sum * .03).toFixed(2) ;
                       const tax = ((sum - discount) * 0.07).toFixed(2) ;           
                       const totalAmount =  ( parseFloat(sum) + parseFloat(tax) - parseFloat(discount)).toFixed(2) ;
                       return await cds.run(UPDATE(OrderTemplate).set({ tax: tax, totalAmount: totalAmount, discount: discount }).where({ orderUUID : to_Order_orderUUID}))
                      
                    }
                   else    
                    { 
                       const {to_Order_orderUUID} = await SELECT.one().from(OrderTemplateItem).where({ itemUUID: req.data.itemUUID }); 
                      return await cds.run(UPDATE(OrderTemplate).set({  totalAmount:0.00, tax: 0.00, totalAmount: 0.00, discount: 0.00 }).where({ orderUUID : to_Order_orderUUID}))
                    } 
                });
        


        this.after(['PATCH','UPDATE'],'OrderTemplate', async (_, req) => {

            console.log(' AdminService : after patch/delete handler >> OrderTemplate ')
            const { orderUUID } = req.data;
            //       console.log(req.data);
            const { sum } = await SELECT.one`sum(netPrice) as sum`.from(OrderTemplateItem).where({ to_Order_orderUUID: orderUUID })
                  console.log(sum);
            const discount = sum * .03;
            const total = sum - discount;
            //     console.log( discount,tax, total);

            // update total price on orders
            return await cds.run(UPDATE(OrderTemplate).set({ totalAmount: total.toFixed(2), discount: discount.toFixed(2) }).where({ orderUUID }))
            // 


        })


        this.on('createOrderByTemplate', async (req) => {
            console.log(' AdminService : createOrderByTemplate handler');
          //  console.log(req.data);
            const {customerID} = req.data;
            const { orderUUID } = req.params[0];
            const srv = await cds.connect.to('OrderService')
            //   console.log(req.params);
            //   console.log(orderUUID);

               // Fetch the purchase order to be copied
            const [purchaseOrder] = await SELECT.from(req.subject).where({ orderUUID: orderUUID });
            if (!purchaseOrder) throw new Error(`Sales order with UUID ${orderUUID} not found`);
             const purchaseOrderItems = await srv.tx(req).run(SELECT.from('OrderTemplateItem').where({ to_Order_orderUUID: orderUUID }));
 
           //     console.log('retrieved items from template');
          //      console.log(purchaseOrderItems);

            // Create a new  purchase order with the copied data
            const newpurchaseOrder = { ...purchaseOrder, orderUUID: cds.utils.uuid()};
            
            //string to float
            newpurchaseOrder.discount = parseFloat(newpurchaseOrder.discount);
            newpurchaseOrder.tax = parseFloat(newpurchaseOrder.tax);
            newpurchaseOrder.totalAmount = parseFloat(newpurchaseOrder.totalAmount);
            
            const newpurchaseOrderItems = purchaseOrderItems.map(item => ({
                ...item,
                itemUUID: cds.utils.uuid(),
                to_Order_orderUUID: newpurchaseOrder.orderUUID,
                netPrice : (parseFloat(item.unitPrice) * parseFloat(item.quantity)).toFixed(2),
                unitPrice : parseFloat(item.unitPrice)
            }));

          newpurchaseOrder.to_Customer_customerID = customerID;   
          newpurchaseOrder.orderNotes = `Copied from template ${purchaseOrder.orderID}`;

          await srv.tx(req).run(INSERT.into('Orders').entries(newpurchaseOrder));
          //insert each item of newpurchaseOrderItems to OrderItems
            for (let i = 0; i < newpurchaseOrderItems.length; i++) {
                await srv.tx(req).run(INSERT.into('OrderItems').entries(newpurchaseOrderItems[i]));
            }

          req.info(`Added to order '${newpurchaseOrder.orderID}'`);

        });

        return super.init()
    }

}

module.exports = { OrderService, CustomerService, ProductService , AdminService}
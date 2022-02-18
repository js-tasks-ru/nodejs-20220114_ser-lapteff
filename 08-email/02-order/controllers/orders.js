const Order = require('../models/Order');
const Product = require('../models/Product');
const sendMail = require('../libs/sendMail');
const mapOrder = require('../mappers/order');
const mapOrderConfirmation = require('../mappers/orderConfirmation');

module.exports.checkout = async function checkout(ctx, next) {
  const {product: productId, phone, address} = ctx.request.body;
  const product = await Product.findOne({id: productId});

  const order = await Order.create({
    user: ctx.user.id,
    product,
    phone,
    address,
  });

  const orderProduct = mapOrderConfirmation(order, product);

  if (order) {
    await sendMail({
      template: 'order-confirmation',
      locals: orderProduct,
      to: ctx.user.email,
      subject: 'Подтверждение заказа',
    });

    ctx.status = 200;
    ctx.body = {order: order.id};
  }
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const rawOrders = await Order.find({user: ctx.user.id}).populate('product');

  const orders = rawOrders.map((order) => mapOrder(order));

  ctx.body = {orders};
};

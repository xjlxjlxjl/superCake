var amount = function (product) {
  let amount = 0;
  for (let item of product){
    if ( item.checked )
      amount += item.count * item.info.price;
  }
  return amount;
}

module.exports = {
  amount: amount
}
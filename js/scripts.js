function Pizza(pizzaSize, cheese) {
  this.pizzaSize = pizzaSize;
  this.cheese = cheese;
  this.flavor = [];
  this.toppings = [];
  this.crust = [];
  this.drink = [];
}

Pizza.prototype.addFlavor = function(flavor) {
  this.flavor.push(flavor);
}
Pizza.prototype.addTopping = function(top) {
  this.toppings.push(top);
}
Pizza.prototype.addCrust = function(crust) {
  this.crust.push(crust);
}
Pizza.prototype.addDrink = function(drink) {
  this.drink.push(drink);
}
Pizza.prototype.refreshCost = function() {
  var cost = 0;
  if (this.pizzaSize === "medium") {
    cost = 650;
  } else if (this.pizzaSize === "small") {
    cost = 450;
  } else if (this.pizzaSize === "large") {
    cost = 800;
  } else if (this.pizzaSize === "extra large") {
    cost = 1000;
  }
  this.flavor.forEach(function() {
    cost += 0;
  });
  this.toppings.forEach(function() {
    cost += 125;
  });
  this.crust.forEach(function() {
    cost += 0;
  });
  this.drink.forEach(function() {
    cost += 200;
  });
  if (this.cheese === "extra") {
    cost += 50;
  }

  this.cost = cost;
}

// Order Constructor, represents a customer order containing multiple pizzas
function Order(customerName, customerAddress, customerPhone, customerCashCredit) {
  this.customerName = customerName;
  this.customerAddress = customerAddress;
  this.customerPhone = customerPhone;
  this.customerCashCredit = customerCashCredit;
  this.pizzas = [];
}
Order.prototype.addPizza = function(pizza) {
  pizza.refreshCost();
  this.pizzas.push(pizza);
}
Order.prototype.removePizza = function(pizzaNumber) {
  this.pizzas.splice(pizzaNumber-1,1);
}
Order.prototype.determineTotalCost = function() {
  var totalCost = 0;
  this.pizzas.forEach(function(pizza) {
    totalCost += pizza.cost;
  });
  this.totalCost = totalCost;
}


// ================================
//     User Interface Logic
// ================================

var nextDiv = function(toHide, toShow) {
  $(toHide).hide();
  $(toShow).show();
}
var createCustomerOrder = function() {
  var customerName = $('#customer-name').val();
  var customerAddress = $('#customer-street').val() + ', ' + $('#customer-city').val() + ', ' + $('#customer-zip-code').val();
  var customerPhone = $('#customer-phone').val();
  var customerCashCredit = $('input[name="cash-credit"]:checked').val();

  return new Order(customerName, customerAddress, customerPhone, customerCashCredit);
}
var createPizza = function() {
  var pizzaSize = $('input[name="pie-size"]:checked').val();
  var cheese = $('input[name="cheese-options"]:checked').val();
  var newPizza = new Pizza(pizzaSize, cheese);
  $('input[name="flavor"]:checked').each(function() {
    newPizza.addFlavor($(this).val());
  });
  $('input[name="toppings"]:checked').each(function() {
    newPizza.addTopping($(this).val());
  });
  $('input[name="crust"]:checked').each(function() {
    newPizza.addCrust($(this).val());
  });
  $('input[name="drink"]:checked').each(function() {
    newPizza.addDrink($(this).val());
  });

  resetPizzaForm();
  return newPizza;
}
var resetPizzaForm = function() {
  $('input[name="pie-size"]:checked').attr("checked", false);
  $('input[value="medium"]').prop("checked", true);
  $('input[name="cheese-options"]:checked').attr("checked", false);
  $('input[value="regular"]').prop("checked", true);
  $('input[name="flavor"]:checked').attr("checked", false);
  $('input[name="toppings"]:checked').attr("checked", false);
  $('input[name="crust"]:checked').attr("checked", false);
  $('input[name="drink"]:checked').attr("checked", false);

}
var populatePizzaList = function(pizza) {
  $('.pizza-list').append('<div class="pizza">' +
                            '<h4><span class="pizza-list-size">- One '+pizza.pizzaSize+' pizza</span></h4>' +
                            '<div class="pizza-info-toggle">' +
                              '<p>Cheese: <span class="pizza-list-cheese">'+pizza.cheese+'</span></p>' +
                              '<p>Flavor: </p>' +
                              '<ul class="pizza-list-flavor"></ul>' +
                              '<p> Toppings:</p>' +
                              '<ul class="pizza-list-toppings"></ul>' +
                              '<p> Crust:</p>' +
                              '<ul class="pizza-list-crust"></ul>' +
                              '<p> Drink:</p>' +
                              '<ul class="pizza-list-drink"></ul>' +

                              '<p>Cost of this pizza: KES<span>'+pizza.cost+'</span></p>'+
                            '</div>' +
                          '</div>');
  pizza.flavor.forEach(function(flavor) {
    $('.pizza-list .pizza-list-flavor').last().append('<li>'+flavor+'</li>');
  });
  pizza.toppings.forEach(function(topping) {
    $('.pizza-list .pizza-list-toppings').last().append('<li>'+topping+'</li>');
  });
  pizza.crust.forEach(function(crust) {
    $('.pizza-list .pizza-list-crust').last().append('<li>'+crust+'</li>');
  });
  pizza.drink.forEach(function(drink) {
    $('.pizza-list .pizza-list-drink').last().append('<li>'+drink+'</li>');
  });

  $('.pizza').last().click(function() {
      $(this).find('.pizza-info-toggle').toggle();
  });
  $('.pizza-info-toggle').last().click(function() {
      $(this).find('.pizza-info-toggle').toggle();
  });

}
var populateTotalPrice = function(customerOrder) {
  customerOrder.determineTotalCost();
  return customerOrder.totalCost;
}

$(document).ready(function() {
  var customerOrder = new Order();

  // event handler for begin ordering button
  $('.launch-order button').click(function() {
    nextDiv('.launch-order', '.order-information-input');
  });

  // event handler for customer information submit
  $('.order-information-input form').submit(function(event) {
    event.preventDefault();
    customerOrder = createCustomerOrder();
    nextDiv('.order-information-input', '.order-pizza-input');
  });

  // event handler for add pizza
  $('.order-pizza-input form').submit(function(event) {
    event.preventDefault();
    var thisPizza = createPizza();
    customerOrder.addPizza(thisPizza);
    populatePizzaList(thisPizza);
    $("#pizza-list-total-cost").text('$ '+ populateTotalPrice(customerOrder).toFixed(2));
    nextDiv('.order-pizza-input', '.order-summary');
  });

  // event handler for add another pizza
  $('#add-another-pizza').click(function() {
    nextDiv('.order-summary', '.order-pizza-input');
  });

  // event handler for checkout order
  $('#checkout-order').click(function() {
    nextDiv('.order-summary', '.checked-out');
  });

  // event handler for new order/reset site
  $('#new-order').click(function() {
    customerOrder = new Order();
    $('.pizza-list').empty();
    nextDiv('.checked-out', '.launch-order');
  });

  // event handler for log object to console
  $('#console-log').click(function() {
    console.log(customerOrder);
  })

});

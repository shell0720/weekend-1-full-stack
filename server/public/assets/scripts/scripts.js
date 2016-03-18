var totalSalary = 0;

$(document).ready(function () {
  $("#employeeForm").on("submit", handleSubmit);
  $(".people").on('click', 'button', deleteClick);
  receiveData();
  totalCost();

});

function handleSubmit (event) {
  event.preventDefault();
  var val = {};
  $.each($("#employeeForm").serializeArray(),function(index, element){
    val[element.name]= element.value;
  });
  console.log(val);

  //empty the input
  $("#employeeForm").find("input[type=text]").val("");
  $("#employeeForm").find("input[type=number]").val("");

  //append the input info to the DOM

  //totalMonthlyCost += parseFloat(val.salary / 12);
  //totalMonthlySalary();
  sendData(val);
}

function sendData (employeeData) {
  $.ajax({
    type:'POST',
    url:'/people',
    data:employeeData,
    success: receiveData
  });
}

function receiveData () {
  $.ajax({
    type:'GET',
    url:'/people',
    success: appendDom
  });
}
//append the object and delete button to DOM
function appendDom(response){
  response.forEach(function(person){
    $('.people').append('<div class="person"></div>');
    var $el = $('.people').children().last();

    $el.append('<h2>' + "First Name: " + person.first_name + '</h2>');
    $el.append('<h2>' + "Last Name: " + person.last_name + '</h2>');
    $el.append('<p>' + "Employee ID: " + person.employee_id + '</p>');
    $el.append('<p>' + "Job Title: " + person.title + '</p>');
    $el.append('<p>' + "Annual Salary: " + person.salary +'</p>');
    $el.append("<button> Delete </button>");
    var eachSalary = parseFloat(person.salary);
    $el.find('button').data("personToDelete", eachSalary);
    console.log(eachSalary);
  })

}

function deleteClick() {
  var eachSalary = $(this).data("personToDelete");
  totalSalary -= eachSalary;
  //totalMonthlyCost -= monthlySalary;
  //totalMonthlySalary();
  $(this).parent().hide();
$('.totalEmployeeSalary').text("Total Salary Cost is: " + totalSalary +",  Total Monthly Salary Cost is :" + totalSalary/12);
}


function totalCost() {
  $.ajax({
      type:'GET',
      url:'/people/total',
      success:initalAppend
    });
}
function initalAppend (total){
for (var i =0; i<total.length; i++){
  totalSalary += parseFloat(total[i].salary);
  console.log(totalSalary);
  $('.totalEmployeeSalary').text("Total Salary Cost is: " + totalSalary + ",  Total Monthly Salary Cost is :" + totalSalary/12);
}
}

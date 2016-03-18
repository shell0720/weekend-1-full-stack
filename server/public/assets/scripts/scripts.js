var totalMonthlyCost = 0;

$(document).ready(function () {
  $("#employeeForm").on("submit", handleSubmit);
  $(".people").on('click', 'button', deleteClick);
  receiveData();

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

  totalMonthlyCost += parseFloat(val.salary / 12);
  totalMonthlySalary();
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

    $el.append('<h2>' + "firstname: " + person.first_name + '</h2>');
    $el.append('<h2>' + "lastname: " + person.last_name + '</h2>');
    $el.append('<p>' + "employee id: " + person.employee_id + '</p>');
    $el.append('<p>' + "job title: " + person.title + '</p>');
    $el.append('<p>' + "annual salary: " + person.salary +'</p>');
    $el.append("<button> Delete </button>");
    var monthlySalary = parseFloat(person.salary / 12);
    $el.find('button').data("personToDelete", monthlySalary);
    console.log(monthlySalary);
  })

}

function deleteClick() {
  var monthlySalary = $(this).data("personToDelete");
  totalMonthlyCost -= monthlySalary;
  totalMonthlySalary();
  $(this).parent().hide();
}

function totalMonthlySalary () {
  $(".totalEmployeeSalary").text("Employee Annual Total Salary: "+ totalMonthlyCost *12 +", Monthly Total Salary: " + totalMonthlyCost);
 //
}

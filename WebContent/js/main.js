// The root URL for the RESTful services
var rootURL = "/SpringMVC/hr/";

var currentEmployee;

// Retrieve employee list when application starts
findAll();

// Nothing to delete in initial application state
$('#btnDelete').hide();

// Register listeners
$('#btnSearch').click(function() {
	search($('#searchKey').val());
	return false;
});


$('#btnAdd').click(function() {
	newEmployee();
	return false;
});

$('#btnSave').click(function() {
	addEmployee();

	return false;
});

$('#btnDelete').click(function() {
	deleteEmployee();
	return false;
});

$('#employeeList a').live('click', function() {
	findById($(this).data('identity'));
});


function search(searchKey) {
	if (searchKey == '')
		findAll();
	else
		findById(searchKey);
}

function newEmployee() {
	$('#btnDelete').hide();
	currentEmployee = {};
	renderDetails(currentEmployee); // Display empty form
}

function findAll() {
	$.ajax({
		type: 'GET',
		url: rootURL + '/employees',
		dataType: "json", // data type of response
		success: renderList
	});
}

function findById(id) {
	$.ajax({
		type: 'GET',
		url: rootURL + '/employee/' + id,
		dataType: "json",
		success: function(data){
			$('#btnDelete').show();
			currentEmployee = data;
			renderDetails(currentEmployee);
		}
	});
}

function addEmployee() {
	$.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: rootURL + '/addEmployee',
		dataType: "json",
		data: formToJSON(),
		success: function(data, textStatus, jqXHR){
			alert('Employee created successfully');
			$('#btnDelete').show();
			$('#employeeId').val(data.id);
		}
	});
}

function deleteEmployee() {
	$.ajax({
		type: 'DELETE',
		url: rootURL + '/employee/' + $('#employeeId').val(),
		success: function(data, textStatus, jqXHR){
			alert('Employee deleted successfully');
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert('deleteEmployee error');
		}
	});
}

function renderList(data) {
	var list = data == null ? [] : (data instanceof Array ? data : [data]);

	$('#employeeList li').remove();
	$.each(list, function(index, employee) {
		$('#employeeList').append('<li><a href="#" data-identity="' + employee.id + '">'+employee.name+'</a></li>');
	});
}

function renderDetails(employee) {
	$('#employeeId').val(employee.id);
	$('#name').val(employee.name);
}

// Helper function to serialize all the form fields into a JSON string
function formToJSON() {
	var employeeId = $('#employeeId').val();
	return JSON.stringify({
		"id": employeeId == "" ? null : employeeId,
		"name": $('#name').val()
		});
}
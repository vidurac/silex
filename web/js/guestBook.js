/**
 * Created by vidura on 10/06/17.
 */


$( document ).ready(function() {
    $('#form').submit(function(e) {

        e.preventDefault();
        var obj = this;
        $.ajax({
            type: 'POST',
            url: '/index_dev.php/addGuests',
            data: {
                'name': $('#form_name').val(),
                'address': $('#form_address').val(),
                'email': $('#form_email').val(),
                'message': $('#form_message').val()
            },
            success: function(data) {

                if(data.success)
                {
                    alert("Saved");
                    $(obj).closest('form').find("input[type=text], textarea").val("");
                }
            },
            error: function (request, status, error) {
                alert(request.responseText);
            }
        });
    });





    $.ajax({
        type: 'GET',
        url: '/index_dev.php/getGuests',
        data: {},
        success: function(data) {

            var temp = [];

            for(var x = 0; x < data.length; x++)
            {
                var row = [
                    data[x].id,
                    data[x].name,
                    data[x].address,
                    data[x].email,
                    data[x].message,
                    data[x].browser,
                    data[x].browser_version,
                    data[x].platform,
                    data[x].ip_address,
                ];
                temp.push(row);
            }
            /*var dataSet = [
                [ "Tiger Nixon", "System Architect", "Edinburgh", "5421", "2011/04/25", "$320,800" ],
                [ "Prescott Bartlett", "Technical Author", "London", "3606", "2011/05/07", "$145,000" ],
            ];*/

            $('#example').DataTable( {
                data: temp,
                columns: [
                    { title: "ID" },
                    { title: "Name" },
                    { title: "Address" },
                    { title: "Email" },
                    { title: "Message." },
                    { title: "browser" },
                    { title: "version" },
                    { title: "platform" },
                    { title: "IP" }
                ]
            } );
        },
        error: function (request, status, error) {
            alert(request.responseText);
        }
    });


});

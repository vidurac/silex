/**
 * Created by vidura on 10/06/17.
 */


$( document ).ready(function() {
    $('#form').submit(function(e) {
        e.preventDefault();

        var captcha = $('[name=g-recaptcha-response]').val();
        if(captcha == "")
        {
            alert("please tick captcha");
            return false;
        }

        var obj = this;
        $.ajax({
            type: 'POST',
            url: '/index.php/addGuests',
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

                    //clear the form
                    $(obj).closest('form').find("input[type=text], textarea").val("");

                    //reloading saved item table
                    loadSavedItems(true);
                }
            },
            error: function (request, status, error) {
                alert(request.responseText);
            }
        });
    });

    //loading saved item table
    loadSavedItems(false);
});

function loadSavedItems(reload)
{
    $.ajax({
        type: 'GET',
        url: '/index.php/getGuests',
        data: {},
        success: function(data) {

            //preparing data for data table
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

            if(reload)
            {
                //distroy the data table
                var table = $('#example').DataTable();
                table.destroy();
            }

            //create data table
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
}
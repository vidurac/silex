/**
 * Created by vidura on 10/06/17.
 */


$( document ).ready(function() {
    $('#form').submit(function(e) {

        e.preventDefault();

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

            },
            error: function (request, status, error) {
                alert(request.responseText);
            }
        });
    });
});

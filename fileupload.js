/**
 * Created by jovin on 25/7/16.
 */

$(function () {
    var files = 0;

    $.fn.fileUpload = function (options) {
        $(this).append('<div class="panel panel-default">' +
            '<div class="panel-body">' +
            '<span>Maximum ' + options.noOfFiles + ' files can be uploaded.</span>' +
            '</div>' +
            '</div><span class="btn btn-success file-button"><i class="fa fa-plus"></i>' +
            '<span>Add file...</span>' +
            '<input id="fileUpload" type="file" name="file"/></span>' +
            '<br>' +
            '<br>' +
            '<div id="spin"></div>' +
            '<div id="files" class="files"></div>' +
            '<br>')

        $(this).change(function () {

            myfile= $( this ).val();
            var ext = myfile.split('.').pop();
            if(ext=="pdf" || ext=="docx" || ext=="doc" || ext=="jpg" || ext=="jpeg" || ext=="png"){
                saveMedia(options);
            } else{
                $('#files').append('<div id="fileLimit">You can upload only pdf/doc/image files</div>');
            }
        });

        $(document).on('click', '.uploadedFiles', function (event) {

            deleteFile(options,event);

        });

    };

    function saveMedia(options) {

        $('#spin').append('<div class="bmd-spinner bmd-spinner-default bmd-spinner-sm">' +
            '<svg viewBox="0 0 50 50">' +
            '<circle cx="25" cy="25" r="20"></circle>' +
            '</svg>')

        var mySelections = [];
        var formData = new FormData();
        formData.append('file', $('input[type=file]')[0].files[0]);
        if (files < options.noOfFiles) {
            if ($('input[type=file]')[0].files[0].size > options.fileSize) {
                $('#files').append('<div id="fileLimit">Files with size less than 2 mb can be uploaded</div>');

            } else {
                $.ajax({
                    url: options.postUrl,
                    data: formData,
                    processData: false,
                    contentType: false,
                    type: 'POST',
                    success: function (data) {
                        files++;
                        $.each(data.data, function (value, key) {
                            if (value != "Limit Reached") {
                                $('#files').append('<div class="uploadedFiles"><span>' + value + '</span><button class="btn btn-warning btn-xs delete"> Delete </button> <input type="hidden" value=" ' + key +'" class="fileLink"/></div>'
                                );
                                addToast('success', 'up', "File uploaded successfully")

                                $('#spin').empty();

                            } else
                                $('#files').append('<div id="fileLimit">Upto 3 files can be uploaded</div>');

                            $('#spin').empty();

                        });


                    },
                    error: function (err) {
                    }


                });
            }
        }
        else {
            $('#files').append('<div id="fileLimit">Upto 3 files can be uploaded</div>');
            $('#spin').empty();

        }


    }


    function deleteFile(options,event) {
        var data = {"fileLocation": $(event.target).parent().find('.fileLink').val()};
        $(event.target).parent().closest('.fileLink').val();
        $(event.target).parent().closest('.uploadedFiles').remove();
        $('#fileLimit').text('')
        files--;
        $.ajax({

            url: options.deleteUrl,
            type: 'POST',
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data) {
                $('#fileUpload').val();
            }

        });

    }


});

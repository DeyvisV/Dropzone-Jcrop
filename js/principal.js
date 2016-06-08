var dropzoneId;

var btnSaveImage = $('#save-image-btn');
var btnCropImage = $('#crop-image-btn');

function setDataURIS(resolution){
    var description = [];
    var d = $(".description");
    $.each(d, function() {
        var content = $(this).val();
        if (content == "") {
            content = "Descripción de la Imagen";
        }
        $('#divContents').append('<input type="hidden" name="content[]" value="'+content+'">');
    });

    var myDropzone = Dropzone.forElement("#"+dropzoneId);
    var files = myDropzone.files;
    //Remover imagenes del dropzone
    //myDropzone.removeAllFiles(true)
    var resizes = [];

    for (var i = 0; i < files.length; i++) {
        var resizeFile = new Promise(function(resolve,reject){
            var reader = new FileReader();
            reader.onload = function(e){
                resize(e.target.result,resolution,function(dataURI){
                    resolve(dataURI);
                });
            };
            reader.readAsDataURL(files[i]);
        });
        resizes.push(resizeFile);
    }

    var uploads = [];

    Promise.all(resizes).then(function(values){

        values.forEach(function(targetValue){
            //$('#dz_images').val(values);
            $('#divPhotos').append('<input type="hidden" name="image[]" value="'+targetValue+'">');
        })
        
    })
}

function resize(dataURI,width,cb){
    var newImage = new Image();
    var newWidth = width;
    newImage.onload = function(){
        var canvasOffLine = document.createElement("canvas"),
        canvasContext = canvasOffLine.getContext("2d");

        var ratio = newImage.height/newImage.width;
        var newHeigth = newWidth*ratio;

        canvasOffLine.width = newWidth;
        canvasOffLine.height = newHeigth;

        // draw image into canvas element
        canvasContext.drawImage(newImage, 0, 0, newWidth, newHeigth);
        cb(canvasOffLine.toDataURL("image/png"));
    };
    newImage.src=dataURI;
}

function saveImageCrop(e){
    //e.preventDefault();
    var id = Number($("#canvas-crop").attr('data-id'));
    var file = Dropzone.forElement("#"+dropzoneId).files[id];
    Dropzone.forElement("#"+dropzoneId).removeFile(file);

    var blob = dataURItoBlob($("#canvas-crop")[0].toDataURL("image/png"));
    var container = Dropzone.forElement("#"+dropzoneId).addFile(blob);

    $("#imageModal").modal('hide');

    JcropAPI = $('#dz-crop-preview-image').data('Jcrop');
    JcropAPI.destroy();

    setTimeout(function(){
        btnSaveImage.addClass('hide');
        btnCropImage.removeClass('hide');
    },1000)

}

function dataURItoBlob(dataURI) {
    'use strict'
    var byteString,
        mimestring

    if(dataURI.split(',')[0].indexOf('base64') !== -1 ) {
        byteString = atob(dataURI.split(',')[1])
    } else {
        byteString = decodeURI(dataURI.split(',')[1])
    }

    mimestring = dataURI.split(',')[0].split(':')[1].split(';')[0]

    var content = new Array();
    for (var i = 0; i < byteString.length; i++) {
        content[i] = byteString.charCodeAt(i)
    }

    return new Blob([new Uint8Array(content)], {type: mimestring});
}

function crop(){
    //event.preventDefault();
    $("#canvas-crop")[0].style.display = "inline";
    $('#dz-crop-preview-image').Jcrop({
        addClass: 'jcrop-centered',
        onChange: genCoords, // Here
        onSelect: genCoords,
        aspectRatio: 1
     });
    btnSaveImage.removeClass('hide');
    $(this).addClass('hide');
}

function genCoords(c){
    var rx,ry;
    var canvas = document.getElementById('canvas-crop'),
        ctx = canvas.getContext("2d");
    var img = $("#dz-crop-preview-image");
    var ratioCanvas = {
      x: img[0].naturalWidth / img.width(),
      y: img[0].naturalHeight / img.height()
    }

    // Here
    // BUG FIREFOX
    // the very first time when you will click on the crop area (or the image) 
    // the values for c.w and c.h will be 0 as no actual area as been selected,
    // OR Remove the onChange: genCoords in the Jcrop call.
    if (c.w === 0 && c.h === 0) {
       //set any arbitrary values
       c.w = 400;
       c.h = 400;
    }

    var realImgCrop = {
        width   : Math.round(ratioCanvas.x * c.w),
        height  : Math.round(ratioCanvas.y * c.h),
        x: Math.round(ratioCanvas.x * c.x),
        y: Math.round(ratioCanvas.y * c.y)
    }

    canvas.width = 400;
    canvas.height = canvas.width;

    ctx.drawImage(img[0], realImgCrop.x, realImgCrop.y, realImgCrop.width, realImgCrop.height , 0, 0, canvas.width , canvas.height);
}


$('#crop-image-btn').click( function() {
    crop();
    $(this).hide();
    $('#save-image-btn').show();
});

$('#save-image-btn').click( function() {
    saveImageCrop();
    $('#crop-image-btn').show();
    $('#dz-crop-container').empty();
});

$('#btn-cancel-dz-crop').click(function(event) {
    event.preventDefault();
    $('#dz-crop-container').empty();
    $('#crop-image-btn').show();
    $('#save-image-btn').hide();
});
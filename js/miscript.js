
/// Para guardar el formulario
$('#SavePost').click(function(event) {
    event.preventDefault();
    setDataURIS(800);
});

/// Para cancelar en formulario
$('#cerrar-crear-noticia').click(function() {
    var myDropzone = Dropzone.forElement("#"+dropzoneId);
    var files = myDropzone.files;
    //Remover imagenes del dropzone
    myDropzone.removeAllFiles(true)

    $('#form-crear-noticia')[0].reset();
    $('#divPhotos').empty();
    $('#divContents').empty();
});


Dropzone.autoDiscover = false;

$('#my-dropzone').dropzone({
    init: function() {
        var self = this;
        // config
        //self.options.previewTemplate  = previewTemplate;
        self.options.autoProcessQueue   = false;
        self.options.addRemoveLinks     = true;
        self.options.dictRemoveFile     = "Delete";
        self.options.thumbnailWidth = 150;
        self.options.thumbnailHeight = 150;
        //self.options.clickable = true;
        
        // bind events
        //New file added
        self.on("addedfile", function(file) {
            $(".dz-progress").remove();
            $(".dz-filename").remove();

            var i = self.files.length-1;

            var btn = Dropzone.createElement("<button class='crop'> Recortar </button>");
            file.previewElement.appendChild(btn);

            // Añadir Descripcion
            var myInput = Dropzone.createElement('<textarea class="form-control description" style="width=150;" placeholder="Escriba una Descripción"></textarea>');
            file.previewElement.appendChild(myInput);

            $(btn).unbind("click").click(function(e){
                e.preventDefault();

                dropzoneId = "my-dropzone";

                var index = $(this).parent().parent().children().index($(this).parent())-1;
                var file = self.files[index];

                this.id = index;

                var reader = new FileReader();
                $("#canvas-crop").attr('data-id',index);

                reader.onload = function(e){
                    var image = new Image();
                    image.style.display = "none";

                    image.onload = function(){
                        var ratio = image.width/image.height;

                        $('#dz-crop-container').append(
                            '<img id="dz-crop-preview-image" src="'+image.src+'" width="'+ratio*400+'" height="'+400+'"/>'
                        );

                        var canvas = document.getElementById('canvas-crop'),
                        ctx = canvas.getContext("2d");
                        canvas.style.display="none";
                        canvas.width = ratio*300;
                        canvas.height = 300;
                        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                    }
                    image.src = e.target.result;
                };
                reader.readAsDataURL(file);
                //$('#crop-image-btn').show();
                $("#imageModal").modal('show');
            });
        });
        // Send file starts
        self.on("sending", function(file) {
            //console.log('upload started', file);
            $('.meter').show();
        });
        self.on("drop",function(){
            //console.log(this.files);
        });
        self.on("queuecomplete", function(progress) {
            $('.meter').delay(999).slideUp(999);
        });
    }
});

$('#mi-dropzone').dropzone({
    init: function() {
        var self = this;
        // config
        //self.options.previewTemplate  = previewTemplate;
        self.options.autoProcessQueue   = false;
        self.options.addRemoveLinks     = true;
        self.options.dictRemoveFile     = "Delete";
        self.options.thumbnailWidth = 150;
        self.options.thumbnailHeight = 150;
        //self.options.clickable = true;

        // bind events
        //New file added
        self.on("addedfile", function(file) {
            $(".dz-progress").remove();
            $(".dz-filename").remove();

            var i = self.files.length-1;

            var btn = Dropzone.createElement("<button class='crop'> Recortar </button>");
            file.previewElement.appendChild(btn);

            // Añadir Descripcion
            var myInput = Dropzone.createElement('<textarea class="form-control description" style="width=150;" placeholder="Escriba una Descripción"></textarea>');
            file.previewElement.appendChild(myInput);

            $(btn).unbind("click").click(function(e){
                e.preventDefault();

                dropzoneId = "mi-dropzone";

                var index = $(this).parent().parent().children().index($(this).parent())-1;
                var file = self.files[index];

                this.id = index;

                var reader = new FileReader();
                $("#canvas-crop").attr('data-id',index);

                reader.onload = function(e){
                    var image = new Image();
                    image.style.display = "none";

                    image.onload = function(){
                        var ratio = image.width/image.height;

                        $('#dz-crop-container').append(
                            '<img id="dz-crop-preview-image" src="'+image.src+'" width="'+ratio*400+'" height="'+400+'"/>'
                        );

                        var canvas = document.getElementById('canvas-crop'),
                        ctx = canvas.getContext("2d");
                        canvas.style.display="none";
                        canvas.width = ratio*300;
                        canvas.height = 300;
                        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                    }
                    image.src = e.target.result;
                };
                reader.readAsDataURL(file);
                //$('#crop-image-btn').show();
                $("#imageModal").modal('show');
            });
        });
        // Send file starts
        self.on("sending", function(file) {
            //console.log('upload started', file);
            $('.meter').show();
        });
        self.on("drop",function(){
            //console.log(this.files);
        });
        self.on("queuecomplete", function(progress) {
            $('.meter').delay(999).slideUp(999);
        });
    }
});


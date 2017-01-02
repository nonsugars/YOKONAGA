(function() {
    var heights = {
        S: 600,
        M: 1000,
        L: 1800,
    };
    var canvasSize = 'M';
    var images = [];

    function setup() {
        $('body').on('dragover', function(event) {
            event.originalEvent.dataTransfer.dropEffect = 'copy';
            event.stopPropagation();
            event.preventDefault();
        });
        $('body').on('drop', function(event) {
            event.stopPropagation();
            event.preventDefault();
            var files = [].slice.call(event.originalEvent.dataTransfer.files);
            files.forEach(function(file) {
                if (file.type.match('image/.*')) {
                    readFile(file);
                }
            });
        });

        $('#download').on('click', function(event) {
            window.location.href =  drawCanvas().toDataURL('image/jpeg');
        });

        canvasSize = $('input[name=imageSize]:checked').val();
        $('input[name=imageSize]').on('click', function(event) {
            canvasSize = event.target.value;
            $('#preview img').removeClass('S M L');
            $('#preview img').addClass(canvasSize);
        });
    }

    function readFile(file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(event) {
            var image = new Image();
            image.src = event.target.result;
            image.className = canvasSize;
            images.push(image);
            $('#preview').append(image);
            stepNext();
        }
    }

    function drawCanvas() {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        var canvasHeight = heights[canvasSize];
        canvas.height = canvasHeight;
        canvas.width = canvasWidth(canvasHeight);
        var posX = 0;
        images.forEach(function(image) {
            var width = imageWidth(image, canvasHeight);
            context.drawImage(image, posX, 0, width, canvasHeight);
            posX += width;
        });
        return canvas;
    }

    function stepNext() {
        $('#firstStep').css('display', 'none');
        $('#secondStep').css('display', 'block');
    }

    function imageWidth(image, height) {
        return (height / image.height) * image.width;
    }

    function canvasWidth(height) {
        return images.map(function(image) {
            return imageWidth(image, height);
        })
        .reduce(function(prev, curr) {
            return prev + curr;
        });
    }

    setup();
})();

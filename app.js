(function() {
    var heights = {
        S: 600,
        M: 1000,
        L: 1800,
    };
    var canvasSize = 'M';
    var canvas = $('#photos')[0];
    var context = canvas.getContext('2d');
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
            $(this).attr('href', canvas.toDataURL('image/jpeg'));
        });

        canvasSize = $('input[name=imageSize]:checked').val();
        $('input[name=imageSize]').on('click', function(event) {
            canvasSize = event.target.value;
            draw();
        });
    }

    function readFile(file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(event) {
            var image = new Image();
            image.src = event.target.result;
            images.push(image);
            draw();
            stepNext();
        }
    }

    function draw() {
        var canvasHeight = heights[canvasSize];
        canvas.height = canvasHeight;
        canvas.width = canvasWidth(canvasHeight);
        var posX = 0;
        images.forEach(function(image) {
            var width = imageWidth(image, canvasHeight);
            context.drawImage(image, posX, 0, width, canvasHeight);
            posX += width;
        });
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

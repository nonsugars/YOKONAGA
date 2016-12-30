(function() {
    var canvasHeight = 300;
    var canvas = document.getElementById('photos');
    var context = canvas.getContext('2d');
    var images = [];

    function setup() {
        document.body.addEventListener('dragover', function(event) {
            event.dataTransfer.dropEffect = 'copy';
            event.stopPropagation();
            event.preventDefault();
        });
        document.body.addEventListener('drop', function(event) {
            event.stopPropagation();
            event.preventDefault();
            var files = [].slice.call(event.dataTransfer.files);
            files.forEach(function(file) {
                if (file.type.match('image/.*')) {
                    readFile(file);
                }
            });
        });

        var downloadButton = document.getElementById('download');
        downloadButton.addEventListener('click', function(event) {
            downloadButton.href = canvas.toDataURL('image/jpeg');
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
        }
    }

    function draw() {
        canvas.height = canvasHeight;
        canvas.width = canvasWidth(canvasHeight);
        var posX = 0;
        images.forEach(function(image) {
            var width = imageWidth(image, canvasHeight);
            context.drawImage(image, posX, 0, width, canvasHeight);
            posX += width;
        });
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

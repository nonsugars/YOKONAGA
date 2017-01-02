(function() {
    var heights = {
        S: 600,
        M: 1000,
        L: 1800,
    };
    var canvasSize = 'M';
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

        document.configForm.imageSize.forEach(function(input) {
            if (input.checked) {
                canvasSize = input.value;
            }
            input.addEventListener('click', function(event) {
                canvasSize = event.target.value;
                draw();
            });
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
        document.getElementById('firstStep').style.display = 'none';
        document.getElementById('secondStep').style.display = 'block';
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

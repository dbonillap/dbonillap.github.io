/* Iniciar SCORM */

var score = 0;
var scoreLMS = 0;
document.addEventListener('DOMContentLoaded', function () {
    if (pipwerks.SCORM.init()) {
        console.log("connected");
    } else {
        console.error("Failed to initialize the SCORM API");
    }

/* Cambiar color opciones */

    var labels = document.querySelectorAll('.option-text');

    labels.forEach(function (label) {
        label.addEventListener('click', function () {
            labels.forEach(function (l) {
                l.classList.remove('selected');
            });

            label.classList.add('selected');
        });
    });
});

/* Revisar respuesta */

function checkAnswer(n, a) {
    var selectedAnswer = document.querySelector('input[name="p' + n + '"]:checked');
    if (selectedAnswer) {
        if (selectedAnswer.value == a) {
            score += 1;
            scoreLMS += 20;
        }
    } else {
        console.log("Debes seleccionar una respuesta");
    }

    nextSlide();
}

/* Slider */

let currentSlide = 0;
const totalSlides = document.querySelectorAll('#container .slide').length;

function showSlide(index) {
    const slides = document.querySelectorAll('#container .slide');

    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }

    slides.forEach((slide, i) => {
        slide.style.display = i === currentSlide ? 'block' : 'none';
    });

}

function prevSlide() {
    showSlide(currentSlide - 1);
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

showSlide(currentSlide);

/* Finalizar SCORM */

function finalizarSCORM() {

    console.log("score", score);
    console.log("scoreLMS", scoreLMS);

    document.getElementById('scoreValue').textContent = score;

    pipwerks.SCORM.set('cmi.core.score.raw', scoreLMS);
    pipwerks.SCORM.set('cmi.core.score.min', 0);
    pipwerks.SCORM.set('cmi.core.score.max', 100);

    if (score>=3) {
         document.getElementById('win').style.display = "block";
         pipwerks.SCORM.set("cmi.success_status", "passed");
    } else {
         document.getElementById('lose').style.display = "block";
         pipwerks.SCORM.set("cmi.success_status", "failed");
    }

    pipwerks.SCORM.set('cmi.core.lesson_status', 'completed');

    pipwerks.SCORM.save();
}
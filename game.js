document.addEventListener("DOMContentLoaded", function () {
    const clockCanvas = document.getElementById("clockCanvas");
    const ctx = clockCanvas.getContext("2d");
    clockCanvas.style.border = "none";

    const questionText = document.getElementById("question");
    const optionsContainer = document.getElementById("options");
    const emojiContainer = document.createElement("div");
    const imageOverlay = document.createElement("img");
    const scoreText = document.createElement("p");
    const maxScoreText = document.createElement("p");
    document.body.appendChild(emojiContainer);
    document.body.appendChild(imageOverlay);
    document.body.appendChild(scoreText);
    document.body.appendChild(maxScoreText);
    
    emojiContainer.style.position = "absolute";
    emojiContainer.style.width = "100%";
    emojiContainer.style.top = "50px";
    
    imageOverlay.style.position = "absolute";
    imageOverlay.style.display = "none";
    imageOverlay.style.width = "200px";
    imageOverlay.style.height = "200px";
    imageOverlay.style.left = "50%";
    imageOverlay.style.top = "137px";
    imageOverlay.style.transform = "translateX(-50%)";
    
    scoreText.style.fontSize = "20px";
    scoreText.style.fontWeight = "bold";
    scoreText.textContent = "Pisteet: 0";
    
    maxScoreText.style.fontSize = "20px";
    maxScoreText.style.fontWeight = "bold";
    maxScoreText.textContent = "Ennätys: 0";

    let correctAnswer = "";
    let score = 0;
    let maxScore = 0;
    const happyImages = ["happy1.jpg", "happy2.jpg", "happy3.jpg", "happy4.jpg", "happy5.png"];

    function drawClock(hour, minute) {
        ctx.clearRect(0, 0, clockCanvas.width, clockCanvas.height);
        ctx.beginPath();
        ctx.arc(100, 100, 80, 0, 2 * Math.PI);
        ctx.strokeStyle = "black";
        ctx.stroke();
        
        for (let i = 1; i <= 12; i++) {
            let angle = ((i - 3) * 30) * (Math.PI / 180);
            let x = 100 + Math.cos(angle) * 70;
            let y = 100 + Math.sin(angle) * 70;
            ctx.fillText(i, x - 5, y + 5);
        }
        
        function drawHand(length, angle, color) {
            ctx.beginPath();
            ctx.moveTo(100, 100);
            ctx.lineTo(100 + Math.cos(angle) * length, 100 + Math.sin(angle) * length);
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.stroke();
        }
        
        let hourAngle = ((hour % 12) * 30 + (minute / 2)) * (Math.PI / 180) - Math.PI / 2;
        let minuteAngle = (minute * 6) * (Math.PI / 180) - Math.PI / 2;
        drawHand(50, hourAngle, "blue");
        drawHand(70, minuteAngle, "red");
    }

    function formatTimeFinnish(hour, minute) {
        if (minute === 0) return `Tasan ${hour}`;
        if (minute === 30) return `Puoli ${hour + 1}`;
        if (minute < 30) return `${minute} yli ${hour}`;
        return `${60 - minute} vaille ${hour + 1}`;
    }

    function generateQuestion() {
        imageOverlay.style.display = "none";
        let hour = Math.floor(Math.random() * 12) + 1;
        let minuteSteps = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
        let minute = minuteSteps[Math.floor(Math.random() * minuteSteps.length)];
        
        correctAnswer = formatTimeFinnish(hour, minute);
        
        questionText.textContent = "Mikä aika kellossa on?";
        drawClock(hour, minute);
        generateOptions(correctAnswer);
    }

    function generateOptions(correct) {
        optionsContainer.innerHTML = "";
        let options = new Set([correct]);
        while (options.size < 4) {
            let hour = Math.floor(Math.random() * 12) + 1;
            let minute = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55][Math.floor(Math.random() * 12)];
            options.add(formatTimeFinnish(hour, minute));
        }
        
        Array.from(options).sort(() => Math.random() - 0.5).forEach(option => {
            let button = document.createElement("button");
            button.textContent = option;
            button.onclick = (event) => checkAnswer(option, event);
            optionsContainer.appendChild(button);
        });
    }

    function checkAnswer(selected, event) {
        let rect = event.target.getBoundingClientRect();
        let x = rect.left + rect.width / 2;
        let y = rect.top;
        
        if (selected === correctAnswer) {
            score++;
            if (score > maxScore) {
                maxScore = score;
                maxScoreText.textContent = `Ennätys: ${maxScore}`;
            }
            imageOverlay.src = happyImages[Math.floor(Math.random() * happyImages.length)];
            showEmojis("happy", x, y);
        } else {
            score--;
            imageOverlay.src = "sad.jpg";
            showEmojis("sad", x, y);
        }
        
        scoreText.textContent = `Pisteet: ${score}`;
        imageOverlay.style.display = "block";
        setTimeout(() => {
            imageOverlay.style.display = "none";
            generateQuestion();
        }, 1000);
    }

    generateQuestion();
});
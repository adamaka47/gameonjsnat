let points = document.querySelector('.points'),
    start = document.querySelector('.start'),
    place = document.querySelector('.gamePlace'),
    car = document.createElement('div'),
    buttons = document.querySelector('.buttons');
    let audio = new Audio('amt.mp3');
    audio.play();

    buttons.classList.add('hide')

    container.innerHTML = localStorage.getItem("best") || 0;

    start.addEventListener('click', startIt);

    document.addEventListener('keydown', carRun);

    document.addEventListener('keyup', carStop);

    function carRun(e) {
        e.preventDefault();
        if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
    }

    function carStop(e) {
        e.preventDefault();
        if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
    }

    let keys = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowRight: false,
        ArrowLeft: false
    }

    let setting = {
        start: false,
        points: 0,
        speed: 0,
        traffic: 3
    }

    function getElementsNumber(heightEl = 1) {
        return (document.documentElement.clientHeight / heightEl)
    }

    function playGame() {
        if (setting.start) {
            setting.points += setting.speed;
            points.innerHTML = 'Очки<br>' + setting.points;
            move();
            moveEnemy();
            if (keys.ArrowLeft && setting.x > 0) {
                setting.x -= setting.speed
            }
            if (keys.ArrowRight && setting.x < (place.offsetWidth - car.offsetWidth)) {
                setting.x += setting.speed
            }
            if (keys.ArrowDown && setting.y < (place.offsetHeight - car.offsetHeight - 5)) {
                setting.y += setting.speed;
            }
            if (keys.ArrowUp && setting.y > 0) {
                setting.y -= setting.speed;
            }
            requestAnimationFrame(playGame);
        }

        car.style.left = setting.x + 'px';
        car.style.top = setting.y + 'px';

    }

    function startIt() {
        this.classList.add('hide');
        place.innerHTML = '';
        for (let i = 0; i < getElementsNumber(50); i++) {
            let line = document.createElement('div');
            line.classList.add('line');
            line.style.top = (i * 100) + 'px';
            line.y = (i * 100);
            place.appendChild(line)
        }
        for (let i = 0; i < getElementsNumber(100 * setting.traffic); i++) {
            let enemy = document.createElement('div');
            let enImg = Math.floor(Math.random() * 2) + 1
            enemy.classList.add('enemy');
            enemy.style.background = `url(enemy${enImg}.png) center/cover no-repeat`
            enemy.y = -70 * setting.traffic * (i + 1);
            enemy.style.left = Math.floor(Math.random() * (place.offsetWidth - 60)) + 'px';
            place.appendChild(enemy);
            enemy.style.top = enemy.y + 'px';
        }
        setting.start = true;
        setting.points = 0;
        requestAnimationFrame(playGame);
        buttons.classList.remove('hide');
        buttons.addEventListener('click', (e) => {
            switch (e.target.className.toLowerCase()) {
                case 'easy':
                    setting.speed = 1
                    break;
                case 'normal':
                    setting.speed = 2
                    break;
                case 'hard':
                    setting.speed = 6;
            }
        })
        place.appendChild(car);
        car.classList.add('car');
        car.style.left = place.offsetWidth / 2 - car.offsetWidth / 2;
        car.style.top = 'auto'
        car.style.bottom = '40px';
        setting.x = car.offsetLeft;
        setting.y = car.offsetTop;
        
    }


    function move() {
        let lines = document.querySelectorAll('.line');
        lines.forEach((item) => {
            item.y += setting.speed
            item.style.top = item.y + 'px'
            if (item.y + 1 > document.documentElement.clientHeight) {
                item.y = -100;
            }
        })
    }

    let lastResult = document.createElement('div');


    function moveEnemy() {
        let enemy = document.querySelectorAll('.enemy');
        enemy.forEach((el) => {
            let carRect = car.getBoundingClientRect();
            let enemyRect = el.getBoundingClientRect();
            if (carRect.top <= enemyRect.bottom && carRect.right >= enemyRect.left && carRect.left <= enemyRect.right && carRect.bottom >= enemyRect.top){
                buttons.classList.add('hide')
                setting.start = false;
                start.classList.remove('hide');
                start.style.top = points.offsetHeight;
                if (setting.points >= localStorage.getItem("best")) {
                    localStorage.setItem("best", setting.points);
                    lastResult.textContent = localStorage.getItem("best");
                    container.innerHTML = ''
                    container.appendChild(lastResult);
                    alert(`Рекорд побит: ${localStorage.getItem('best')}`)
                }
                
            }
            el.y += setting.speed/2;
            el.style.top = el.y + 'px';
            if (el.y > document.documentElement.clientHeight) {
                el.y = -70 * setting.traffic;
                el.style.left = Math.floor(Math.random() * (place.offsetWidth - 60)) + 'px';
            }
        })
    }




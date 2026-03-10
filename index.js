addListeners();


const anim = animaster()

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            anim.addFadeIn(5000).play(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            //anim.move(block, 1000, {x: 100, y: 10});
            anim.addMove(500, {x: 20, y:20}).play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            anim.addScale(1000, 1.25).play(block);
        });
    document.getElementById('fadeOut')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            anim.addFadeOut(5000).play(block);
        });
    document.getElementById('moveAndHide')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            anim.moveAndHide(block, 3000);
        });
    
    document.getElementById('ResetMoveAndHide')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            anim.heartBeating(block);
        });

    document.getElementById('showAndHide')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });
    
    document.getElementById('heartBeating')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            anim.heartBeating(block);
        });
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            anim.heartBeatingStop();
        });
}



function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}

function animaster() {
    let stopHeartTimer = null
    let _steps = [];

    /**
    * Сброс fadeIn анимации
    * @param element — HTMLElement, на котором надо сбросить состояние
    */
    function resetFadeIn(element) {
            element.style.transitionDuration = null;
            element.classList.remove('show');
            element.classList.add('hide');
        }

    /**
    * Сброс fadeOut анимации
    * @param element — HTMLElement, на котором надо сбросить состояние
    */
    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    /**
     * Сброс MoveAndScale анимации
     * @param element — HTMLElement, на котором надо сбросить состояние
     */
    function resetMoveAndScale(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
    }

    return animasterObject = {
        
        
        /**
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeIn: function fadeIn(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        fadeOut: function fadeOut(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        /**
         * Функция, передвигающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */
        move: function move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },

        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        scale: function scale(element, duration, ratio) {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },

        heartBeat: function heartBeat(element) {
            this.scale(element, 500, 1.4);
            setTimeout(this.scale.bind(this, element, 500, 1), 500);
        },
        
        heartBeating: function heartBeating(element) {
            let heartBeatingTimer = setInterval(this.heartBeat.bind(this, element), 1000);
            stopHeartTimer = { 
                stop: function () {
                    clearInterval(heartBeatingTimer);
                }
            }
            return stopHeartTimer
        },
        heartBeatingStop: function heartBeatingStop() {
            console.log("stop")
            stopHeartTimer.stop()
        },
        /**
         * блок должен появиться, подождать и исчезнуть
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        showAndHide: function(element, duration) {
            const phaseDuration = duration / 3;
            this.fadeIn(element, phaseDuration);
            setTimeout(() => {
                this.fadeOut(element, phaseDuration);
            }, phaseDuration * 2);
        },

        addMove: function addMove(duration, translation) {
            _steps.push(["move", duration, translation])
            console.log(_steps)
            return this;
        },

        addScale: function addScale(duration, ratio) {
            _steps.push(["scale", duration, ratio])
            console.log(_steps)
            return this;
        },

        addFadeIn: function addFadeIn(duration) {
            _steps.push(["fadeIn", duration])
            console.log(_steps)
            return this;
        },

        addFadeOut: function addFadeOut(duration) {
            _steps.push(["fadeOut", duration])
            console.log(_steps)
            return this;
        },

        play: function play(element) {
            let step = _steps.pop();
            switch (step[0]) {
                case "move": this.move(element, step[1], step[2]); break
                case "scale": this.scale(element, step[1], step[2]); break
                case "fadeIn": this.fadeIn(element, step[1]); break
                case "fadeOut": this.fadeOut(element, step[1]); break
            }
        },

        moveAndHide: function moveAndHide(element, duration){
            this.move(element, duration*0.4, {x: 100, y: 20});
            setTimeout(this.fadeOut, duration*0.6, element, duration*0.4);
        },

        resetMoveAndHide: function() {

        }
    }
}
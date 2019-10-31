const listOfCookies = ['🥮','🎂','🍥','🍰','🧁', '🍪', '🍄','🥠', '🥞','🍘','🍩','🍄'];
const cookWidth = 85;
const cakeWidth = 30;
const cakeHeight = 30;

let cookPosTop = 0;
let cookPosLeft = 0;
let cakePosTop = 0;
let cakePosleft = 0;
let selectedCook = null;
let endGame = false;

class Cook {
    constructor(cookName, cookStartX){
        this.cookStartX = cookStartX;
        this.cookName = cookName;
        this.cookPosition = 454;
        this.cookHorizontalPosition = 500;
        this.element = document.querySelector(`.${cookName}`);
        this.element.addEventListener('click',()=>{
            this.enter();
        });
    }
    enter (){
        if (null !== selectedCook) {
            return;
        }

        selectedCook = this;

        this.element.classList.add(`cooks-animation-${this.cookName}`);
        this.element.classList.add('active');
        this.element.addEventListener('animationend', ()=>{
            this.element.classList.remove(`cooks-animation-${this.cookName}`);
            this.element.style.left= '500px';
            this.element.style.top = `${this.cookPosition}px`;
            this.element.style.transform = "scale(1.6)";
            playGame.cookiesFalls.goDown();
        });

        window.addEventListener('keydown', (event) => {
            this.handleMove(event.key);
        })
    }

    handleMove(key){
        if(this.element.offsetTop !== 454){
            return
        }
        if (key === 'ArrowRight' && this.cookHorizontalPosition<935){
            this.move('right');          
        }
        if (key === 'ArrowLeft' && this.cookHorizontalPosition>140){
            this.move('left');
        }
    }

    move(direction){
        this.cookHorizontalPosition = direction === 'left' ?
            this.cookHorizontalPosition - 10 :
            this.cookHorizontalPosition + 10
        ; 
        this.element.style.left = `${this.cookHorizontalPosition}px`;
        this.setPosition();
    }

    cookCorrPos(){
        if (this.cookName ==='maklowicz'){
            return 20;
        }else if(this.cookName === 'jakubiak'){
            return 18;
        }else{
            return 0;
        }
    }

    setPosition(){
        cookPosLeft = this.element.offsetLeft + this.cookCorrPos();
        cookPosTop = this.element.offsetTop;
    }

    resetCook(){
        this.element.classList.remove(`active`);
        this.element.style.left= '30px';
        this.element.style.top = `${this.cookStartX}px`;
        this.element.style.transform = "scale(1)";
    }
}

class CookiesGenerator {
    constructor (){
        this.cookieFrame = document.getElementById('kitchenid');
        this.positionXstart = 320;
        this.positionYstart = 60;
        this.positionYlength = 170 + Math.round(Math.random()*800);
        this.cookieTimeMove = this.positionYlength < 370 ? 370 - this.positionYlength + 540 : this.positionYlength -370 +540; 
        this.randomCookies = listOfCookies[Math.abs(Math.round(Math.random()*listOfCookies.length-1))];
        }
    
    createCookie(){
        this.cookieBody = document.createElement('span');
        this.cookieFrame.appendChild(this.cookieBody);
        this.cookieEmoti = document.createTextNode(this.randomCookies);
        this.cookieBody.appendChild(this.cookieEmoti);
        this.cookieBody.classList.add('cookies-body');
        if(this.randomCookies === '🍄' ){
            this.cookieBody.classList.add('cookies-blinking');
         };   
    }

    move(){
        this.createCookie();
        let positionXY = [this.positionXstart , this.positionYstart];
        const cookiesFall = setInterval(()=>{
            positionXY = this.cakePos(positionXY);
            this.cookieBody.style.top = `${positionXY[1]}px`;
            this.cookieBody.style.left = `${positionXY[0]}px`;
            
            if (playGame.checkCollision.checkPositionState(positionXY[1], this.randomCookies)){
                clearInterval(cookiesFall);
                this.cookieBody.remove();

            }

        },10); //Math.round(5000/this.cookieTimeMove*100)/100
    }
    
    cakePos(posXY){
        let posX = posXY[0];
        let posY = posXY[1];
        
        if((posX< 370 && posY===60)  ){
            posX ++;
        }else if(posX===370 && posY<93){
            posY++;
        }else if(posY===93 && this.positionYlength != posX){
            if(this.positionYlength > posX){
                posX ++;
            }else{
                posX --;
            }
        }else if(this.positionYlength === posX){
            posY ++;
        }

        cakePosleft = posX;
        cakePosTop = posY;
        
        return [posX,posY];
    }
}

class Counter {
    constructor() {
        this.life = 3;
        this.lvl = 1;
        this.point = 0;
        this.pointsCookiesCounter = document.querySelector(".count-score");
        this.pointsLifeCounter = document.querySelector(".weight-text");
        this.pointsLevelCounter = document.querySelector(".pot-text");
    }
    initialScore() {
        this.pointsLifeCounter.textContent = this.life;
        this.pointsCookiesCounter.textContent = this.point;
        this.pointsLevelCounter.textContent = this.lvl;
    }
    lossLife() {
        this.life = this.life - 1;
        if(this.life <= 0){
            this.life = 0;
        }
        this.pointsLifeCounter.textContent = this.life;
    }

    levelGame() {
        this.lvl = this.lvl + 1;
        this.pointsLevelCounter.textContent = this.lvl;

    }
    pointsCookis() {
        this.point = this.point + 1;
        this.pointsCookiesCounter.textContent = this.point;
    }
}

class ColisionCookCake {
    constructor(){
    }

    checkPositionState (topPosition , checkedCookie){
        if(topPosition > 550){
            if(checkedCookie != '🍄'){
                playGame.gameCounter.lossLife();
            }
            return true;
        }
        if (this.collision()){
            if(checkedCookie === '🍄'){
                playGame.gameCounter.lossLife();
            }else{
                if(!endGame){
                    playGame.gameCounter.pointsCookis();    
                }
            }
            return true; 
        }

        return false;
    }

    collision(){
        if(cookPosTop > cakePosTop && cookPosTop < cakePosTop + cakeWidth){
            if (((cakePosleft > cookPosLeft) && (cakePosleft < cookPosLeft+cookWidth)) ||
                ((cakePosleft + cakeWidth > cookPosLeft && cakePosleft + cakeWidth < cookPosLeft + cookWidth ))){
                    return true;
                }else{
                    return false;
                }
        }else{
            return false;
        }
    }

}

class cookiesFall {
    constructor(){
        this.lidClase = document.querySelector('.kitchen-lid');
    }
    goDown (){
        this.cookiesInterwal = setInterval(()=>{
            let cookieNew = new CookiesGenerator();
            this.lidClase.classList.add('lid-up');
            cookieNew.move();
            setTimeout(()=>{this.lidClase.classList.remove('lid-up')},500);
                     
            if (playGame.gameCounter.life === 0){
                this.stopCookiesFall();               
            }
            
        },3000);
    }

    stopCookiesFall(){
        const cookiesList = document.querySelectorAll('.cookies-body');
        cookiesList.forEach((e)=>e.remove());
        clearInterval(this.cookiesInterwal);
        endGame = true;
        selectedCook.resetCook();
    }
}

class ControlPanel{
    constructor(){
        
        this.checkCollision = new ColisionCookCake();
        this.gameCounter = new Counter();
        this.cookiesFalls = new cookiesFall();
    }

    startGame(){
        this.gameCounter.initialScore();
        this.gesler = new Cook ('gesler', 60);
        this.maklowicz = new Cook ('maklowicz', 185);
        this.jakubiak = new Cook('jakubiak', 310);
        this.starmach = new Cook('starmach', 435);
    }
}

const playGame = new ControlPanel();
playGame.startGame();

// const gesler = new Cook ('gesler');
// const maklowicz = new Cook ('maklowicz');
// const jakubiak = new Cook('jakubiak');
// const starmach = new Cook('starmach');
// const checkCollision = new ColisionCookCake();
// const gameCounter = new Counter();
// const cookiesFalls = new cookiesFall();




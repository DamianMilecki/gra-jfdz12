const listOfCookies = ['🥮','🎂','🍥','🍰','🧁', '🍪', '🍄','🥠', '🥞','🍘','🍩','🍄'];
const cookWidth = 85;
const cakeWidth = 30;
const cakeHeight = 30;

let cookPosTop = 0;
let cookPosLeft = 0;
let selectedCook = null;
let endGame = false;
let pauseGame = false;

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
            this.setPosition();
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
        this.element.classList.remove('active');
        this.element.removeAttribute('style');
    }
}

class CookiesGenerator {
    constructor (){
        this.cookieFrame = document.getElementById('kitchenid');
        this.positionXstart = 320;
        this.positionYstart = 60;
        this.positionXlength = 170 + Math.round(Math.random()*800);
        this.posXlenCor = this.positionXlength + Math.round((970 - this.positionXlength)/2);
        this.cookieTimeMove = this.positionXlength < 370 ? 370 - this.positionXlength + 540 : this.positionXlength -370 +540; 
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
            if (!pauseGame){
            positionXY = this.cakePos(positionXY);
            
            this.cookieBody.style.top = `${positionXY[1]}px`;
            this.cookieBody.style.left = `${positionXY[0]}px`;
            }
            if (playGame.checkCollision.checkPositionState(positionXY[0], positionXY[1], this.randomCookies)){
                clearInterval(cookiesFall);
                this.cookieBody.remove();
                playGame.checkEndGame();
            }
            if (endGame){
                clearInterval(cookiesFall);
                this.cookieBody.remove();
            }

        },10); //Math.round(5000/this.cookieTimeMove*100)/100
    }
    
    cakePos(posXY){
        let posX = posXY[0];
        let posY = posXY[1];
        
        if(posX< 370 && posY===60){
            posX ++;
        }else if(posX===370 && posY<92){
            posY++;
        }else if(posY===92 && this.posXlenCor != posX){
            if(this.posXlenCor > posX){
                posX ++;
            }else{
                posX --;
            }
        }else if (posY===92 && this.posXlenCor === posX){
            posY++;  
            posX--;
        }else if(posY===93 && this.positionXlength != posX){
            if(this.positionXlength > posX){
                posX ++;
            }else{
                posX --;
            }
        }else if(posY> 92 && this.positionXlength === posX){
            posY ++;
        }
      
        return [posX,posY];
    }
}

class ColisionCookCake {
    constructor(){
    }

    checkPositionState (leftCookiePosition, topCookiePosition , checkedCookie){
        if(topCookiePosition > 455){
            if(checkedCookie != '🍄'){
                playGame.gameCounter.lossLife();
            }
            return true;
        }
        if (this.collision(leftCookiePosition, topCookiePosition)){
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

    collision(cakePosleft, cakePosTop){
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
        let i=0;
        this.cookiesInterwal = setInterval(()=>{
            if (endGame){
                clearInterval(this.cookiesInterwal);               
            }
            if(!pauseGame && !endGame){
                let cookieNew = new CookiesGenerator();
                this.lidClase.classList.add('lid-up');
                cookieNew.move();
                setTimeout(()=>{
                    this.lidClase.classList.remove('lid-up')},500);
            }
        },3000);
    }
}

class Counter {
    constructor() {
        this.life = 0;
        this.lvl = 0;
        this.point = 0;
        this.pointsCookiesCounter = document.querySelector(".count-score");
        this.pointsLifeCounter = document.querySelector(".weight-text");
        this.pointsLevelCounter = document.querySelector(".pot-text");
    }
    initialScore(initLife, initLvl, initPoint) {
        this.life = initLife;
        this.lvl = initLvl;
        this.point = initPoint;
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

class EndModal{
    constructor(){
        this.modalEndId = document.getElementById('modalend');
        this.btnEnd = document.getElementById('modal-end-btnend');
        this.btnContinue = document.getElementById('modal-end-btncont');
        this.btnEnd.addEventListener('click', ()=>{
            this.closeGame();
        });
        this.btnContinue.addEventListener('click', ()=>{
            this.continueGame();
        });
    }

    showModal(){
        this.modalEndId.style.display = 'block';
    }

    hideModal(){
        this.modalEndId.style.display = 'none';
    }

    closeGame(){
        window.open('','_self').close();
        // window.opener = self;
        // window.close();
    }

    continueGame(){
        this.hideModal();
        playGame.startGame();
        //window.location.reload();        
    }
}

class ControlPanel{
    constructor(){
        this.checkCollision = new ColisionCookCake();
        this.cookiesFalls = new cookiesFall();
        this.gameCounter = new Counter();
        this.gesler = new Cook ('gesler', 60);
        this.maklowicz = new Cook ('maklowicz', 185);
        this.jakubiak = new Cook('jakubiak', 310);
        this.starmach = new Cook('starmach', 435);
        this.pauseGameButton = document.getElementById('cookiespause');
        this.pauseGameButton.addEventListener('click', (e)=>this.pauseGamebtn());
    }

    startGame(){
        this.gameCounter.initialScore(3,1,0);
        selectedCook = null;
        endGame = false;
        pauseGame = false;
    }

    endGame(){
        this.endModal = new EndModal();
        this.endModal.showModal();
    }

    checkEndGame(){
        if(this.gameCounter.life === 0){
            endGame = true;
            selectedCook.resetCook();
            this.endGame();
        }
    }

    pauseGamebtn(){
        pauseGame = !pauseGame;
    }
}

let playGame = new ControlPanel();
playGame.startGame();






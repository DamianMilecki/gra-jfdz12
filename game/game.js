const listOfCookies = ['🥮','🎂','🍥','🍰','🧁', '🍪', '🍄','🥠', '🥞','🍘','🍩','🍄'];

let cookPosLeft = 0;
let cookWidth = 70;
let cookPosTop = 0;
let cakePosTop = 0;
let cakePosleft = 0;
let cakeWidth = 30;
let cakeHeight = 30;
let cakeCount = 0;
let colisionCC = null;
let selectedCookName = '';

class Cook {
    constructor(cookName){
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
            this.getPosition();
            selectedCookName = this.cookName; 
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
            this.cookHorizontalPosition - 15 :
            this.cookHorizontalPosition + 15
        ; 
        this.element.style.left = `${this.cookHorizontalPosition}px`;
        this.getPosition();
    }

    getPosition(){
        cookPosLeft =  this.element.offsetLeft;
        cookPosTop = this.element.offsetTop;
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
        if(this.randomCookies === '🍄' ){
            this.cookieBody.classList.add('cookies-anime-blinking');
         }else{
            this.cookieBody.classList.add('cookies-anime');
         };   
    }

    move(){
        let x = new Date();
        this.createCookie();
        let positionXY = [this.positionXstart,this.positionYstart];
        const cookiesFall = setInterval(()=>{
            positionXY = this.cakePos(positionXY);
            this.cookieBody.style.top = `${positionXY[1]}px`;
            this.cookieBody.style.left = `${positionXY[0]}px`;
            cakePosTop = this.cookieBody.offsetTop;
            cakePosleft = this.cookieBody.offsetLeft;
            if(positionXY[1] > 550 || checkCollision.collision() ){
                clearInterval(cookiesFall);
                //console.log('ff=', this.cookieTimeMove, Math.round(5000/this.cookieTimeMove*100)/100, this.positionYlength,'ti=', new Date() - x)
                this.cookieBody.remove();  
            }
        },Math.round(5000/this.cookieTimeMove*100)/100);
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
        return [posX,posY];
    }
}

class ColisionCookCake {
    constructor(){
        this.countScore = document.getElementById('countscore');
        this.cookName = selectedCookName;
        this.corrHat = this.cookCorrPos();
    }
    
    cookCorrPos(){
        if (this.cookName === 'gesler'){
            return 7;
        }else if(this.cookName ==='maklowicz'){
            return 35;
        }else if(this.cookName === 'jakubiak'){
            return 28;
        }else if(this.cookName === 'starmach'){
            return 0;   
        }else{
            return 0;
        }
    }

    collision(){
        let cookPosLeftCorr = cookPosLeft + this.corrHat;
        if(cookPosTop > cakePosTop && cookPosTop < cakePosTop + cakeWidth){
            if (((cakePosleft > cookPosLeftCorr) && (cakePosleft < cookPosLeftCorr+cookWidth)) ||
                ((cakePosleft + cakeWidth > cookPosLeftCorr && cakePosleft + cakeWidth < cookPosLeftCorr + cookWidth ))){
                    cakeCount ++;
                    this.countScore.innerText = cakeCount;
                    return true;
                }else{
                    return false;
                }
        }else{
            return false;
        }
    }

}

let selectedCook = null;
const gesler = new Cook ('gesler');
const maklowicz = new Cook ('maklowicz');
const jakubiak = new Cook('jakubiak');
const starmach = new Cook('starmach');
const checkCollision = new ColisionCookCake();

const cookiesFlow = function(){
    let i = 0;

    const lidClase = document.querySelector('.kitchen-lid');
    const cookiesInterwal = setInterval(()=>{
        let cookieNew = new CookiesGenerator();
        lidClase.classList.add('lid-up');
        cookieNew.move();
        i++;
        setTimeout(()=>{lidClase.classList.remove('lid-up')},500);
        if (i>20){
            clearInterval(cookiesInterwal);
        }
    },3000);
}

cookiesFlow();

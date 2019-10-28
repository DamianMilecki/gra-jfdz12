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

class Cook {
    constructor(cookName, cookPosition){
        this.cookName = cookName;
        this.cookPosition = cookPosition;
        this.cookHorizontalPosition = 0;
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
        });

        window.addEventListener('keydown', (event) => {
            this.handleMove(event.key);
        })
    }

    handleMove(key){
        if(this.element.offsetTop !== 454){
            return
        }
        if (key === 'ArrowRight' && this.cookHorizontalPosition<420){
            this.move('right');          
        }
        if (key === 'ArrowLeft' && this.cookHorizontalPosition>-360){
            this.move('left');
        }
    }

    move(direction){
        this.cookHorizontalPosition = direction === 'left' ?
            this.cookHorizontalPosition - 15 :
            this.cookHorizontalPosition + 15
        ; 
        this.element.style.marginLeft = `${this.cookHorizontalPosition}px`;
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
         //console.log(`cia-t:${cakePosTop}, cia-l:${cakePosleft}, kt:${cookPosTop}, kl:${cookPosLeft}`);
         //console.log(`cia-t:${cakePosTop}, cia-l:${cakePosleft}, ${this.positionYlength}`);
            if(positionXY[1] > 550 || colisionCookCake() ){
                clearInterval(cookiesFall);
                console.log('ff=', this.cookieTimeMove, Math.round(5000/this.cookieTimeMove*100)/100, this.positionYlength,'ti=', new Date() - x)
                this.cookieBody.remove();  
            }
        },Math.round(5000/this.cookieTimeMove*100)/100);
    }
    
    cakePos(posXY){
        let counterX = posXY[0];
        let counterY = posXY[1];
        if((counterX< 370 && counterY===60)  ){
            counterX ++;
        }else if(counterX===370 && counterY<93){
            counterY++;
        }else if(counterY===93 && this.positionYlength != counterX){
            if(this.positionYlength > counterX){
                counterX ++;
            }else{
                counterX --;
            }
        }else if(this.positionYlength === counterX){
            counterY ++;
        }
        return [counterX,counterY];
    }
}

let selectedCook = null;
const gesler = new Cook ('gesler', 454);
const maklowicz = new Cook ('maklowicz', 454);
const jakubiak = new Cook('jakubiak', 454);
const starmach = new Cook('starmach', 454);


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







const colisionCookCake = function () {
    const countScore = document.getElementById('countscore');
    
    if(cookPosTop > cakePosTop && cookPosTop < cakePosTop + cakeWidth){
        if (((cakePosleft > cookPosLeft) && (cakePosleft < cookPosLeft+cookWidth)) ||
            ((cakePosleft + cakeWidth > cookPosLeft && cakePosleft + cakeWidth < cookPosLeft + cookWidth ))){
                cakeCount ++;
                countScore.innerText = cakeCount;
                return true;
            }else{
                return false;
            }
    }else{
        return false;
    }
}








// const hero = document.querySelector(".hero");

// hero.style.color = "red";
// hero.style.position = "absolute";

// hero.position = 0;
// hero.style.top = "50px";

// function fall() {
//   hero.style.top = `${hero.position + 5}px`;
//   hero.position = parseInt(hero.style.top);
// }

// const intervalId = setInterval(function() {
//   fall();
//   if (hero.position > window.innerHeight) {
//     clearInterval(intervalId)
//     hero.position = 0;
//   }
//   console.log(hero.position)
//   console.log(window.innerHeight);
// }, 20);

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
            this.element.style.marginLeft = '500px';
            this.element.style.marginTop = `${this.cookPosition}px`;
            this.element.style.transform = "scale(1.6)";
            this.getPosition();
        });

        window.addEventListener('keydown', (event) => {
            this.handleMove(event.key);
        })
    }

    handleMove(key){
        if(this.element.offsetTop !== 453){
            return
        }
        if (key === 'ArrowRight' && this.cookHorizontalPosition<915){
            this.move('right');          
        }
        if (key === 'ArrowLeft' && this.cookHorizontalPosition>110){
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

let selectedCook = null;
const gesler = new Cook ('gesler', 393);
const maklowicz = new Cook ('maklowicz', 268);
const jakubiak = new Cook('jakubiak', 143);
const starmach = new Cook('starmach', 18);




// const cookiesRandomGenerator = function () {
//     const cookieFrame = document.getElementById('kitchenid');
//         const cookieBody = document.createElement('span');
//         cookieFrame.appendChild(cookieBody);
//         const randomCookies = listOfCookies[Math.abs(Math.round(Math.random()*listOfCookies.length-1))];
//         const cookieEmoti = document.createTextNode(randomCookies);
//         cookieBody.appendChild(cookieEmoti);
//         if (randomCookies === '🍄'){
//             cookieBody.classList.add('cookies-anime-blinking');
//             } else{
//                 cookieBody.classList.add('cookies-anime');
//             }
//         cookieBody.setAttribute('id','cookies1id');
//         cookieBody.addEventListener("animationend", function(){
//             document.getElementById('cookies1id').remove();
//         });
// }

const cookiesFlow = function(){
    let i = 0;
    const lidClase = document.querySelector('.kitchen-lid');
    const cookiesInterwal = setInterval(()=>{
        lidClase.classList.add('lid-up');
        cookiesRandomGenerator();        
        i++;
        setTimeout(()=>{lidClase.classList.remove('lid-up')},2000);
        if (i>20){
            clearInterval(cookiesInterwal);
        }
    },5000);
}

cookiesFlow();



const cookiesRandomGenerator = function () {
    const cookieFrame = document.getElementById('kitchenid');
    const cookieBody = document.createElement('span');
    cookieFrame.appendChild(cookieBody);
    const randomCookies = listOfCookies[Math.abs(Math.round(Math.random()*listOfCookies.length-1))];
    const cookieEmoti = document.createTextNode(randomCookies);
    cookieBody.appendChild(cookieEmoti);
        
    if (randomCookies === '🍄'){
        cookieBody.classList.add('cookies-anime-blinking');
        } else{
            cookieBody.classList.add('cookies-anime');
    }
    let counter = 60;
    let positionY = 320 + Math.round(Math.random()*800) - 150;
    const cookiesFall = setInterval(()=>{
        counter ++;
        cookieBody.style.top = `${counter}px`;
        cookieBody.style.left = `${positionY}px`;
        cakePosTop = cookieBody.offsetTop;
        cakePosleft = cookieBody.offsetLeft;
        //console.log(`cia-t:${cakePosTop}, cia-l:${cakePosleft}, kt:${cookPosTop}, kl:${cookPosLeft}`);
        
        if(counter > 550 || colisionCookCake() ){
            clearInterval(cookiesFall);
            cookieBody.remove();
               
        }
    },10)      
}

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

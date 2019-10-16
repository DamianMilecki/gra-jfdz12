const listOfCookies = ['🥮','🎂','🍥','🍰','🧁', '🍪', '🥠', '🥞','🍘','🥠','🍩','🍄'];

const arrowPress = function (){
    const catchKey = document.getElementsByTagName ('body')[0];
    let positionBox = 500;
    let positionBox2 = 0;
    let positionBox3 = 0;
        
    catchKey.addEventListener('keydown', function (event) {
        const key = event.key;
        // console.log(key);
        const myBox = document.getElementById('cook-move');
        const myBox2 = document.getElementById('cook-move2');
        const myBox3 = document.getElementById('cook-move3');
        
        if (key === 'ArrowRight' && positionBox<915){
            positionBox = positionBox + 8;
            myBox.style.marginLeft = positionBox + 'px';               
        }
        if (key === 'ArrowLeft' && positionBox>110){
            positionBox = positionBox - 8;
            myBox.style.marginLeft = positionBox + 'px';
        }
    }); 
}
arrowPress();

const cookMove = function(){
    const cookPoz = document.getElementById('cook-move');
        
    const cookPozEl = cookPoz.addEventListener('click', ()=>{
        if (cookPoz.style.marginTop != '400px'){
        cookPoz.classList.add('cooks-animation');
        cookPoz.addEventListener('animationend', ()=>{
            cookPoz.classList.remove('cooks-animation');
            cookPoz.style.marginLeft = '500px';
            cookPoz.style.marginTop = "393px";
            cookPoz.style.transform = "scale(1.6)";
            cookPoz.removeEventListener('click', cookPozEl);
            })
        }
    })
    
}
cookMove();

const cookiesRandomGenerator = function () {
    const cookieFrame = document.getElementById('kitchenid');
        const cookieBody = document.createElement('span');
        cookieFrame.appendChild(cookieBody);
        const randomCookies = listOfCookies[Math.abs(Math.round(Math.random()*listOfCookies.length-1))];
        const cookieEmoti = document.createTextNode(randomCookies);
        cookieBody.appendChild(cookieEmoti);
        cookieBody.classList.add('cookies-anime');
        cookieBody.setAttribute('id','cookies1id');
        cookieBody.addEventListener("animationend", function(){document.getElementById('cookies1id').remove();});
}

const cookiesFlow = function(){
    let i = 0;
    const lidClase = document.querySelector('.kitchen-lid');
    //cookiesRandomGenerator();
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
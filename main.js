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
        if (key === '.' && positionBox2<1000 ){
            positionBox2 = positionBox2 + 5;
            myBox2.style.marginLeft = positionBox2 + 'px';               
        }
        if (key === ',' && positionBox2>-220){
            positionBox2 = positionBox2 - 5;
            myBox2.style.marginLeft = positionBox2 + 'px';
        }
        if (key === ']' && positionBox3<760 ){
            positionBox3 = positionBox3 + 5;
            myBox3.style.marginLeft = positionBox3 + 'px';               
        }
        if (key === '[' && positionBox3>-300){
            positionBox3 = positionBox3 - 5;
            myBox3.style.marginLeft = positionBox3 + 'px';
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
            cookPoz.style.marginTop = "390px";
            cookPoz.style.transform = "scale(2)";
            cookPoz.removeEventListener('click', cookPozEl);
            })
        }
    })
    
}
cookMove();

const cookiesRandomGenerator = function () {
    const cookieFrame = document.getElementById('maincontent');
        const cookieBody = document.createElement('span');
        cookieFrame.appendChild(cookieBody);
        const randomCookies = listOfCookies[Math.abs(Math.round(Math.random()*listOfCookies.length-1))];
        const cookieEmoti = document.createTextNode(randomCookies);
        cookieBody.appendChild(cookieEmoti);
        cookieBody.classList.add('cookies1');
        cookieBody.setAttribute('id','cookies1id');
        cookieBody.addEventListener("animationend", function(){document.getElementById('cookies1id').remove();});
}

const cookiesFlow = function(){
    // cookiesRandomGenerator();
    let i = 0;
    const cookiesInterwal = setInterval(()=>{
        cookiesRandomGenerator();
        i++;
        if (i>20){
            clearInterval(cookiesInterwal);
        }
    },5000);
}

cookiesFlow();
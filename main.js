const listOfCookies = ['🥮','🎂','🍥','🍰','🧁', '🍪', '🥠', '🥞','🍘','🍩','🍄'];

const arrowPress = function (myBox){
    let positionBox = 500;
        
    window.addEventListener('keydown', function (event) {
        const key = event.key;
        
        if (key === 'ArrowRight' && positionBox<915){
            positionBox = positionBox + 15;
            myBox.style.marginLeft = positionBox + 'px';               
        }
        if (key === 'ArrowLeft' && positionBox>110){
            positionBox = positionBox - 15;
            myBox.style.marginLeft = positionBox + 'px';
        }
    }); 
}

const addEventForCook = function(){
    const itemsCook = document.querySelectorAll('.cook');
    const topCookPosition = [393, 268, 143, 18];
    
    itemsCook.forEach((el,idx)=>{
         el.addEventListener('click',()=>{
            const itemsCookActive = document.querySelectorAll('.cook.active');
            if(itemsCookActive.length === 0){
                el.classList.add(`cooks-animation${idx}`);
                el.classList.add('active');
                el.addEventListener('animationend', ()=>{
                    el.classList.remove(`cooks-animation${idx}`);
                    el.style.marginLeft = '500px';
                    el.style.marginTop = `${topCookPosition[idx]}px`;
                    el.style.transform = "scale(1.6)";
                    arrowPress(el);
                })
            }
        })
    })

}

addEventForCook();
// const cookMove = function(){
//     const cookPoz = document.getElementById('cook-move');
//     // const cookPoz1 = document.getElementById('cook-move1');
//     // const cookPoz2 = document.getElementById('cook-move2');
//     // const cookPoz3 = document.getElementById('cook-move3');
     

//     const cookPosEl = cookPoz.addEventListener('click', ()=>{
//         if (cookPoz.style.marginTop != '393px'){
//         cookPoz.classList.add('cooks-animation');
//         cookPoz.classList.add('acti');
//         cookPoz.addEventListener('animationend', ()=>{
//             cookPoz.classList.remove('cooks-animation');
//             cookPoz.style.marginLeft = '500px';
//             cookPoz.style.marginTop = "393px";
//             cookPoz.style.transform = "scale(1.6)";
//             cookPoz.removeEventListener('click', cookPosEl);
//             })
//         }
//     })
    
// }
// cookMove();

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
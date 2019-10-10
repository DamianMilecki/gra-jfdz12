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

        if (key === 'ArrowRight' && positionBox<1020 ){
            positionBox = positionBox + 5;
            myBox.style.marginLeft = positionBox + 'px';               
        }
        if (key === 'ArrowLeft' && positionBox>0){
            positionBox = positionBox - 5;
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
        cookPoz.classList.add('cooks-animation');
        cookPoz.addEventListener('animationend', ()=>{
            cookPoz.classList.remove('cooks-animation');
            cookPoz.style.marginLeft = '500px';
            cookPoz.style.marginTop = "450px";
            cookPoz.style.transform = "scale(1.2)";
        })
    })
    cookPoz.removeEventListener(cookPozEl);
}
cookMove();
const listOfCookies = ['🥮', '🎂', '🍥', '🍰', '🧁', '🍪', '🍄', '🥠', '🥞', '🍘', '🍩', '🍄'];
const cookWidth = 85;
const cakeWidth = 20;
const cakeHeight = 30;
const levelChange = 5;
const cookieSpeedStep = 1;
const cookieFrequencyStep = 200;

let userData = {};
let cookPosTop = 0;
let cookPosLeft = 0;
let selectedCook = null;
let endGame = false;
let pauseGame = false;
let resetFlow = false;
let cookieSpeed = 8;
let cookieFrequency = 4000;
let cookStep = 0;

const configFireabse = {
    databaseURL: "https://cookiesscoreboard.firebaseio.com/",
  };
firebase.initializeApp(configFireabse);


class Cook {
    constructor(cookName, cookStartX){
        this.cookStartX = cookStartX;
        this.cookName = cookName;
        this.cookPosition = 429;
        this.cookHorizontalPosition = 479;
        this.element = document.querySelector(`.${cookName}`);
        this.keyEventListener = null;
        this.element.addEventListener('click',()=>{
            this.enter();
        });
    }

    enter (){

        if (null !== selectedCook) {
            return;
        }

        selectedCook = this;

        playGame.infoBoxRemove('info-start');

        this.element.classList.add(`cooks-animation-${this.cookName}`);
        this.element.classList.add('active');
        
        this.cookAnimation = this.cookAnimation.bind(this);
        this.element.addEventListener('animationend',this.cookAnimation); 
        
        window.addEventListener('keydown', this.handleMove);
    }

    cookAnimation(){
        this.element.classList.remove(`cooks-animation-${this.cookName}`, 'cook');
        this.element.style.left= '479px';
        this.element.style.top = `${this.cookPosition}px`;
        this.element.classList.add('cook-active');

        this.setPosition();
        
        this.element.removeEventListener('animationend',this.cookAnimation);
    
        cookiesFlow();    
    }

    handleMove(event){
        if(selectedCook.element.offsetTop !== 429 || pauseGame){
            return
        }
        if (event.key === 'ArrowRight' && selectedCook.cookHorizontalPosition < 900){
            selectedCook.move('right');
        }
        if (event.key === 'ArrowLeft' && selectedCook.cookHorizontalPosition > 140){
            selectedCook.move('left');
        }
    }

    move(direction){
        this.cookHorizontalPosition = direction === 'left' ?
            this.cookHorizontalPosition - 10 - cookStep :
            this.cookHorizontalPosition + 10 + cookStep
        ; 
        this.element.style.left = `${this.cookHorizontalPosition}px`;
        this.setPosition();
    }

    cookCorrPos(){
        if(this.cookName === 'gesler'){
            return 10;
        }else if (this.cookName ==='maklowicz'){
            return 35;
        }else if(this.cookName === 'jakubiak'){
            return 25;
        }else if(this.cookName === 'starmach'){
            return 10;
        }else{
            return 0;
        }
    }

    setPosition(){
        cookPosLeft = this.element.offsetLeft + this.cookCorrPos();
        cookPosTop = this.element.offsetTop;
    }

    resetCook(){
        this.element.classList.remove('active', 'cook-active');
        this.element.removeAttribute('style');
        this.element.classList.add('cook');
        cookPosTop = 0;
        cookPosLeft = 0;
        this.cookHorizontalPosition = 479;
        window.removeEventListener('keydown', this.handleMove);
    }
}


let cookieFrame = null;
let nextCookie = null;

function cookieStart() {
    
    const randomCookie = listOfCookies[Math.abs(Math.round(Math.random()*listOfCookies.length-1))];
    
    cookieFrame = document.getElementById('kitchenid');
    nextCookie = document.createElement('span');
    
    cookieFrame.appendChild(nextCookie);
    const cookieEmoti = document.createTextNode(randomCookie);
    
    nextCookie.appendChild(cookieEmoti);
    nextCookie.classList.add('cookies-body');
    
    if (randomCookie === '🍄'){
            nextCookie.classList.add('cookies-blinking');
    } 
    
    return randomCookie;
};

const cakePos = function(posXY, positionXlength, posXlenCor){
    let posX = posXY[0];
    let posY = posXY[1];
    
    if(posX < 370 && posY === 60){
        posX ++;
    }else if(posX === 370 && posY < 92){
        posY++;
    }else if(posY === 92 && posXlenCor != posX){
        if(posXlenCor > posX){
            posX ++;
        }else{
            posX --;
        }
    }else if (posY === 92 && posXlenCor === posX){
        posY++;  
        posX--;
    }else if(posY === 93 && positionXlength != posX){
        if(positionXlength > posX){
            posX ++;
        }else{
            posX --;
        }
    }else if(posY > 92 && positionXlength === posX){
        posY ++;
    }
  
    return [posX,posY];
}

const cookiesRandomGenerator = function () {
    const randomCookieGen = cookieStart();
    const cookieXPosition = 320;
    const cookieYPosition = 60;
    const positionXlength = 170 + Math.round(Math.random()*800);
    const posXlenCor = positionXlength + Math.round((970 - positionXlength)/2);
    
    let idNum = Math.floor(Math.random()*100000);
    nextCookie.setAttribute("id", idNum);
    let myCookie = document.getElementById(idNum);
    
    let positionXY = [cookieXPosition , cookieYPosition];
    
    const cookieMoveInterval = setInterval(()=> {
        if (!pauseGame){    
            positionXY = cakePos(positionXY, positionXlength, posXlenCor);
        
            myCookie.style.left = `${positionXY[0]}px`;
            myCookie.style.top = `${positionXY[1]}px`;
        }
        if (playGame.checkCollision.checkPositionState(positionXY[0], positionXY[1], randomCookieGen)){
            clearInterval(cookieMoveInterval);
            myCookie.remove();
            playGame.checkEndGame();
        }
        if (endGame){
            clearInterval(cookieMoveInterval);
            myCookie.remove();
        }
    },cookieSpeed);
}

const cookiesFlow = function(){
    const lidClase = document.querySelector('.kitchen-lid');
 
    const cookiesInterval = setInterval(()=>{
        if (endGame){
            clearInterval(cookiesInterval);               
        }
        if(resetFlow){
            clearInterval(cookiesInterval);
            resetFlow = false;
            cookiesFlow();
        }
        if(!pauseGame && !endGame){
            lidClase.classList.add('lid-up');
            cookiesRandomGenerator();        
            setTimeout(()=>{lidClase.classList.remove('lid-up')},500);
        }
    },cookieFrequency);
    
};

class ColisionCookCookie {
    constructor(){
        this.points = 0;
        this.level = 0;
    }

    checkPositionState (leftCookiePosition, topCookiePosition , checkedCookie){
        if(topCookiePosition > 450){
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
                    this.addPointAndLevel();    
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

    addPointAndLevel(){
        playGame.gameCounter.pointsCookis();
        this.points = playGame.gameCounter.point;
        this.level = playGame.gameCounter.lvl;

        if (this.points === levelChange*this.level){
            playGame.gameCounter.levelGame();
            this.changeSpeed();
        } 
    }

    changeSpeed(){
        cookStep = cookStep < 30 ? cookStep = cookStep + 2 : cookStep;
        cookieSpeed = cookieSpeed > 2 ? cookieSpeed - cookieSpeedStep : cookieSpeed;
        if(cookieFrequency > 501){
            cookieFrequency =  cookieFrequency - cookieFrequencyStep;
        }else{
            cookieFrequency;
        }
        resetFlow = true;
    }
}

//instructionModal


function enterStartModal(){
    const instructionModal = document.getElementById("instructionModalId");
    const instructionModalBtn = document.getElementById("instructionModalBtnId");
    
    instructionModal.style.display = "block";

    instructionModalBtn.addEventListener("click", function() {
        instructionModal.style.display = "none";
        nickEnterModal();
    });

    setTimeout(() => moveInstructionContentUp(), 2000);    
    
}

function opacityFunction(opacityRange, instructionArray) {
    let i =0;
    let ii = 0;
    let j = 0;
   
    const opacityFlow = setInterval (function() {
        if (j < opacityRange.length && ii < instructionArray.length) {
            instructionArray[ii].style.opacity = opacityRange[j];
            j++; 
        }
        if (j === opacityRange.length) {
            j = 0;
            ii++;
        }
        i++;
        if(i === opacityRange.length  * instructionArray.length){
            clearInterval(opacityFlow);
        }
        
    },150);
};

function contentHeightPlus(instructionModalContent) {
    let actualHeight = parseFloat(window.getComputedStyle(instructionModalContent, null).getPropertyValue("height"));
    let contentInterval = setInterval(function(){
        actualHeight++;
        instructionModalContent.style.height=actualHeight+"px";
        if (actualHeight>430) {
            clearInterval(contentInterval)
        }
    },9)
};

function moveInstructionContentUp() {
    const instructionModalBackBtn = document.getElementById("instructionModalBackId");
    const instructionModalBtn = document.getElementById("instructionModalBtnId");
    
    const instructionFirstPoint = document.getElementById("instructionModal--firstPoint");
    const instructionSecondPoint = document.getElementById("instructionModal--secondPoint");
    const instructionThirdPoint = document.getElementById("instructionModal--thirdPoint");
    
    const instructionArray = [instructionFirstPoint, instructionSecondPoint, instructionThirdPoint, instructionModalBtn, instructionModalBackBtn];
    const opacityRange = [0.2, 0.4, 0.6, 0.8, 1];
    
    const instructionModalContent = document.getElementById("instructionModal--content");

    let actualTop = parseFloat(window.getComputedStyle(instructionModalContent, null).getPropertyValue("top"));
 
    const contentTopInterval = setInterval(function(){
        actualTop--;
        
        instructionModalContent.style.top=actualTop + "px";
        if (actualTop < 100) {
            clearInterval(contentTopInterval);
            contentHeightPlus(instructionModalContent);
            opacityFunction(opacityRange,instructionArray);}
        },10);
};

let nick;

const nickEnterModal = function(){
    const nickModalBtn = document.getElementById("nickModalBtnId");
    const nickModal = document.getElementById("nickModalId");
    nickModal.style.display = "block";
    nickModalBtn.addEventListener("click", () => nickModalFun(nickModal, nickModalBtn)); 
}

const nickModalFun = function(nickModal, nickModalBtn) {
    const nickInfo = document.getElementsByClassName("nickModalInfo")[0];
    nick = document.getElementById("nickModalInputId").value;
    if (nick.length>0) {
        nickModal.style.display = "none";
        nickModalBtn.removeEventListener("click", nickModalFun);
        playGame.infoBoxShow('startInfo', false);
    } else {
        nickInfo.innerText="Nick powinien mieć przynajmniej jeden znak."
    }
};

class InfoBox {
    constructor(){
        this.box = document.querySelector('.info-body');
        this.text = document.querySelector('.info-text');
        this.boxType = [
            {name: "looseLife", clasName:"info-life", boxText: "Straciłeś życie", time: 1500},
            {name: "changeLevel", clasName:"info-level", boxText: "Poziom ", time: 2000 },
            {name: "startInfo", clasName:"info-start", boxText: "Wybierz kucharza aby rozpocząć", time: 0}
        ];
    }

    startDisplay(name, param){
        const chosenName = this.boxType.filter((el)=>el.name === name );

        this.showBox(chosenName[0].clasName);
        this.infoAddText(chosenName[0].boxText, param);

        if (chosenName[0].time > 0){
            setTimeout(()=>{
                this.removeBox(chosenName[0].clasName);
            }, chosenName[0].time);
        }
    }
    showBox(infoClass){
        this.box.style.display='block';
        this.box.classList.add(`${infoClass}`);
    }

    removeBox(infoClass){
        this.box.style.display="none";
        this.text.innerText = "";
        this.box.classList.remove(`${infoClass}`);
    }

    infoAddText(text, param){
        this.text.innerText = `${text} ${ param ? param : ''}`;
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
        this.pointsLifeCounter.textContent = this.life;
        this.life > 0 ? playGame.infoBoxShow('looseLife',false) : null;
    }
    levelGame() {
        this.lvl = this.lvl + 1;
        this.pointsLevelCounter.textContent = this.lvl;
        playGame.infoBoxShow('changeLevel',this.lvl);
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
        this.modalUserData = document.querySelector('.modal-user-data');
        this.modalScore = document.querySelector('.modal-score');
        this.modalScoreBoard = document.querySelector('.modal-scoreboard');
        this.scoreBoard = [];
        this.userScoreBoard = {};
        this.btnEnd.addEventListener('click', ()=>{
            this.closeGame();
        });
        this.btnContinue.addEventListener('click', ()=>{
            this.continueGame();
        });
        this.db = firebase.database();
    }

    showModal(){
        this.addScoreBoard();
    }

    hideModal(){
        this.modalEndId.style.display = 'none';
    }

    closeGame(){
        this.setDataToFirebase();
        window.open('../index.html', '_self');
    }

    continueGame(){
        this.setDataToFirebase();
        this.scoreBoard = [];
        this.userScoreBoard = {};
        this.modalScoreBoard.innerHTML = "";
        this.hideModal();
        playGame.startGame();  
    }

    addScoreBoard(){
        this.userScoreBoard = {
            score: playGame.gameCounter.point,
            name: (nick != null && nick != "") ? nick : "no nick",
            email: (userData.email != null && userData.email != "") ? userData.email : "no mail" 
        }
        this.getDataFromFirebase();
    }

    getDataFromFirebase(){
        this.db.ref("scores/").once('value').then((el) => {
            this.scoreBoard = el.val();
            this.scoreBoard.sort((a, b) => (a.score < b.score) ? 1 : -1);
            if(this.scoreBoard.length > 0){
                this.sortScoreboardData(true);
            }else{
                this.sortScoreboardData(false);
            }
        });
    }

    sortScoreboardData(checkEmpty){
        if (checkEmpty){
            if (this.scoreBoard.length < 10){
                this.scoreBoard.push(this.userScoreBoard);
            }

            if (this.scoreBoard.length === 10){
                if (this.scoreBoard[9].score <= this.userScoreBoard.score){
                    this.scoreBoard.pop();
                    this.scoreBoard.push(this.userScoreBoard);
                }
            }
             if (this.scoreBoard.length > 10){
                 console.log('za dużo danych');
             }

            this.scoreBoard.sort((a, b) => (a.score < b.score) ? 1 : -1);

        }else{
            this.scoreBoard.push(this.userScoreBoard);
        }
        this.showModalData();
    }

    showModalData(){
        this.modalEndId.style.display = 'block';
        this.modalUserData.innerText = this.userScoreBoard.name; 
        this.modalScore.innerText = playGame.gameCounter.point;
        for (let i=0 ; (i < 10 && i < this.scoreBoard.length); i++){
            this.modalScoreBoard.innerHTML += `<div class="score-bord-list">
                <span class="score-board-name">
                ${this.scoreBoard[i].name === this.userScoreBoard.name ? "<strong>": ""}
                ${[i+1]}.  ${this.scoreBoard[i].name} </span>
                <span class="score-board-score">
                ${this.scoreBoard[i].score}
                ${this.scoreBoard[i].name === this.userScoreBoard.name ? "</strong>": ""}
                </span></div>`;
        }
    }

    setDataToFirebase(){
        this.db.ref('scores').set(this.scoreBoard, function(error) {
            if (error) {
                console.log("The write failed...")
            }
        });
    }
}

class ControlPanel{
    constructor(){
        this.checkCollision = new ColisionCookCookie();
        this.gameCounter = new Counter();
        this.gesler = new Cook ('gesler', 60);
        this.maklowicz = new Cook ('maklowicz', 185);
        this.jakubiak = new Cook('jakubiak', 310);
        this.starmach = new Cook('starmach', 435);
        this.pauseGameButton = document.getElementById('cookiespause');
        this.pauseGameButton.addEventListener('click', (e)=>this.pauseGamebtn());
        this.infoBox = new InfoBox()
    }

    infoBoxShow(name ,param){
        this.infoBox.startDisplay(name, param);
    }

    infoBoxRemove(className){
        this.infoBox.removeBox(className);
    }

    startGame(){
        this.getUserDataSesionStorage();
        this.gameCounter.initialScore(3,1,0);
        selectedCook = null;
        endGame = false;
        pauseGame = false;
        cookieSpeed = 8;
        cookieFrequency = 4000;
        cookStep = 0;
        enterStartModal();
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
        if(pauseGame) {
            this.pauseGameButton.innerHTML = `<i class="far fa-play-circle"></i>`;
        }else{
            this.pauseGameButton.innerHTML = `<i class="far fa-pause-circle"></i>`;
        }
    }

    getUserDataSesionStorage(){
        userData = JSON.parse (sessionStorage.getItem('userData'));
        if(userData === null){
            userData = {
                    name: "",
                    email: ""
                };
            }
    }
}

const playGame = new ControlPanel();
playGame.startGame();

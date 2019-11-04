class EmailValid {
    constructor(emailInput, emailInputSubtext){
        this.emailInput = document.getElementById(emailInput);
        this.emailInputSubtext = document.getElementById(emailInputSubtext);
        this.classTrue = 'inputEmail3SubtextTrue';
        this.classFalse = 'inputEmail3SubtextFalse';
    }

    emailIsValid () {
        return /\S+@\S+\.\S{2,}/.test(this.emailInput.value);
    }
    
    emailSubtext(subtext){
        let subtextVal = "";
        if(subtext !== 'Empty'){
            this.emailInputSubtext.classList.toggle(subtext === 'True' ? this.classFalse : this.classTrue , false);
            this.emailInputSubtext.classList.add(subtext === 'True' ? this.classTrue : this.classFalse , false);
            subtextVal = subtext === 'True' ? "poprawny email" : "wprowadź poprawny email" ;
        }
        this.emailInputSubtext.innerText = subtextVal;
    }

    emailInputEmpty(){
        this.emailInput.value = "";
    }

    emailCheck(){
        this.emailInput.addEventListener('input',()=>{
            if (this.emailIsValid()) {
                this.emailSubtext('True');
            }else{
                if (this.emailInput.value ===''){
                    this.emailSubtext('Empty');
                }else{
                    this.emailSubtext('False');
                }
            }    
        }); 
    }

    emailSaveToSesionStorage(){
        const userData = {
            name: "",
            email: this.emailInput.value
        } 

        const userDataJson = JSON.stringify(userData);
        sessionStorage.setItem('userData', userDataJson);

    }
}

class EmailModal {
    constructor (){
        this.emModal = document.getElementById('emailmodalid');
        this.btnPlay = document.getElementById('email-btnplay');
        this.btnExit = document.getElementById('email-btnexit');
        this.btnPlay.addEventListener('click',()=>{
            this.btnPlayEvent()
        });
        this.btnExit.addEventListener('click',()=>{
            this.btnExitEvent();
        });
    }

    btnPlayEvent() {
        window.open('game/game.html');
        this.emModal.style.display = "none";
    };
    
    btnExitEvent() {
        this.emModal.style.display = "none";
    };
      
    showModal() {
        this.emModal.style.display = "block";
      }
}

const emailSubmit = function (){
    const emailSubmitButton = document.getElementById('btn-email-submit');
    emailSubmitButton.addEventListener('click', (event)=>{
        
        let emailValid = emailCheck.emailIsValid();
        event.preventDefault();
        if (emailValid){
            emailModal.showModal();
            emailCheck.emailSaveToSesionStorage();
            emailCheck.emailSubtext('Empty');
            emailCheck.emailInputEmpty();
        }else{
            emailCheck.emailSubtext('False');
            emailCheck.emailCheck();
        }
    });
}

const emailCheck = new EmailValid('inputEmail3','inputEmail3Text');
const emailModal = new EmailModal();
emailSubmit();

class CookiesAccept {
    constructor(caName, caValue, caExpire){
        this.caName = caName;
        this.caValue = caValue;
        this.caExpire = caExpire;
    }

    setCookies (){
        const dateCookie = new Date();
        dateCookie.setTime(dateCookie.getTime() + (this.caExpire*24*60*60*1000));
        const expires = dateCookie.toUTCString();
        document.cookie = "username=aaa; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax; Secure;";
        document.cookie = `${this.caName} = ${this.caValue}; expires=${expires} ; path=/; SameSite=None; Secure;`;
    }

    cookiesBannerVisible(){
        const cookiesBanner = document.getElementById('cookiesbanner');
        cookiesBanner.style.display='block';
    }

    cookiesBannerInVisible(){
        const cookiesBanner = document.getElementById('cookiesbanner');
        cookiesBanner.style.display='none';
    }

    pressAcceptBtn(){
        const pressedBtn = document.getElementById('cookiesbtn');
        pressedBtn.addEventListener('click',()=>{
            this.setCookies (this.caName, this.caValue, this.caExpire);
            this.cookiesBannerInVisible();
        })
    }

    readThisCookies() {
        const newCookies = document.cookie.split(';');
        if (newCookies.length>0){
            for(let i=0; i<newCookies.length ; i++){
                const cookieName = newCookies[i].split("=")[0];
                const cookieValue = newCookies[i].split("=")[1];
                if(cookieName === this.caName && cookieValue === this.caValue){
                    return cookieValue;
                }else {return ""}
            }
        }
    }
    
    checkCookies(){
        const checkCookiecValue = this.readThisCookies();
        if (checkCookiecValue === 'yes'){
            this.cookiesBannerInVisible();
        }else{
            this.cookiesBannerVisible();
            this.pressAcceptBtn();
        }
    }
    
}
const checkCookiesBanner = new CookiesAccept ("CookiesAccept","yes",30);
checkCookiesBanner.checkCookies();

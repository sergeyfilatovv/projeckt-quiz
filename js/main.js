let nextBtns = document.querySelectorAll('[data-nav="next"]');
let prevBtns = document.querySelectorAll('[data-nav="prev"]');

// Объект с сохраненными ответами

let answers = {
    2: null,
    3: null,
    4: null,
    5: null
};

console.log(answers)

// Меняем карточки по клику на кнопку далее
nextBtns.forEach(function(item){
    item.addEventListener('click', nextItem)

    function nextItem(){

        let thisCard = this.closest("[data-card]");
        let thisCardNumber = parseInt(thisCard.dataset.card)
        
        if (thisCard.dataset.validate == "novalidate") {
            // console.log("NOVALIDATE");
            navigete("next", thisCard);
            updateProgressBar("next", thisCardNumber );
        } else {

            saveAnswer(thisCardNumber, getherCardData(thisCardNumber));

           if(isFilled(thisCardNumber) && checkOnRequired(thisCardNumber) ){
            navigete("next", thisCard);
            updateProgressBar("next", thisCardNumber );

           } 
           else{
            alert('Проверьте поля на заполненность!')
           }
            
            
        }
    }
})
// Меняем карточки по клику на кнопку назад
prevBtns.forEach(function(item){
    item.addEventListener('click', prevItem)

    function prevItem(){
        
        let thisCard = this.closest("[data-card]")
        let thisCardNumber = parseInt(thisCard.dataset.card)
        navigete('prev', thisCard);
        updateProgressBar("prev", thisCardNumber );

    }
});
// Функция для навигации вперед/назад
function navigete(direction, thisCard){
    let thisCardNumber = parseInt(thisCard.dataset.card);
    let shiftedCard;
    if(direction == 'prev'){
        shiftedCard = thisCardNumber - 1;
    }
    else if(direction == 'next'){
        shiftedCard = thisCardNumber + 1;
    }

    thisCard.classList.add('hidden');

    document.querySelector(`[data-card="${shiftedCard}"]`).classList.remove('hidden');
}

// Функция сбора заполненных данных
function getherCardData(number){
    let result =[];
    let question;
    let currentCard = document.querySelector(`[data-card = "${number}" ]`)

    question = currentCard.querySelector('[data-question]').innerText;

    // Находим все заполненные значения из радиокнопок
    let radioValues = currentCard.querySelectorAll('[type="radio"]')

    radioValues.forEach(function(item){
        if(item.checked){
            
            result.push({
                name:item.name, 
                value:item.value
            })
        }   
    })
    // Находим все заполненные значения из чекбоксов
    let checkboxValues = currentCard.querySelectorAll('[type="checkbox"]');
    
    checkboxValues.forEach(function(item){
        if(item.checked){
            result.push({
                name:item.name,
                value:item.value
                
            })
        }  
    })
    // Находим все заполненные значения из инпутов
    let inputValues = currentCard.querySelectorAll('[type="email"], [type="text"], [type="number"]');

    inputValues.forEach(function(item){
        let itemValue = item.value;
        if(itemValue.trim() != ''){
            result.push({
                name:item.name,
                value:item.value
            })
        }
    })

    // Собираем все полученные записанные значения из всех карточек в массив
   let data = {
    question: question,
    answer: result
    }

    return data;
 
}

// Функция, которая записывает массив с ответами в объект answers
function saveAnswer(number, data){
    answers[number] = data
}

// Функция, которая проверяет наличие ответов в карточке
function isFilled(number){
    if(answers[number].answer.length > 0){
        return true;
    }
    else{
        return false;
    }
}

// Функция проверки email
function validateEmail(email){
let pattern = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
return pattern.test(email);
}


// Функция проверки на заполненность required чекбоксов и инпутов с email
function checkOnRequired(number){
    let currentCard = document.querySelector(`[data-card="${number}"]`);
    let requiredFields = currentCard.querySelectorAll('[required]');

    let isValidArray =[]; 

    requiredFields.forEach(function(item){
        if(item.type == "checkbox" && item.checked == false ){
            isValidArray.push(false);
        }
        else if(item.type == "email"){
            if(validateEmail(item.value)){
                isValidArray.push(true)  
            }
            else{
                isValidArray.push(false)
            }
        }

    })

    if (isValidArray.indexOf(false) == -1) {
        return true;
    } else {
        return false
    }
}

// Подсвечиваем рамку у радиокнопок
document.querySelectorAll('.radio-group').forEach(function(item){
    item.addEventListener('click', function(e){
       let label = e.target.closest('label');
       if(label){
        label.closest('.radio-group').querySelectorAll('label').forEach(function(item){
            item.classList.remove('radio-block--active')
        })
       }
       label.classList.add('radio-block--active');
    })
})

// Подсвечиваем рамку у чекбоксов
document.querySelectorAll('label.checkbox-block input[type="checkbox"]').forEach(function(item){
    item.addEventListener('change', function(){
        // Если чекбокс проставлен то
        if ( item.checked) {
            // добавляем активный класс к тегу label в котором он лежит
            item.closest("label").classList.add("checkbox-block--active")
        } else {
            // в ином случаем убираем активный класс
            item.closest("label").classList.remove("checkbox-block--active")
        }

    })
})
// Функция обновления данных в прогрессбаре
function updateProgressBar(direction, cardNumber){
    let cardsTotalNumber = document.querySelectorAll('[data-card]').length;

    if(direction == "next"){
        cardNumber = cardNumber + 1;
    }
    else if(direction == "prev"){
        cardNumber = cardNumber - 1;
    }
    // Расчет процента прохождения карточек
    let progress = ((cardNumber * 100)/cardsTotalNumber).toFixed();
    // Находим массив с прогрессбарами и обходим каждый циклом ForEach
    document.querySelectorAll('.progress').forEach(function(item){
       // Обновить число прогресс бара
        item.querySelector('.progress__label strong').innerText = `${progress}%`;
        // Обновить полоску прогресс бара
        item.querySelector('.progress__line-bar').style = `width: ${progress}% `;
       
    })

    
    

}




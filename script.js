/*
 * QUIZ CONTROLLER
 */
var quizController = (function() {
    
    /**
     * Question Constructor
     */
    function Question(id, questionText, options, correctAnswer) {
        this.id = id;
        this.questionText = questionText;
        this.options = options;
        this.correctAnswer = correctAnswer;
    }

    var questionLocalStorage = {
        setQuestionCollection: function(newCollection) {
            localStorage.setItem('questionCollection', JSON.stringify(newCollection));
        },
        getQuestionCollection: function() {
            return JSON.parse(localStorage.getItem('questionCollection'));
        },
        removeQuestionCollection: function() {
            localStorage.removeItem('questionCollection');
        }
    };

    if(questionLocalStorage.getQuestionCollection() === null) {
        questionLocalStorage.setQuestionCollection([]);
    }

    return {

        getQuestionLocalStorage: questionLocalStorage,

        addQuestionOnLocalStorage: function(newQuestionText, opts) {
            var optionsArr, corrAns, questionId, newQuestion, getStoredQuests, isChecked;

            if(questionLocalStorage.getQuestionCollection() === null) {
                questionLocalStorage.setQuestionCollection([]);
            }

            optionsArr = [];

            isChecked = false;

            for(var i = 0; i < opts.length; i++) {
                if(opts[i].value !== "") {
                    optionsArr.push(opts[i].value);
                }

                if(opts[i].previousElementSibling.checked && opts[i].value !== "") {
                    corrAns = opts[i].value;
                    isChecked = true;
                }
            }

            // [ {id: 0} {id: 1} {id: 2} ...]
            if(questionLocalStorage.getQuestionCollection().length > 0) {
                questionId = questionLocalStorage.getQuestionCollection()[questionLocalStorage.getQuestionCollection().length - 1].id + 1;
            } else {
                questionId = 0;
            }

            if(newQuestionText.value !== "") {
                if(optionsArr.length > 1) {
                    if(isChecked) {
                        newQuestion = new Question(questionId, newQuestionText.value, optionsArr, corrAns);
            
                        getStoredQuests = questionLocalStorage.getQuestionCollection();
        
                        getStoredQuests.push(newQuestion);
        
                        questionLocalStorage.setQuestionCollection(getStoredQuests);
        
                        newQuestionText.value = "";
        
                        for(var x = 0; x < opts.length; x++) {
                            opts[x].value = "";
                            opts[x].previousElementSibling.checked = false;
                        }
        
                        console.log(questionLocalStorage.getQuestionCollection());

                        return true;

                    } else {
                        alert('Please check the correct answer!');
                        return false;
                    }                    
                }else {
                    alert('You must insert atleast 2 options');
                    return false;
                }
            } else {
                alert('Please, Insert Question');
                return false;
            }
            
        }
    }

})();




/*
 * UI CONTROLLER
 */
var UIController = (function() {

    var domItems = {
        /**
         * Admin Panel Elements
         */
        questInsertBtn: document.getElementById("question-insert-btn"),
        newQuestionText: document.getElementById("new-question-text"),
        addminOptions: document.querySelectorAll(".admin-option"),
        adminOptionsContainer: document.querySelector(".admin-options-container"),
        insertedQuestionWrapper: document.querySelector('.inserted-questions-wrapper')
    };

    return {
        getDomItems: domItems,

        addInputsDynamically: function() {

            var addInput = function() {
                var inputHTML, counter;

                counter = document.querySelectorAll('.admin-option').length;

                inputHTML = '<div class="admin-option-wrapper"><input type="radio" class="admin-option-' + counter + '" name="answer" value="1"><input type="text" class="admin-option admin-option-' + counter + '" value=""></div>';

                domItems.adminOptionsContainer.insertAdjacentHTML('beforeend', inputHTML);

                domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener('focus', addInput);

                domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus' , addInput);
            }

            domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus' , addInput);

        },

        createQuestionList: function(getQuestions) {

            var questHTML, numberingArr;

            numberingArr = [];

            domItems.insertedQuestionWrapper.innerHTML = "";

            for(var i = 0; i < getQuestions.getQuestionCollection().length; i++) {

                numberingArr.push(i + 1);

                questHTML = '<p><span>' + numberingArr[i] + '. ' + getQuestions.getQuestionCollection()[i].questionText + '</span><button id="question-' + getQuestions.getQuestionCollection()[i].id + '">Edit</button></p>';

                domItems.insertedQuestionWrapper.insertAdjacentHTML('afterbegin', questHTML);
            }

        },

        editQuestionList: function(event, storageQuestionList) {
            var getId, getStorageQuestionList, foundItem, placeInArr, optionHTML;

            if('question-'.indexOf(event.target.id)) {

                getId = parseInt(event.target.id.split('-')[1]);

                getStorageQuestionList = storageQuestionList.getQuestionCollection();

                for(var i = 0; i < getStorageQuestionList.length; i++) {

                    if(getStorageQuestionList[i].id === getId) {

                        foundItem = getStorageQuestionList[i];

                        placeInArr = i;

                    }
                }
                
                domItems.newQuestionText.value = foundItem.questionText;

                domItems.adminOptionsContainer.innerHTML = '';

                optionHTML = [];

                for(var x = 0; x < foundItem.options.length; x++) {

                    optionHTML = ' <div class="admin-option-wrapper"><input type="radio" class="admin-option-' + x + '" name="answer" value="' + foundItem.options[x] + '"><input type="text" class="admin-option admin-option-' + x + '" value="' + foundItem.options[x] + '"></div>'

                }
                domItems.adminOptionsContainer.innerHTML = optionHTML;
            }

        }
    };


})();




/*
 *  CONTROLLER
 */
var controller = (function(quizCtrl, UICtrl) {

var selectedDomItems = UICtrl.getDomItems;

UICtrl.addInputsDynamically();

UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);

selectedDomItems.questInsertBtn.addEventListener('click', function() {

    var addminOptions = document.querySelectorAll('.admin-option');

    var checkBoolean = quizCtrl.addQuestionOnLocalStorage(selectedDomItems.newQuestionText, addminOptions);

    if(checkBoolean) {
        UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);
    }
});

selectedDomItems.insertedQuestionWrapper.addEventListener('click', function(e) {

    UICtrl.editQuestionList(e, quizCtrl.getQuestionLocalStorage);

});

})(quizController, UIController);
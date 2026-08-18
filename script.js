"use strict";


/* =========================================================
   STORAGE
========================================================= */

const USERS_KEY = "englishHubUsers";
const CURRENT_USER_KEY = "englishHubCurrentUser";


function getUsers() {

    try {

        return JSON.parse(
            localStorage.getItem(USERS_KEY)
        ) || {};

    } catch (error) {

        return {};

    }

}


function saveUsers(users) {

    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );

}


function getCurrentUsername() {

    return localStorage.getItem(
        CURRENT_USER_KEY
    );

}


function setCurrentUsername(username) {

    localStorage.setItem(
        CURRENT_USER_KEY,
        username
    );

}


function clearCurrentUser() {

    localStorage.removeItem(
        CURRENT_USER_KEY
    );

}


/* =========================================================
   DOM
========================================================= */

const authPage =
    document.getElementById("authPage");

const mainWebsite =
    document.getElementById("mainWebsite");


const loginTab =
    document.getElementById("loginTab");

const registerTab =
    document.getElementById("registerTab");


const loginForm =
    document.getElementById("loginForm");

const registerForm =
    document.getElementById("registerForm");


const loginMessage =
    document.getElementById("loginMessage");

const registerMessage =
    document.getElementById("registerMessage");


const loginUsername =
    document.getElementById("loginUsername");

const loginPassword =
    document.getElementById("loginPassword");


const registerName =
    document.getElementById("registerName");

const registerPhone =
    document.getElementById("registerPhone");

const registerUsername =
    document.getElementById("registerUsername");

const registerPassword =
    document.getElementById("registerPassword");

const registerConfirmPassword =
    document.getElementById(
        "registerConfirmPassword"
    );


const studentName =
    document.getElementById("studentName");

const navUserName =
    document.getElementById("navUserName");

const logoutBtn =
    document.getElementById("logoutBtn");


/* =========================================================
   AUTH TABS
========================================================= */

loginTab.addEventListener(
    "click",
    function () {

        loginTab.classList.add("active");

        registerTab.classList.remove("active");

        loginForm.classList.remove("hidden");

        registerForm.classList.add("hidden");

        loginMessage.textContent = "";
        registerMessage.textContent = "";

    }
);


registerTab.addEventListener(
    "click",
    function () {

        registerTab.classList.add("active");

        loginTab.classList.remove("active");

        registerForm.classList.remove("hidden");

        loginForm.classList.add("hidden");

        loginMessage.textContent = "";
        registerMessage.textContent = "";

    }
);


/* =========================================================
   VALIDATION
========================================================= */

function validPhone(phone) {

    return /^[0-9]{10}$/.test(phone);

}


function validUsername(username) {

    return /^[a-zA-Z0-9_]{3,20}$/.test(
        username
    );

}


function showMessage(element, message, type) {

    element.textContent = message;

    if (type === "success") {

        element.style.color = "#15803d";

    } else {

        element.style.color = "#dc2626";

    }

}


/* =========================================================
   REGISTER
========================================================= */

registerForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const name =
            registerName.value.trim();

        const phone =
            registerPhone.value.trim();

        const username =
            registerUsername.value.trim();

        const password =
            registerPassword.value;

        const confirmPassword =
            registerConfirmPassword.value;


        if (name.length < 2) {

            showMessage(
                registerMessage,
                "❌ Please enter your full name.",
                "error"
            );

            return;
        }


        if (!validPhone(phone)) {

            showMessage(
                registerMessage,
                "❌ Phone number must contain exactly 10 digits.",
                "error"
            );

            return;
        }


        if (!validUsername(username)) {

            showMessage(
                registerMessage,
                "❌ Username must be 3-20 characters and use only letters, numbers or underscore.",
                "error"
            );

            return;
        }


        if (password.length < 6) {

            showMessage(
                registerMessage,
                "❌ Password must contain at least 6 characters.",
                "error"
            );

            return;
        }


        if (password !== confirmPassword) {

            showMessage(
                registerMessage,
                "❌ Passwords do not match.",
                "error"
            );

            return;
        }


        const users = getUsers();

        const usernameKey =
            username.toLowerCase();


        if (users[usernameKey]) {

            showMessage(
                registerMessage,
                "❌ This username is already registered.",
                "error"
            );

            return;
        }


        const phoneAlreadyUsed =
            Object.values(users).some(
                function (user) {

                    return user.phone === phone;

                }
            );


        if (phoneAlreadyUsed) {

            showMessage(
                registerMessage,
                "❌ This phone number is already registered.",
                "error"
            );

            return;
        }


        users[usernameKey] = {

            name: name,

            phone: phone,

            username: username,

            password: password,

            tests: [],

            createdAt:
                new Date().toISOString()

        };


        saveUsers(users);

        setCurrentUsername(usernameKey);


        showMessage(
            registerMessage,
            "✅ Account created successfully!",
            "success"
        );


        setTimeout(
            function () {

                openWebsite(
                    users[usernameKey]
                );

            },
            500
        );

    }
);


/* =========================================================
   LOGIN
========================================================= */

loginForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const username =
            loginUsername.value.trim();

        const password =
            loginPassword.value;


        const users = getUsers();

        const user =
            users[
                username.toLowerCase()
            ];


        if (!user) {

            showMessage(
                loginMessage,
                "❌ Username not found. Please create an account first.",
                "error"
            );

            return;
        }


        if (user.password !== password) {

            showMessage(
                loginMessage,
                "❌ Incorrect password.",
                "error"
            );

            return;
        }


        setCurrentUsername(
            username.toLowerCase()
        );


        showMessage(
            loginMessage,
            "✅ Login successful! Opening your learning hub...",
            "success"
        );


        setTimeout(
            function () {

                openWebsite(user);

            },
            400
        );

    }
);


/* =========================================================
   OPEN WEBSITE
========================================================= */

function openWebsite(user) {

    authPage.classList.add("hidden");

    mainWebsite.classList.remove("hidden");

    studentName.textContent =
        user.name;

    navUserName.textContent =
        user.name;

    updateDashboard();

    renderHistory();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   LOGOUT
========================================================= */

logoutBtn.addEventListener(
    "click",
    function () {

        clearCurrentUser();

        mainWebsite.classList.add("hidden");

        authPage.classList.remove("hidden");

        loginForm.reset();

        registerForm.reset();

        loginTab.click();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


/* =========================================================
   AUTO LOGIN
========================================================= */

function checkExistingLogin() {

    const username =
        getCurrentUsername();

    const users = getUsers();


    if (
        username &&
        users[username]
    ) {

        openWebsite(
            users[username]
        );

    } else {

        mainWebsite.classList.add(
            "hidden"
        );

    }

}


checkExistingLogin();


/* =========================================================
   NAVIGATION
========================================================= */

const menuToggle =
    document.getElementById(
        "menuToggle"
    );

const mainNav =
    document.getElementById(
        "mainNav"
    );


if (menuToggle && mainNav) {

    menuToggle.addEventListener(
        "click",
        function () {

            mainNav.classList.toggle(
                "active"
            );

        }
    );


    mainNav.querySelectorAll("a")
        .forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        mainNav.classList.remove(
                            "active"
                        );

                    }
                );

            }
        );

}


/* =========================================================
   SECTION NAVIGATION
========================================================= */

function goToSection(id) {

    const section =
        document.getElementById(id);


    if (!section) {
        return;
    }


    section.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


const startLearningBtn =
    document.getElementById(
        "startLearningBtn"
    );

const heroPracticeBtn =
    document.getElementById(
        "heroPracticeBtn"
    );


startLearningBtn.addEventListener(
    "click",
    function () {

        goToSection("lessons");

    }
);


heroPracticeBtn.addEventListener(
    "click",
    function () {

        goToSection("practice");

    }
);


document
    .querySelectorAll(
        ".card-btn[data-target]"
    )
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    goToSection(
                        button.dataset.target
                    );

                }
            );

        }
    );


/* =========================================================
   VOCABULARY
========================================================= */

const vocabulary = [

    {
        word: "Improve",
        meaning: "To make something better.",
        example:
            "I want to improve my English."
    },

    {
        word: "Confident",
        meaning:
            "Feeling sure about yourself.",
        example:
            "She is confident when she speaks English."
    },

    {
        word: "Fluent",
        meaning:
            "Able to speak smoothly and easily.",
        example:
            "He is becoming fluent in English."
    },

    {
        word: "Practice",
        meaning:
            "To do something repeatedly to improve.",
        example:
            "You should practice English every day."
    },

    {
        word: "Accurate",
        meaning:
            "Correct and without mistakes.",
        example:
            "Try to give an accurate answer."
    },

    {
        word: "Communicate",
        meaning:
            "To share information or ideas.",
        example:
            "English helps us communicate with others."
    },

    {
        word: "Essential",
        meaning:
            "Very important or necessary.",
        example:
            "Grammar is essential for clear writing."
    },

    {
        word: "Opportunity",
        meaning:
            "A suitable chance to do something.",
        example:
            "Learning English creates many opportunities."
    },

    {
        word: "Effective",
        meaning:
            "Successful in producing the desired result.",
        example:
            "Practice is an effective way to learn."
    }

];


document
    .getElementById("vocabularyBtn")
    .addEventListener(
        "click",
        function () {

            let text =
                "📖 USEFUL ENGLISH VOCABULARY\n\n";


            vocabulary.forEach(
                function (item, index) {

                    text +=
                        `${index + 1}. ${item.word}\n`;

                    text +=
                        `${item.meaning}\n`;

                    text +=
                        `Example: ${item.example}\n\n`;

                }
            );


            alert(text);

        }
    );


/* =========================================================
   PRACTICE QUESTIONS
========================================================= */

const practiceQuestions = [

    {
        question:
            'Choose the passive voice of "She writes a letter."',

        options: [
            "A letter is written by her.",
            "A letter was written by her.",
            "A letter has written by her.",
            "A letter is writing by her."
        ],

        answer: 0,

        explanation:
            "Simple Present Passive = is/am/are + V3."
    },

    {
        question:
            "Which word is the verb in 'Rahul plays football'?",

        options: [
            "Rahul",
            "plays",
            "football",
            "the"
        ],

        answer: 1,

        explanation:
            "'Plays' shows the action."
    },

    {
        question:
            "Choose the correct sentence.",

        options: [
            "He go to school every day.",
            "He going to school every day.",
            "He goes to school every day.",
            "He gone to school every day."
        ],

        answer: 2,

        explanation:
            "He/she/it normally takes V1 + s/es in Simple Present."
    },

    {
        question:
            "What is the V3 form of 'write'?",

        options: [
            "Wrote",
            "Writing",
            "Written",
            "Writes"
        ],

        answer: 2,

        explanation:
            "Write → Wrote → Written."
    },

    {
        question:
            'Change into passive: "They built a bridge."',

        options: [
            "A bridge is built by them.",
            "A bridge was built by them.",
            "A bridge has built by them.",
            "A bridge was building by them."
        ],

        answer: 1,

        explanation:
            "Simple Past Passive = was/were + V3."
    },

    {
        question:
            "Which word is an adjective?",

        options: [
            "Quickly",
            "Beautiful",
            "Run",
            "Under"
        ],

        answer: 1,

        explanation:
            "'Beautiful' describes a noun."
    },

    {
        question:
            "Choose the correct Present Perfect sentence.",

        options: [
            "I have finished my work.",
            "I has finished my work.",
            "I am finished my work.",
            "I have finish my work."
        ],

        answer: 0,

        explanation:
            "Present Perfect = has/have + V3."
    },

    {
        question:
            'Change into passive: "The teacher is teaching English."',

        options: [
            "English is taught by the teacher.",
            "English was taught by the teacher.",
            "English is being taught by the teacher.",
            "English has been taught by the teacher."
        ],

        answer: 2,

        explanation:
            "Present Continuous Passive = is/am/are + being + V3."
    }

];


let currentQuestion = 0;
let practiceScore = 0;
let practiceAnswered = false;


const questionNumber =
    document.getElementById(
        "questionNumber"
    );

const quizScore =
    document.getElementById(
        "quizScore"
    );

const questionText =
    document.getElementById(
        "questionText"
    );

const optionsContainer =
    document.getElementById(
        "optionsContainer"
    );

const quizFeedback =
    document.getElementById(
        "quizFeedback"
    );

const nextQuestionBtn =
    document.getElementById(
        "nextQuestionBtn"
    );

const quizProgress =
    document.getElementById(
        "quizProgress"
    );


function loadPracticeQuestion() {

    practiceAnswered = false;


    const question =
        practiceQuestions[
            currentQuestion
        ];


    questionNumber.textContent =
        `Question ${currentQuestion + 1} of ${practiceQuestions.length}`;


    questionText.textContent =
        question.question;


    quizFeedback.textContent = "";

    optionsContainer.innerHTML = "";


    question.options.forEach(
        function (option, index) {

            const button =
                document.createElement(
                    "button"
                );


            button.type = "button";

            button.className =
                "option-btn";

            button.textContent =
                option;


            button.addEventListener(
                "click",
                function () {

                    checkPracticeAnswer(
                        index,
                        button
                    );

                }
            );


            optionsContainer.appendChild(
                button
            );

        }
    );


    nextQuestionBtn.disabled = true;

    nextQuestionBtn.textContent =
        currentQuestion ===
        practiceQuestions.length - 1
            ? "Finish Practice"
            : "Next Question";


    quizScore.textContent =
        `Score: ${practiceScore}`;


    quizProgress.style.width =
        `${(
            currentQuestion /
            practiceQuestions.length
        ) * 100}%`;

}


function checkPracticeAnswer(
    selectedAnswer,
    selectedButton
) {

    if (practiceAnswered) {
        return;
    }


    practiceAnswered = true;


    const question =
        practiceQuestions[
            currentQuestion
        ];


    const buttons =
        optionsContainer.querySelectorAll(
            ".option-btn"
        );


    buttons.forEach(
        function (button, index) {

            button.disabled = true;


            if (
                index === question.answer
            ) {

                button.classList.add(
                    "correct"
                );

            }

        }
    );


    if (
        selectedAnswer ===
        question.answer
    ) {

        practiceScore++;

        selectedButton.classList.add(
            "correct"
        );


        quizFeedback.textContent =
            "✅ Correct! " +
            question.explanation;

        quizFeedback.style.color =
            "#15803d";

    } else {

        selectedButton.classList.add(
            "wrong"
        );


        quizFeedback.textContent =
            "❌ Incorrect. " +
            question.explanation;

        quizFeedback.style.color =
            "#dc2626";

    }


    quizScore.textContent =
        `Score: ${practiceScore}`;

    nextQuestionBtn.disabled = false;

}


nextQuestionBtn.addEventListener(
    "click",
    function () {

        if (!practiceAnswered) {
            return;
        }


        if (
            currentQuestion <
            practiceQuestions.length - 1
        ) {

            currentQuestion++;

            loadPracticeQuestion();

        } else {

            const percentage =
                Math.round(
                    (
                        practiceScore /
                        practiceQuestions.length
                    ) * 100
                );


            questionText.textContent =
                "🎉 Practice Complete!";


            optionsContainer.innerHTML = "";


            quizFeedback.textContent =
                `You scored ${practiceScore}/${practiceQuestions.length} (${percentage}%).`;


            nextQuestionBtn.textContent =
                "Restart Practice";


            nextQuestionBtn.disabled = false;


            nextQuestionBtn.onclick =
                restartPractice;

        }

    }
);


function restartPractice() {

    currentQuestion = 0;

    practiceScore = 0;

    nextQuestionBtn.onclick = null;

    loadPracticeQuestion();

}


loadPracticeQuestion();


/* =========================================================
   VERB PARAGRAPH
========================================================= */

const paragraphs = [

    {
        title: "A Morning Routine",

        parts: [
            {
                before:
                    "Every morning, Riya ",
                blank: "goes",
                after:
                    " to school at 8 o'clock.",
                options: [
                    "go",
                    "goes",
                    "going",
                    "gone"
                ]
            },

            {
                before:
                    "She ",
                blank: "brushes",
                after:
                    " her teeth before breakfast.",
                options: [
                    "brush",
                    "brushes",
                    "brushed",
                    "brushing"
                ]
            },

            {
                before:
                    "Her mother ",
                blank: "prepares",
                after:
                    " breakfast for the family.",
                options: [
                    "prepare",
                    "prepared",
                    "prepares",
                    "preparing"
                ]
            }
        ]
    },


    {
        title: "A School Day",

        parts: [
            {
                before:
                    "Yesterday, Rahul ",
                blank: "visited",
                after:
                    " his school library.",
                options: [
                    "visit",
                    "visited",
                    "visits",
                    "visiting"
                ]
            },

            {
                before:
                    "He ",
                blank: "borrowed",
                after:
                    " two books.",
                options: [
                    "borrow",
                    "borrows",
                    "borrowed",
                    "borrowing"
                ]
            },

            {
                before:
                    "Then he ",
                blank: "returned",
                after:
                    " to his classroom.",
                options: [
                    "return",
                    "returns",
                    "returned",
                    "returning"
                ]
            }
        ]
    },


    {
        title: "Learning English",

        parts: [
            {
                before:
                    "I ",
                blank: "practice",
                after:
                    " English every day.",
                options: [
                    "practice",
                    "practices",
                    "practiced",
                    "practicing"
                ]
            },

            {
                before:
                    "My teacher ",
                blank: "gives",
                after:
                    " me useful exercises.",
                options: [
                    "give",
                    "gave",
                    "gives",
                    "giving"
                ]
            },

            {
                before:
                    "I ",
                blank: "have improved",
                after:
                    " my grammar.",
                options: [
                    "improve",
                    "improved",
                    "have improved",
                    "improving"
                ]
            }
        ]
    }

];


let currentParagraph = 0;
let paragraphPart = 0;
let paragraphScore = 0;


const paragraphProgress =
    document.getElementById(
        "paragraphProgress"
    );

const paragraphScoreElement =
    document.getElementById(
        "paragraphScore"
    );

const paragraphTitle =
    document.getElementById(
        "paragraphTitle"
    );

const paragraphText =
    document.getElementById(
        "paragraphText"
    );

const verbOptions =
    document.getElementById(
        "verbOptions"
    );

const paragraphFeedback =
    document.getElementById(
        "paragraphFeedback"
    );

const nextParagraphBtn =
    document.getElementById(
        "nextParagraphBtn"
    );


function renderParagraph() {

    const paragraph =
        paragraphs[
            currentParagraph
        ];


    const part =
        paragraph.parts[
            paragraphPart
        ];


    paragraphProgress.textContent =
        `Paragraph ${currentParagraph + 1} of ${paragraphs.length} • Blank ${paragraphPart + 1}/${paragraph.parts.length}`;


    paragraphScoreElement.textContent =
        `Score: ${paragraphScore}`;


    paragraphTitle.textContent =
        paragraph.title;


    paragraphText.innerHTML =
        `
            ${part.before}
            <span class="blank">______</span>
            ${part.after}
        `;


    paragraphFeedback.textContent = "";

    verbOptions.innerHTML = "";


    part.options.forEach(
        function (option) {

            const button =
                document.createElement(
                    "button"
                );


            button.type = "button";

            button.className =
                "verb-option";

            button.textContent =
                option;


            button.addEventListener(
                "click",
                function () {

                    checkVerb(
                        option,
                        button,
                        part.blank
                    );

                }
            );


            verbOptions.appendChild(
                button
            );

        }
    );


    nextParagraphBtn.disabled = true;

}


function checkVerb(
    selected,
    selectedButton,
    correct
) {

    const buttons =
        verbOptions.querySelectorAll(
            ".verb-option"
        );


    buttons.forEach(
        function (button) {

            button.disabled = true;

        }
    );


    if (selected === correct) {

        paragraphScore++;

        selectedButton.classList.add(
            "correct"
        );


        paragraphFeedback.textContent =
            "✅ Correct! Excellent verb choice.";

        paragraphFeedback.style.color =
            "#15803d";

    } else {

        selectedButton.classList.add(
            "wrong"
        );


        buttons.forEach(
            function (button) {

                if (
                    button.textContent ===
                    correct
                ) {

                    button.classList.add(
                        "correct"
                    );

                }

            }
        );


        paragraphFeedback.textContent =
            `❌ Incorrect. The correct verb is "${correct}".`;

        paragraphFeedback.style.color =
            "#dc2626";

    }


    paragraphScoreElement.textContent =
        `Score: ${paragraphScore}`;

    nextParagraphBtn.disabled = false;

}


nextParagraphBtn.addEventListener(
    "click",
    function () {

        const paragraph =
            paragraphs[
                currentParagraph
            ];


        if (
            paragraphPart <
            paragraph.parts.length - 1
        ) {

            paragraphPart++;

            renderParagraph();

            return;

        }


        if (
            currentParagraph <
            paragraphs.length - 1
        ) {

            currentParagraph++;

            paragraphPart = 0;

            renderParagraph();

            return;

        }


        paragraphFeedback.textContent =
            `🎉 Verb practice completed! Total score: ${paragraphScore}/${getTotalParagraphQuestions()}.`;


        nextParagraphBtn.textContent =
            "Restart Verb Practice";


        nextParagraphBtn.disabled = false;


        nextParagraphBtn.onclick =
            restartParagraphPractice;

    }
);


function getTotalParagraphQuestions() {

    return paragraphs.reduce(
        function (total, paragraph) {

            return total + paragraph.parts.length;

        },
        0
    );

}


function restartParagraphPractice() {

    currentParagraph = 0;

    paragraphPart = 0;

    paragraphScore = 0;

    nextParagraphBtn.onclick = null;

    nextParagraphBtn.textContent =
        "Next Paragraph";

    renderParagraph();

}


renderParagraph();


/* =========================================================
   MOCK TEST DATA
========================================================= */

const mockTests = [

    {
        title: "Grammar Challenge",
        questions: [
            {
                type: "Grammar",
                time: 15,
                question:
                    "Choose the correct sentence.",
                options: [
                    "She go to school.",
                    "She goes to school.",
                    "She going to school.",
                    "She gone to school."
                ],
                answer: 1
            },

            {
                type: "Tense",
                time: 15,
                question:
                    "Which sentence is in Simple Past?",
                options: [
                    "I play cricket.",
                    "I am playing cricket.",
                    "I played cricket.",
                    "I have played cricket."
                ],
                answer: 2
            },

            {
                type: "Voice",
                time: 15,
                question:
                    'Choose the passive form of "The boy opened the door."',
                options: [
                    "The door is opened by the boy.",
                    "The door was opened by the boy.",
                    "The door has opened by the boy.",
                    "The door was opening by the boy."
                ],
                answer: 1
            },

            {
                type: "Verb",
                time: 12,
                question:
                    "What is the V3 form of 'eat'?",
                options: [
                    "Ate",
                    "Eating",
                    "Eaten",
                    "Eats"
                ],
                answer: 2
            },

            {
                type: "Grammar",
                time: 15,
                question:
                    "Which word is a pronoun?",
                options: [
                    "Beautiful",
                    "Quickly",
                    "They",
                    "School"
                ],
                answer: 2
            },

            {
                type: "Tense",
                time: 15,
                question:
                    "Choose the Present Perfect sentence.",
                options: [
                    "He has completed the work.",
                    "He have completed the work.",
                    "He is completed the work.",
                    "He has complete the work."
                ],
                answer: 0
            },

            {
                type: "Voice",
                time: 15,
                question:
                    'Choose the passive form of "They are cleaning the room."',
                options: [
                    "The room is cleaned by them.",
                    "The room was cleaned by them.",
                    "The room is being cleaned by them.",
                    "The room has been cleaned by them."
                ],
                answer: 2
            },

            {
                type: "Grammar",
                time: 12,
                question:
                    "Which word is an adjective?",
                options: [
                    "Beautiful",
                    "Quickly",
                    "Run",
                    "Under"
                ],
                answer: 0
            },

            {
                type: "Tense",
                time: 15,
                question:
                    "Choose the correct Future sentence.",
                options: [
                    "I will study tomorrow.",
                    "I will studied tomorrow.",
                    "I studying tomorrow.",
                    "I have study tomorrow."
                ],
                answer: 0
            },

            {
                type: "Voice",
                time: 15,
                question:
                    'Change into passive: "The police caught the thief."',
                options: [
                    "The thief is caught by the police.",
                    "The thief was caught by the police.",
                    "The thief has caught by the police.",
                    "The thief was catching by the police."
                ],
                answer: 1
            }
        ]
    },


    {
        title: "Tense Master Challenge",
        questions: [
            {
                type: "Tense",
                time: 15,
                question:
                    "I _____ to school every day.",
                options: [
                    "go",
                    "goes",
                    "going",
                    "gone"
                ],
                answer: 0
            },

            {
                type: "Tense",
                time: 15,
                question:
                    "She _____ dinner now.",
                options: [
                    "cooks",
                    "cooked",
                    "is cooking",
                    "has cooked"
                ],
                answer: 2
            },

            {
                type: "Tense",
                time: 15,
                question:
                    "They _____ the work already.",
                options: [
                    "finish",
                    "finished",
                    "have finished",
                    "finishing"
                ],
                answer: 2
            },

            {
                type: "Tense",
                time: 15,
                question:
                    "He _____ football yesterday.",
                options: [
                    "plays",
                    "played",
                    "is playing",
                    "has played"
                ],
                answer: 1
            },

            {
                type: "Tense",
                time: 15,
                question:
                    "I _____ when you called me.",
                options: [
                    "sleep",
                    "slept",
                    "was sleeping",
                    "have slept"
                ],
                answer: 2
            },

            {
                type: "Tense",
                time: 15,
                question:
                    "She _____ before I arrived.",
                options: [
                    "left",
                    "has left",
                    "had left",
                    "leaving"
                ],
                answer: 2
            },

            {
                type: "Tense",
                time: 15,
                question:
                    "We _____ tomorrow.",
                options: [
                    "travel",
                    "travelled",
                    "will travel",
                    "travelling"
                ],
                answer: 2
            },

            {
                type: "Tense",
                time: 15,
                question:
                    "At 8 PM, I _____ dinner.",
                options: [
                    "will eat",
                    "will be eating",
                    "ate",
                    "have eaten"
                ],
                answer: 1
            },

            {
                type: "Tense",
                time: 15,
                question:
                    "By next year, he _____ the course.",
                options: [
                    "completes",
                    "completed",
                    "will have completed",
                    "completing"
                ],
                answer: 2
            },

            {
                type: "Tense",
                time: 15,
                question:
                    "She _____ English for two years.",
                options: [
                    "has been learning",
                    "learned",
                    "learns",
                    "is learn"
                ],
                answer: 0
            }
        ]
    }

];


/* =========================================================
   MOCK STATE
========================================================= */

let selectedMockIndex = 0;

let mockCurrent = 0;

let mockScore = 0;

let mockCorrect = 0;

let mockWrong = 0;

let mockSkipped = 0;

let mockTimeUsed = 0;

let mockTimer = null;

let mockAnswered = false;

let mockQuestionStartTime = 0;


/* =========================================================
   MOCK DOM
========================================================= */

const mockStartScreen =
    document.getElementById(
        "mockStartScreen"
    );

const mockQuizScreen =
    document.getElementById(
        "mockQuizScreen"
    );

const scoreboardScreen =
    document.getElementById(
        "scoreboardScreen"
    );


const startMockBtn =
    document.getElementById(
        "startMockBtn"
    );

const mockQuestionNumber =
    document.getElementById(
        "mockQuestionNumber"
    );

const mockScoreDisplay =
    document.getElementById(
        "mockScoreDisplay"
    );

const mockTimer =
    document.getElementById(
        "mockTimer"
    );

const mockTimerFill =
    document.getElementById(
        "mockTimerFill"
    );

const mockQuestionType =
    document.querySelector(
        ".mock-question-type"
    );

const mockQuestionText =
    document.getElementById(
        "mockQuestionText"
    );

const mockOptions =
    document.getElementById(
        "mockOptions"
    );

const mockFeedback =
    document.getElementById(
        "mockFeedback"
    );

const mockNextBtn =
    document.getElementById(
        "mockNextBtn"
    );


/* =========================================================
   START MOCK
========================================================= */

startMockBtn.addEventListener(
    "click",
    function () {

        startMockTest(
            selectedMockIndex
        );

    }
);


function startMockTest(testIndex) {

    selectedMockIndex =
        testIndex;


    mockCurrent = 0;

    mockScore = 0;

    mockCorrect = 0;

    mockWrong = 0;

    mockSkipped = 0;

    mockTimeUsed = 0;

    clearInterval(mockTimer);


    mockStartScreen.classList.add(
        "hidden"
    );

    scoreboardScreen.classList.add(
        "hidden"
    );

    mockQuizScreen.classList.remove(
        "hidden"
    );


    loadMockQuestion();

}


/* =========================================================
   LOAD MOCK QUESTION
========================================================= */

function loadMockQuestion() {

    clearInterval(mockTimer);


    mockAnswered = false;


    const test =
        mockTests[
            selectedMockIndex
        ];


    const question =
        test.questions[
            mockCurrent
        ];


    mockQuestionNumber.textContent =
        `Question ${mockCurrent + 1} of ${test.questions.length}`;


    mockScoreDisplay.textContent =
        `Score: ${mockScore}`;


    mockQuestionType.textContent =
        question.type.toUpperCase();


    mockQuestionText.textContent =
        question.question;


    mockFeedback.textContent = "";


    mockOptions.innerHTML = "";


    question.options.forEach(
        function (option, index) {

            const button =
                document.createElement(
                    "button"
                );


            button.type = "button";

            button.className =
                "option-btn";

            button.textContent =
                option;


            button.addEventListener(
                "click",
                function () {

                    answerMockQuestion(
                        index,
                        button
                    );

                }
            );


            mockOptions.appendChild(
                button
            );

        }
    );


    mockNextBtn.disabled = true;

    mockNextBtn.textContent =
        mockCurrent ===
        test.questions.length - 1
            ? "Finish Test"
            : "Next Question";


    startQuestionTimer(
        question.time
    );

}


/* =========================================================
   QUESTION TIMER
========================================================= */

function startQuestionTimer(seconds) {

    let remaining =
        seconds;


    mockQuestionStartTime =
        Date.now();


    mockTimer.textContent =
        remaining;


    mockTimerFill.style.width =
        "100%";


    mockTimer =
        setInterval(
            function () {

                remaining--;

                mockTimer.textContent =
                    remaining;


                const percentage =
                    (
                        remaining /
                        seconds
                    ) * 100;


                mockTimerFill.style.width =
                    `${percentage}%`;


                if (remaining <= 0) {

                    clearInterval(
                        mockTimer
                    );


                    handleTimeUp();

                }

            },
            1000
        );

}


/* =========================================================
   TIME UP
========================================================= */

function handleTimeUp() {

    if (mockAnswered) {
        return;
    }


    mockAnswered = true;

    mockSkipped++;


    mockFeedback.textContent =
        "⏰ Time's up! The question was skipped.";

    mockFeedback.style.color =
        "#dc2626";


    const test =
        mockTests[
            selectedMockIndex
        ];


    const question =
        test.questions[
            mockCurrent
        ];


    const buttons =
        mockOptions.querySelectorAll(
            ".option-btn"
        );


    buttons.forEach(
        function (button, index) {

            button.disabled = true;


            if (
                index === question.answer
            ) {

                button.classList.add(
                    "correct"
                );

            }

        }
    );


    mockNextBtn.disabled = false;

}


/* =========================================================
   ANSWER MOCK
========================================================= */

function answerMockQuestion(
    selectedAnswer,
    selectedButton
) {

    if (mockAnswered) {
        return;
    }


    mockAnswered = true;


    clearInterval(
        mockTimer
    );


    const elapsed =
        Math.round(
            (
                Date.now() -
                mockQuestionStartTime
            ) / 1000
        );


    mockTimeUsed += elapsed;


    const test =
        mockTests[
            selectedMockIndex
        ];


    const question =
        test.questions[
            mockCurrent
        ];


    const buttons =
        mockOptions.querySelectorAll(
            ".option-btn"
        );


    buttons.forEach(
        function (button, index) {

            button.disabled = true;


            if (
                index === question.answer
            ) {

                button.classList.add(
                    "correct"
                );

            }

        }
    );


    if (
        selectedAnswer ===
        question.answer
    ) {

        mockScore++;

        mockCorrect++;

        selectedButton.classList.add(
            "correct"
        );


        mockFeedback.textContent =
            "✅ Correct!";

        mockFeedback.style.color =
            "#15803d";

    } else {

        mockWrong++;

        selectedButton.classList.add(
            "wrong"
        );


        mockFeedback.textContent =
            "❌ Incorrect. Correct answer is highlighted.";

        mockFeedback.style.color =
            "#dc2626";

    }


    mockScoreDisplay.textContent =
        `Score: ${mockScore}`;


    mockNextBtn.disabled = false;

}


/* =========================================================
   NEXT MOCK QUESTION
========================================================= */

mockNextBtn.addEventListener(
    "click",
    function () {

        if (!mockAnswered) {
            return;
        }


        const test =
            mockTests[
                selectedMockIndex
            ];


        if (
            mockCurrent <
            test.questions.length - 1
        ) {

            mockCurrent++;

            loadMockQuestion();

        } else {

            finishMockTest();

        }

    }
);


/* =========================================================
   FINISH MOCK
========================================================= */

function finishMockTest() {

    clearInterval(
        mockTimer
    );


    const test =
        mockTests[
            selectedMockIndex
        ];


    const total =
        test.questions.length;


    const percentage =
        Math.round(
            (
                mockScore /
                total
            ) * 100
        );


    const accuracyBase =
        mockCorrect +
        mockWrong;


    const accuracy =
        accuracyBase === 0
            ? 0
            : Math.round(
                (
                    mockCorrect /
                    accuracyBase
                ) * 100
            );


    const user =
        getCurrentUser();


    if (!user) {
        return;
    }


    const result = {

        testName:
            test.title,

        score:
            mockScore,

        total:
            total,

        percentage:
            percentage,

        correct:
            mockCorrect,

        wrong:
            mockWrong,

        skipped:
            mockSkipped,

        timeUsed:
            mockTimeUsed,

        accuracy:
            accuracy,

        date:
            new Date().toLocaleDateString()

    };


    saveTestResult(
        result
    );


    showScoreboard(
        result
    );

}


/* =========================================================
   SAVE TEST RESULT
========================================================= */

function getCurrentUser() {

    const username =
        getCurrentUsername();

    const users =
        getUsers();


    if (
        !username ||
        !users[username]
    ) {

        return null;

    }


    return users[username];

}


function saveTestResult(result) {

    const username =
        getCurrentUsername();

    const users =
        getUsers();


    if (
        !username ||
        !users[username]
    ) {

        return;

    }


    if (
        !Array.isArray(
            users[username].tests
        )
    ) {

        users[username].tests = [];

    }


    users[username].tests.push(
        result
    );


    saveUsers(users);

}


/* =========================================================
   SCOREBOARD
========================================================= */

function showScoreboard(result) {

    const user =
        getCurrentUser();


    mockQuizScreen.classList.add(
        "hidden"
    );

    mockStartScreen.classList.add(
        "hidden"
    );

    scoreboardScreen.classList.remove(
        "hidden"
    );


    document.getElementById(
        "resultUserName"
    ).textContent =
        user ? user.name : "Student";


    document.getElementById(
        "resultPercentage"
    ).textContent =
        `${result.percentage}%`;


    document.getElementById(
        "resultMarks"
    ).textContent =
        `${result.score}/${result.total}`;


    document.getElementById(
        "resultCorrect"
    ).textContent =
        result.correct;


    document.getElementById(
        "resultWrong"
    ).textContent =
        result.wrong;


    document.getElementById(
        "resultSkipped"
    ).textContent =
        result.skipped;


    document.getElementById(
        "resultTime"
    ).textContent =
        `${result.timeUsed}s`;


    document.getElementById(
        "resultAccuracy"
    ).textContent =
        `${result.accuracy}%`;


    let message;


    if (result.percentage >= 90) {

        message =
            "🌟 Outstanding! Your English grammar is excellent.";

    } else if (result.percentage >= 80) {

        message =
            "🎉 Excellent performance! Keep going.";

    } else if (result.percentage >= 60) {

        message =
            "👍 Good job! Review a few topics and try again.";

    } else {

        message =
            "📚 Keep practicing. Review the lessons and take another test.";

    }


    document.getElementById(
        "resultMessage"
    ).textContent =
        message;


    updateDashboard();

    renderHistory();

}


/* =========================================================
   NEXT MOCK TEST
========================================================= */

document
    .getElementById("nextMockBtn")
    .addEventListener(
        "click",
        function () {

            selectedMockIndex =
                (
                    selectedMockIndex + 1
                ) %
                mockTests.length;


            mockStartScreen.classList.remove(
                "hidden"
            );

            scoreboardScreen.classList.add(
                "hidden"
            );

            mockQuizScreen.classList.add(
                "hidden"
            );


            startMockBtn.textContent =
                `🚀 Start ${mockTests[selectedMockIndex].title}`;

        }
    );


/* =========================================================
   RETRY
========================================================= */

document
    .getElementById("retryMockBtn")
    .addEventListener(
        "click",
        function () {

            startMockTest(
                selectedMockIndex
            );

        }
    );


/* =========================================================
   DASHBOARD
========================================================= */

function updateDashboard() {

    const user =
        getCurrentUser();


    if (!user) {
        return;
    }


    const tests =
        Array.isArray(user.tests)
            ? user.tests
            : [];


    const total =
        tests.length;


    let best = 0;

    let average = 0;


    if (total > 0) {

        tests.forEach(
            function (test) {

                best =
                    Math.max(
                        best,
                        test.percentage
                    );

            }
        );


        const sum =
            tests.reduce(
                function (
                    totalScore,
                    test
                ) {

                    return (
                        totalScore +
                        test.percentage
                    );

                },
                0
            );


        average =
            Math.round(
                sum / total
            );

    }


    document.getElementById(
        "totalTests"
    ).textContent =
        total;


    document.getElementById(
        "bestScore"
    ).textContent =
        `${best}%`;


    document.getElementById(
        "averageScore"
    ).textContent =
        `${average}%`;

}


/* =========================================================
   HISTORY
========================================================= */

function renderHistory() {

    const table =
        document.getElementById(
            "historyTable"
        );


    const user =
        getCurrentUser();


    if (!user) {
        return;
    }


    const tests =
        Array.isArray(user.tests)
            ? user.tests
            : [];


    if (tests.length === 0) {

        table.innerHTML =
            `
            <tr>
                <td colspan="5">
                    No tests completed yet.
                </td>
            </tr>
            `;

        return;

    }


    table.innerHTML = "";


    const recent =
        [...tests]
            .reverse()
            .slice(0, 10);


    recent.forEach(
        function (test, index) {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML =
                `
                <td>${index + 1}</td>

                <td>${escapeHTML(
                    test.testName
                )}</td>

                <td>
                    ${test.score}/${test.total}
                </td>

                <td>
                    <strong>
                        ${test.percentage}%
                    </strong>
                </td>

                <td>
                    ${test.date}
                </td>
                `;


            table.appendChild(row);

        }
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================================
   BACK TO TOP
========================================================= */

const backToTop =
    document.getElementById(
        "backToTop"
    );


window.addEventListener(
    "scroll",
    function () {

        if (
            window.scrollY > 500
        ) {

            backToTop.classList.add(
                "show"
            );

        } else {

            backToTop.classList.remove(
                "show"
            );

        }

    }
);


backToTop.addEventListener(
    "click",
    function () {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);
        /* ================= AUTH ================= */

        const authPage = document.getElementById("authPage");
        const mainWebsite = document.getElementById("mainWebsite");

        const loginTab = document.getElementById("loginTab");
        const registerTab = document.getElementById("registerTab");

        const loginForm = document.getElementById("loginForm");
        const registerForm = document.getElementById("registerForm");

        loginTab.addEventListener("click", () => {

            loginTab.classList.add("active");
            registerTab.classList.remove("active");

            loginForm.classList.remove("hidden");
            registerForm.classList.add("hidden");

        });

        registerTab.addEventListener("click", () => {

            registerTab.classList.add("active");
            loginTab.classList.remove("active");

            registerForm.classList.remove("hidden");
            loginForm.classList.add("hidden");

        });


        /* ================= REGISTER ================= */

        registerForm.addEventListener("submit", function (e) {

            e.preventDefault();

            const name =
                document.getElementById("registerName").value.trim();

            const phone =
                document.getElementById("registerPhone").value.trim();

            const username =
                document.getElementById("registerUsername").value.trim();

            const password =
                document.getElementById("registerPassword").value;

            const confirmPassword =
                document.getElementById("registerConfirmPassword").value;

            const message =
                document.getElementById("registerMessage");


            if (password !== confirmPassword) {

                message.textContent = "❌ Passwords do not match.";
                message.style.color = "red";
                return;

            }

            if (!/^\d{10}$/.test(phone)) {

                message.textContent =
                    "❌ Enter a valid 10-digit phone number.";

                message.style.color = "red";
                return;

            }


            const existingUser =
                localStorage.getItem("englishUser");

            if (existingUser) {

                const oldUser = JSON.parse(existingUser);

                if (oldUser.username === username) {

                    message.textContent =
                        "❌ Username already exists.";

                    message.style.color = "red";
                    return;

                }

            }


            const user = {
                name,
                phone,
                username,
                password,
                tests: []
            };

            localStorage.setItem(
                "englishUser",
                JSON.stringify(user)
            );


            message.textContent =
                "✅ Account created successfully! Please login.";

            message.style.color = "green";

            registerForm.reset();

        });


        /* ================= LOGIN ================= */

        loginForm.addEventListener("submit", function (e) {

            e.preventDefault();

            const username =
                document.getElementById("loginUsername").value.trim();

            const password =
                document.getElementById("loginPassword").value;

            const message =
                document.getElementById("loginMessage");

            const storedUser =
                localStorage.getItem("englishUser");


            if (!storedUser) {

                message.textContent =
                    "❌ No account found. Please create an account.";

                message.style.color = "red";
                return;

            }


            const user = JSON.parse(storedUser);


            if (
                user.username === username &&
                user.password === password
            ) {

                localStorage.setItem("loggedIn", "true");

                showWebsite(user);

            } else {

                message.textContent =
                    "❌ Incorrect username or password.";

                message.style.color = "red";

            }

        });


        /* ================= SHOW WEBSITE ================= */

        function showWebsite(user) {

            authPage.classList.add("hidden");
            mainWebsite.classList.remove("hidden");

            document.getElementById("studentName")
                .textContent = user.name;

            document.getElementById("navUserName")
                .textContent = user.name;

            updateDashboard(user);

            window.scrollTo(0, 0);

        }


        /* ================= DASHBOARD ================= */

        function updateDashboard(user) {

            const tests = user.tests || [];

            document.getElementById("totalTests")
                .textContent = tests.length;

            if (tests.length === 0) {

                document.getElementById("bestScore")
                    .textContent = "0%";

                document.getElementById("averageScore")
                    .textContent = "0%";

                return;
            }


            const scores = tests.map(test => test.score);

            const best = Math.max(...scores);

            const average =
                Math.round(
                    scores.reduce((a, b) => a + b, 0) /
                    scores.length
                );

            document.getElementById("bestScore")
                .textContent = best + "%";

            document.getElementById("averageScore")
                .textContent = average + "%";

        }


        /* ================= LOGOUT ================= */

        document.getElementById("logoutBtn")
            .addEventListener("click", () => {

                localStorage.removeItem("loggedIn");

                mainWebsite.classList.add("hidden");
                authPage.classList.remove("hidden");

                loginForm.reset();

            });


        /* ================= MOBILE MENU ================= */

        document.getElementById("menuToggle")
            .addEventListener("click", () => {

                document.getElementById("mainNav")
                    .classList.toggle("show");

            });


        /* ================= NAVIGATION BUTTONS ================= */

        document.querySelectorAll("[data-target]")
            .forEach(button => {

                button.addEventListener("click", () => {

                    const target =
                        document.getElementById(
                            button.dataset.target
                        );

                    if (target) {

                        target.scrollIntoView({
                            behavior: "smooth"
                        });

                    }

                });

            });


        document.getElementById("startLearningBtn")
            .addEventListener("click", () => {

                document.getElementById("lessons")
                    .scrollIntoView({ behavior: "smooth" });

            });


        document.getElementById("heroPracticeBtn")
            .addEventListener("click", () => {

                document.getElementById("practice")
                    .scrollIntoView({ behavior: "smooth" });

            });


        /* ================= PRACTICE ================= */

        document.querySelectorAll(".option[data-correct]")
            .forEach(option => {

                option.addEventListener("click", () => {

                    const result =
                        document.getElementById("practiceResult");

                    if (option.dataset.correct === "true") {

                        result.textContent =
                            "✅ Correct! Excellent work.";

                        result.style.color = "green";

                    } else {

                        result.textContent =
                            "❌ Incorrect. Try again.";

                        result.style.color = "red";

                    }

                });

            });


        /* ================= MOCK TEST ================= */

        document.getElementById("mockTest")
            .addEventListener("submit", function (e) {

                e.preventDefault();

                let score = 0;

                if (
                    document.querySelector(
                        'input[name="q1"]:checked'
                    )?.value === "goes"
                ) {
                    score++;
                }

                if (
                    document.querySelector(
                        'input[name="q2"]:checked'
                    )?.value === "are"
                ) {
                    score++;
                }

                if (
                    document.querySelector(
                        'input[name="q3"]:checked'
                    )?.value === "b"
                ) {
                    score++;
                }


                const percentage =
                    Math.round((score / 3) * 100);


                const result =
                    document.getElementById("testResult");

                result.textContent =
                    `🎉 You scored ${score}/3 (${percentage}%)`;

                result.style.color =
                    percentage >= 60 ? "green" : "red";


                const storedUser =
                    localStorage.getItem("englishUser");

                if (storedUser) {

                    const user = JSON.parse(storedUser);

                    if (!user.tests) {
                        user.tests = [];
                    }

                    user.tests.push({
                        score: percentage,
                        date: new Date().toISOString()
                    });

                    localStorage.setItem(
                        "englishUser",
                        JSON.stringify(user)
                    );

                    updateDashboard(user);

                }

            });


        /* ================= AUTO LOGIN ================= */

        window.addEventListener("load", () => {

            const loggedIn =
                localStorage.getItem("loggedIn");

            const storedUser =
                localStorage.getItem("englishUser");


            if (loggedIn === "true" && storedUser) {

                showWebsite(JSON.parse(storedUser));

            }

        });

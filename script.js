if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
            console.log('Service Worker registrado com sucesso:', registration);
        })
        .catch(error => {
            console.error('Falha ao registrar o Service Worker:', error);
        });
}
if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.register('/service-worker.js').then((registration) => {
      console.log('Service Worker registrado com sucesso!', registration);
    }).catch((error) => {
      console.log('Falha ao registrar o Service Worker:', error);
    });
  } else {
    console.log('Background Sync não é suportado neste navegador.');
  }  
// Verifica se o navegador suporta Service Worker e Periodic Sync
if ("serviceWorker" in navigator && "periodicSync" in Registration.prototype) {
    navigator.serviceWorker.register("/service-worker.js").then(async (registration) => {
      console.log("✅ Service Worker registrado com sucesso!");
  
      // Solicita permissão para sincronização em background
      const status = await navigator.permissions.query({ name: "periodic-background-sync" });
  
      if (status.state === "granted") {
        try {
          await registration.periodicSync.register("sync-latest-data", {
            minInterval: 24 * 60 * 60 * 1000 // Sincroniza a cada 24h
          });
          console.log("✅ Periodic Background Sync registrado!");
        } catch (error) {
          console.error("❌ Erro ao registrar o Periodic Sync:", error);
        }
      } else {
        console.log("⚠️ Permissão para Background Sync não concedida.");
      }
    }).catch((error) => {
      console.error("❌ Falha ao registrar o Service Worker:", error);
    });
  } else {
    console.log("⚠️ Periodic Background Sync não suportado neste navegador.");
  }
document.addEventListener("DOMContentLoaded", function () {
    let index = 0;
    const slides = document.querySelectorAll(".carousel-slide");
    const container = document.querySelector(".carousel-container");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const dotsContainer = document.querySelector(".dots");
    const totalSlides = slides.length;

    if (!container || slides.length === 0 || !prevBtn || !nextBtn) {
        console.error("Erro: Elementos do carrossel não foram encontrados.");
        return;
    }

    slides.forEach((_, i) => {
        let dot = document.createElement("span");
        dot.classList.add("dot");
        dot.addEventListener("click", () => moveToSlide(i));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll(".dot");

    function updateCarousel() {
        container.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
    }

    function prevSlide() {
        index = (index > 0) ? index - 1 : totalSlides - 1;
        updateCarousel();
    }

    function nextSlide() {
        index = (index < totalSlides - 1) ? index + 1 : 0;
        updateCarousel();
    }

    function moveToSlide(i) {
        index = i;
        updateCarousel();
    }

    prevBtn.addEventListener("click", prevSlide);
    nextBtn.addEventListener("click", nextSlide);

    updateCarousel();
});


document.addEventListener("DOMContentLoaded", function () {

    // NAVIGASI
    const nav = document.querySelector("header nav");
    const navLinks = document.querySelectorAll('nav ul li a[href^="#"]');
    const menuButton = document.querySelector(".rasyad_menu_btn");

    // MENU HAMBURGER HP
    function closeMenu() {
        if (nav && menuButton) {
            nav.classList.remove("rasyad_menu_open");
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Buka menu");
        }
    }

    if (nav && menuButton) {
        menuButton.addEventListener("click", function () {
            const isOpen = nav.classList.toggle("rasyad_menu_open");

            menuButton.setAttribute("aria-expanded", isOpen);
            menuButton.setAttribute(
                "aria-label",
                isOpen ? "Tutup menu" : "Buka menu"
            );
        });

        navLinks.forEach(function (link) {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("click", function (event) {
            if (!nav.contains(event.target)) {
                closeMenu();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeMenu();
            }
        });
    }

    // SMOOTH SCROLL
    navLinks.forEach(function (link) {
        link.addEventListener("click", function (e) {
            const target = document.querySelector(link.getAttribute("href"));

            if (target) {
                e.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                history.replaceState(
                    null,
                    "",
                    link.getAttribute("href")
                );
            }
        });
    });

    // NAVIGASI AKTIF SAAT SCROLL
    const allSections = document.querySelectorAll("section[id]");

    function updateActiveNav() {
        let currentSection = "rasyad_home";

        allSections.forEach(function (section) {
            const sectionTop = section.getBoundingClientRect().top;

            if (sectionTop <= 160) {
                currentSection = section.getAttribute("id");
            }
        });

        if (
            allSections.length > 0 &&
            window.innerHeight + window.scrollY >=
            document.documentElement.scrollHeight - 5
        ) {
            currentSection =
                allSections[allSections.length - 1].getAttribute("id");
        }

        navLinks.forEach(function (link) {
            link.classList.remove("rasyad_active");

            if (link.getAttribute("href") === "#" + currentSection) {
                link.classList.add("rasyad_active");
            }
        });
    }

    window.addEventListener("scroll", updateActiveNav);
    updateActiveNav();

    // ANIMASI REVEAL
    const revealElements = document.querySelectorAll(
        ".rasyad_education_card, .rasyad_experience_card, " +
        ".rasyad_skill_card, .rasyad_project_card, " +
        ".rasyad_gallery_item, .rasyad_contact_card, " +
        ".rasyad_profile_content"
    );

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("rasyad_show");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(function (element) {
            element.classList.add("rasyad_reveal");
            observer.observe(element);
        });
    } else {
        revealElements.forEach(function (element) {
            element.classList.add("rasyad_show");
        });
    }

    // GALERI LIGHTBOX
    const galleryImages = document.querySelectorAll(
        ".rasyad_gallery_item img"
    );

    if (galleryImages.length > 0) {
        const lightbox = document.createElement("div");

        lightbox.className = "rasyad_gallery_lightbox";

        lightbox.innerHTML = `
            <button class="rasyad_close_lightbox" aria-label="Tutup">&times;</button>
            <img src="" alt="Gallery Preview">
            <div class="rasyad_lightbox_caption"></div>
        `;

        document.body.appendChild(lightbox);

        const preview = lightbox.querySelector("img");
        const caption = lightbox.querySelector(
            ".rasyad_lightbox_caption"
        );
        const closeButton = lightbox.querySelector(
            ".rasyad_close_lightbox"
        );

        galleryImages.forEach(function (img) {
            img.addEventListener("click", function () {
                preview.src = img.src;
                preview.alt = img.alt;
                caption.textContent = img.alt;

                lightbox.classList.add("rasyad_show");
                document.body.style.overflow = "hidden";
            });
        });

        function closeLightbox() {
            lightbox.classList.remove("rasyad_show");
            document.body.style.overflow = "";
        }

        closeButton.addEventListener("click", closeLightbox);

        lightbox.addEventListener("click", function (e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") {
                closeLightbox();
            }
        });
    }

    // NAVIGASI HALAMAN
    const rasyad_halaman =
        location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll('nav ul li a:not([href^="#"])')
        .forEach(function (link) {
            if (link.getAttribute("href") === rasyad_halaman) {
                link.classList.add("rasyad_active");
            }
        });

    // FORM KONTAK
    const rasyad_form = document.getElementById("rasyad_form_kontak");

    if (rasyad_form) {
        const rasyad_status = document.getElementById(
            "rasyad_form_status"
        );

        function rasyad_tampilStatus(teks, ok) {
            if (!rasyad_status) return;

            rasyad_status.textContent = teks;
            rasyad_status.className =
                "rasyad_form_status " +
                (ok ? "rasyad_status_ok" : "rasyad_status_error");
        }

        function rasyad_ambilData() {
            const nama = document.getElementById(
                "rasyad_input_nama"
            ).value.trim();

            const email = document.getElementById(
                "rasyad_input_email"
            ).value.trim();

            const pesan = document.getElementById(
                "rasyad_input_pesan"
            ).value.trim();

            if (!nama || !email || !pesan) {
                rasyad_tampilStatus(
                    "Mohon lengkapi semua kolom terlebih dahulu.",
                    false
                );
                return null;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                rasyad_tampilStatus(
                    "Format email belum benar.",
                    false
                );
                return null;
            }

            return {
                nama: nama,
                email: email,
                pesan: pesan
            };
        }

        // KIRIM WHATSAPP
        rasyad_form.addEventListener("submit", function (e) {
            e.preventDefault();

            const d = rasyad_ambilData();

            if (!d) return;

            const teks =
                "Halo Rasyad, saya " +
                d.nama +
                " (" + d.email + ").\n\n" +
                d.pesan;

            const url =
                "https://wa.me/6287729174391?text=" +
                encodeURIComponent(teks);

            window.open(url, "_blank");

            rasyad_tampilStatus(
                "Mengarahkan ke WhatsApp...",
                true
            );

            rasyad_form.reset();
        });

        // KIRIM EMAIL
        const emailButton = document.getElementById(
            "rasyad_btn_email"
        );

        if (emailButton) {
            emailButton.addEventListener("click", function () {
                const d = rasyad_ambilData();

                if (!d) return;

                const isi =
                    "Nama: " + d.nama +
                    "\nEmail: " + d.email +
                    "\n\n" + d.pesan;

                window.location.href =
                    "mailto:rasyad0907@gmail.com?subject=" +
                    encodeURIComponent("Pesan dari " + d.nama) +
                    "&body=" +
                    encodeURIComponent(isi);

                rasyad_tampilStatus(
                    "Membuka aplikasi email...",
                    true
                );
            });
        }
    }

});

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. Theme Toggle (Dark/Light Mode)
       ========================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');

    // Check for saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    /* ==========================================
       2. Sticky Header & Active Link Highlighting
       ========================================== */
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section');
    const navLinksList = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        // Sticky Header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active Link Highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinksList.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    /* ==========================================
       3. Mobile Menu Toggle
       ========================================== */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const menuIcon = mobileMenuBtn.querySelector('i');

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        if (navLinks.classList.contains('active')) {
            menuIcon.classList.remove('fa-bars');
            menuIcon.classList.add('fa-xmark');
        } else {
            menuIcon.classList.remove('fa-xmark');
            menuIcon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when a link is clicked
    navLinksList.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuIcon.classList.remove('fa-xmark');
            menuIcon.classList.add('fa-bars');
        });
    });

    /* ==========================================
       4. Scroll Reveal Animations
       ========================================== */
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    /* ==========================================
       5. Portfolio Gallery Filtering
       ========================================== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                // Since we are using masonry (column-count), setting `display: none` can break the columns.
                // We will use inline-block or block depending on if we want to show/hide.
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.classList.remove('hide');
                    item.style.display = 'block'; // Or inline-block if needed. For Masonry block is fine.
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                        item.classList.add('hide');
                    }, 400); // Wait for transition
                }
            });
        });
    });

    /* ==========================================
       6. Lightbox Functionality
       ========================================== */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    const viewBtns = document.querySelectorAll('.view-btn');
    const nextBtn = document.querySelector('.lightbox-next');
    const prevBtn = document.querySelector('.lightbox-prev');

    let currentIndex = 0;
    // Get visible gallery items for next/prev navigation
    let currentGalleryItems = [];

    function updateGalleryItems() {
        // Collect currently visible items based on filter
        currentGalleryItems = Array.from(galleryItems).filter(item => item.style.display !== 'none');
    }

    viewBtns.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            updateGalleryItems();

            // Find index of clicked item in the filtered array
            const parentItem = btn.closest('.gallery-item');
            currentIndex = currentGalleryItems.indexOf(parentItem);

            openLightbox(parentItem);
        });
    });

    function openLightbox(item) {
        const img = item.querySelector('img');
        const title = item.querySelector('h3').innerText;

        lightboxImg.src = img.src;
        lightboxCaption.innerText = title;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore scrolling
    }

    function navigateLightbox(direction) {
        updateGalleryItems();
        if (currentGalleryItems.length === 0) return;

        currentIndex += direction;

        if (currentIndex >= currentGalleryItems.length) {
            currentIndex = 0; // Loop back to start
        } else if (currentIndex < 0) {
            currentIndex = currentGalleryItems.length - 1; // Loop to end
        }

        const nextItem = currentGalleryItems[currentIndex];
        openLightbox(nextItem);
    }

    // Event Listeners for Lightbox Controls
    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', () => navigateLightbox(1));
    prevBtn.addEventListener('click', () => navigateLightbox(-1));

    // Close on outside click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') navigateLightbox(1);
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
    });

    /* ==========================================
       7. Contact Form Handling
       ========================================== */
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;

            btn.innerText = 'Sending...';
            btn.disabled = true;

            // Simulate sending message
            setTimeout(() => {
                btn.innerText = 'Message Sent!';
                btn.classList.add('success');
                contactForm.reset();

                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.classList.remove('success');
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    /* ==========================================
       8. Back to Top Button
       ========================================== */
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    /* ==========================================
       9. Premium Infinite Pricing Carousel
       ========================================== */
    const pricingSlider = document.getElementById('pricingScroll');

    if (pricingSlider) {
        // --- Setup Infinite Loop Clones ---
        const container = document.getElementById("pricingScroll");
        const cards = document.querySelectorAll(".pricing-card");

        const sliderContentWidth = Array.from(cards).reduce((acc, card) => acc + card.offsetWidth + 30, 0); // card width + gap

        // Clone cards twice so there is always a seamless overlap
        cards.forEach(card=>{
            let clone = card.cloneNode(true);
            container.appendChild(clone);
        });
        cards.forEach(card=>{
            let clone = card.cloneNode(true);
            container.appendChild(clone);
        });

        // Initialize state variables
        let isDown = false;
        let startX;
        let scrollLeft;
        let autoSlide;
        let interactionTimeout;

        // --- Core Scrolling Functions ---
        window.scrollPricing = function (direction) {
            const container = document.getElementById("pricingScroll");
            if (!container) return;
            const cardWidth = container.querySelector(".pricing-card").offsetWidth + 30; // 30 is the gap
            
            // Seamless Teleport BEFORE smooth scrolling so we don't interrupt it
            container.style.scrollBehavior = 'auto';
            if (direction === 1 && container.scrollLeft >= sliderContentWidth) {
                container.scrollLeft -= sliderContentWidth;
            } else if (direction === -1 && container.scrollLeft <= 0) {
                container.scrollLeft += sliderContentWidth;
            }
            
            // Force reflow
            void container.offsetWidth; 

            container.style.scrollBehavior = "smooth";
            container.scrollBy({
                left: direction * cardWidth,
                behavior: "smooth"
            });
            
            // User interacted manually via buttons: pause and wait 30s
            pauseForInteraction();
        };

        const startAutoSlide = () => {
            clearInterval(autoSlide);
            autoSlide = setInterval(() => scrollPricing(1), 3000);
        };

        const pauseForInteraction = () => {
            clearInterval(autoSlide);
            clearTimeout(interactionTimeout);
            interactionTimeout = setTimeout(() => {
                startAutoSlide();
            }, 30000); // 30 seconds
        };

        // Start it initially
        startAutoSlide();

        const containerNode = document.getElementById("pricingScroll");
        if (containerNode) {
            containerNode.addEventListener("mouseenter", () => {
                clearInterval(autoSlide);
                clearTimeout(interactionTimeout);
            });

            containerNode.addEventListener("mouseleave", () => {
                pauseForInteraction(); // Start the 30-second delay when mouse leaves
            });
        }

        // --- Infinite Loop Logic (For un-triggered scrolls like touchpads) ---
        let scrollTimeout;
        pricingSlider.addEventListener('scroll', () => {
            requestAnimationFrame(updateActiveCard);
            
            // Only trigger passive seamless jumping when scrolling settles (i.e. mouse touchpad or swiping rests)
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                pricingSlider.style.scrollBehavior = 'auto';
                if (pricingSlider.scrollLeft >= sliderContentWidth * 2) {
                    pricingSlider.scrollLeft -= sliderContentWidth;
                } else if (pricingSlider.scrollLeft <= 0) {
                    pricingSlider.scrollLeft += sliderContentWidth;
                }
                pricingSlider.style.scrollBehavior = 'smooth';
            }, 150);
        });

        // --- Active Center Card Logic ---
        const updateActiveCard = () => {
            const allCards = pricingSlider.querySelectorAll('.pricing-card');
            let center = pricingSlider.scrollLeft + pricingSlider.offsetWidth / 2;

            allCards.forEach(card => {
                let cardCenter = card.offsetLeft + card.offsetWidth / 2;

                if (Math.abs(center - cardCenter) < card.offsetWidth / 2) {
                    card.classList.add("active");
                } else {
                    card.classList.remove("active");
                }
            });
        };

        // --- Drag To Scroll Events ---
        pricingSlider.addEventListener('mousedown', (e) => {
            isDown = true;
            pricingSlider.style.cursor = 'grabbing';
            pricingSlider.style.scrollSnapType = 'none'; // Disable snap during drag
            startX = e.pageX - pricingSlider.offsetLeft;
            scrollLeft = pricingSlider.scrollLeft;
            clearInterval(autoSlide);
            clearTimeout(interactionTimeout);
        });

        pricingSlider.addEventListener('mouseup', () => {
            isDown = false;
            pricingSlider.style.cursor = 'grab';
            pricingSlider.style.scrollSnapType = 'x mandatory';
            pauseForInteraction(); // Start the 30s timer
        });

        pricingSlider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - pricingSlider.offsetLeft;
            const walk = (x - startX) * 2; // Scroll-fast multiplier
            
            pricingSlider.style.scrollBehavior = 'auto'; // Disable smooth behavior for direct drag mapping
            pricingSlider.scrollLeft = scrollLeft - walk;
            pricingSlider.style.scrollBehavior = 'smooth'; 
        });

        // --- Initialization ---
        // Let fonts and layouts settle before initializing active card
        setTimeout(() => {
            updateActiveCard();
        }, 100);

        window.addEventListener('resize', () => {
            requestAnimationFrame(updateActiveCard);
        });
    }

    /* ==========================================
       11. Service Card 3D Tilt Effect
       ========================================== */
    const serviceCards = document.querySelectorAll('.service-card');
    
    // Feature detect touch devices to disable tilt
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);

    if (!isTouchDevice) {
        serviceCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; // x position within the element
                const y = e.clientY - rect.top; // y position within the element
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Calculate rotation (max tilt: 10 degrees)
                const rotateX = ((y - centerY) / centerY) * -10;
                const rotateY = ((x - centerX) / centerX) * 10;
                
                // Apply the transform (including the scale and translate from hover)
                card.style.transform = `perspective(800px) translateY(-8px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            
            card.addEventListener('mouseleave', () => {
                // Reset to default hover transform via empty style string so CSS takes over
                card.style.transform = ''; 
            });
        });
    }

});
